import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
// Ensure fetchAppliedJobs is imported from your API service file
import { fetchJobs, fetchMyApplications, fetchAppliedJobs, applyToJob, withdrawApplication } from "../../api/useApply";
import Sidebar from "../../components/Sidebar";
import ApplyModal from "../../components/ApplyModel";
import { saveJob, unsaveJob, fetchSavedApplications } from "../../api/useSavedJobs";

import JobCard from "../../components/JobCard";
import JobDetailModal from "../../components/JobDetailModal";
import JobFilter from "../../components/JobFilter";

import { useAuthContext } from "../../context/AuthContext";
import { getStudentProfile } from "../../api/profile/useStudentProfile";

const userData = {
  resumeUrl: "",
  phone: "",
  address: "",
};


const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]); // NEW STATE
  const [appliedJobsList, setAppliedJobsList] = useState([]); // NEW STATE
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [filterLocation, setFilterLocation] = useState("");

  const [activeTab, setActiveTab] = useState("jobs"); // <-- NEW STATE for tab
  const [offCampusLimit, setOffCampusLimit] = useState(30); // Pagination for external jobs
  const [externalJobToConfirm, setExternalJobToConfirm] = useState(null); // Tracking external application confirmation
  const [detailJob, setDetailJob] = useState(null); // Job detail modal

  const { authUser } = useAuthContext();
  const [profile, setProfile] = useState(userData);


  const loadAll = async () => {
    try {
      const [jobList, { onCampus, offCampus }, dedicatedAppliedList, savedList] = await Promise.all([
        fetchJobs(),
        fetchMyApplications(),
        fetchAppliedJobs(), // Fetch dedicated applied list
        fetchSavedApplications(), // Fetch saved jobs
        fetchProfile(),
      ]);
      setJobs(jobList);
      setMyApps([...onCampus, ...offCampus]);
      setAppliedJobsList(dedicatedAppliedList); // Set new state
      setSavedJobs(savedList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load jobs/applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = () => {
    if (!authUser?._id) return;
    setLoading(true);
    getStudentProfile(authUser._id)
      .then((data) => {
        setProfile({ ...userData, ...data });
      })
      .catch(() => {
        setProfile((prev) => ({
          ...prev,
          resumeUrl: authUser.resumeUrl,
          phone: authUser.phone,
          address: authUser.address,
        }));
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleApplied = async () => {
    try {
      // Refresh both application lists for automatic update
      const [{ onCampus, offCampus }, dedicatedAppliedList] = await Promise.all([
        fetchMyApplications(),
        fetchAppliedJobs(),
      ]);
      setMyApps([...onCampus, ...offCampus]);
      setAppliedJobsList(dedicatedAppliedList);
      toast.success("Application submitted and list updated!");
    } catch (err) {
      console.error("Error refreshing applications:", err);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const isAlreadySaved = savedJobs.some(s => s.jobId._id === jobId || s.jobId === jobId);

      if (isAlreadySaved) {
        await unsaveJob(jobId);
        toast.success("Job unsaved!");
        setSavedJobs(prev => prev.filter(s => (s.jobId._id || s.jobId) !== jobId));
      } else {
        await saveJob(jobId);
        toast.success("Job saved!");
        // We might want to re-fetch or optimistically update. 
        // For simplicity, let's just re-fetch saved jobs to be sure we have the full object if needed, 
        // or just append a placeholder if structure allows.
        // Let's re-fetch for now to be safe.
        const updatedSaved = await fetchSavedApplications();
        setSavedJobs(updatedSaved);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job save status.");
    }
  };
  
  const handleExternalApplyClick = (job) => {
    setExternalJobToConfirm(job);
  };

  const handleExternalAppliedConfirm = async (confirmed) => {
    if (confirmed && externalJobToConfirm) {
      try {
        await applyToJob({
          jobId: externalJobToConfirm._id,
          resume: profile.resumeUrl || "",
          phone: profile.phone || "",
          address: profile.address || "",
        });
        toast.success(`Tracked application for ${externalJobToConfirm.jobTitle}`);
        handleApplied(); // Refresh lists
      } catch (err) {
        toast.error(err.message || "Failed to track external application");
      }
    }
    setExternalJobToConfirm(null);
  };

  const handleWithdraw = async (jobId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await withdrawApplication(jobId);
      toast.success("Application withdrawn successfully");
      handleApplied(); // Refresh lists
    } catch (err) {
      toast.error(err.message || "Failed to withdraw application");
    }
  };

  const availableSources = Array.from(new Set(jobs.map(j => j.source || 'Internal'))).filter(Boolean);
  const availableLocations = Array.from(new Set(jobs.map(j => 
    j.location || (j.JobLocation && j.JobLocation.length > 0 ? j.JobLocation[0] : '')
  ))).filter(Boolean).sort();

  const filteredJobs = jobs.filter((job) => {
    // 1. Search by Title or Company
    const searchMatch = 
      (job.jobTitle && job.jobTitle.toLowerCase().includes(search.toLowerCase())) ||
      (job.Company && job.Company.toLowerCase().includes(search.toLowerCase()));
      
    // 2. Filter by Source
    const jobSource = job.source || 'Internal';
    const sourceMatch = filterSource === "All" || jobSource === filterSource;
    
    // 3. Filter by Location
    const jobLoc = job.location || (job.JobLocation && job.JobLocation.length > 0 ? job.JobLocation[0] : '');
    const locationMatch = !filterLocation || jobLoc.toLowerCase().includes(filterLocation.toLowerCase());

    return searchMatch && sourceMatch && locationMatch;
  });

  // Helper to extract the highest numerical salary value from strings like "12.0 LPA" or "6.0-20.0 LPA"
  const getMaxSalary = (salaryStr) => {
    if (!salaryStr || salaryStr === "Not Disclosed") return 0;
    // Extract all numbers (integers or decimals) from the string
    const numbers = salaryStr.match(/\d+(\.\d+)?/g);
    if (!numbers) return 0;
    // Return the maximum number found (so "6.0-20.0" returns 20.0)
    return Math.max(...numbers.map(Number));
  };

  const grouped = {
    onCampus: filteredJobs.filter((job) => job.Type === "on-campus"),
    offCampus: filteredJobs
      .filter((job) => job.Type === "off-campus")
      .sort((a, b) => getMaxSalary(b.salary) - getMaxSalary(a.salary)),
  };

  const renderJobs = (jobsList) =>
    jobsList.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.894"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">No jobs available</p>
        <p className="text-gray-400 text-sm mt-1">Check back later for new opportunities</p>
      </div>
    ) : (
      // Using the JobCard component here
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobsList.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            myApps={myApps}
            savedJobs={savedJobs}
            openApplyModal={openApplyModal}
            handleSaveJob={handleSaveJob}
            onExternalApply={handleExternalApplyClick}
            onWithdraw={handleWithdraw}
            onCardClick={setDetailJob}
          />
        ))}
      </div>
    );

  if (loading)
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-none dark:bg-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center pt-20 sm:pt-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading amazing opportunities...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:bg-none dark:bg-black">
      <Sidebar />
      <main className="flex-1 pt-20 md:pt-8 px-4 sm:px-6 lg:px-8 w-full">

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-2 px-3 font-semibold ${activeTab === "jobs"
              ? "text-[#13665b] border-b-2 border-[#13665b]"
              : "text-gray-500 dark:text-gray-400"
              }`}
          >
            Job Opportunities
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`pb-2 px-3 font-semibold ${activeTab === "applied"
              ? "text-[#13665b] border-b-2 border-[#13665b]"
              : "text-gray-500"
              }`}
          >
            My Applied Jobs
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "applied" ? (
          <>
            {/* NEW SECTION: APPLIED JOBS LIST */}
            <section>
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Applied Jobs</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">A dedicated list of all jobs you have applied for</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {appliedJobsList.length} total
                  </span>
                </div>
              </div>
              {appliedJobsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <p className="text-gray-500 text-lg font-medium">No applied jobs found.</p>
                  <p className="text-gray-400 text-sm mt-1">Apply to a job to see it listed here!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {appliedJobsList.map((job) => (
                    <JobCard
                      key={job._id}
                      job={{
                        ...job,
                        status: job.applicationStatus || 'Pending',
                        applied: true,
                        Type: job.Type || 'Off-Campus' // Default type if missing
                      }}
                      myApps={appliedJobsList} // Pass the dedicated list for status check
                      savedJobs={savedJobs}
                      isAppliedJob={true}
                      onWithdraw={handleWithdraw}
                      onCardClick={setDetailJob}
                    />
                  ))}
                </div>
              )}
            </section>
            {/* END NEW SECTION */}
          </>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Job <span className="text-[#13665b] dark:text-emerald-400">Opportunities</span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Discover your next career adventure</p>
                </div>
              </div>

              {/* Job Filters */}
              <JobFilter 
                search={search}
                setSearch={setSearch}
                filterSource={filterSource}
                setFilterSource={setFilterSource}
                filterLocation={filterLocation}
                setFilterLocation={setFilterLocation}
                availableSources={availableSources}
                availableLocations={availableLocations}
              />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.894"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
                      <p className="text-xs text-gray-500">Total Jobs</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{grouped.onCampus.length}</p>
                      <p className="text-xs text-gray-500">On-Campus</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{grouped.offCampus.length}</p>
                      <p className="text-xs text-gray-500">Off-Campus</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{myApps.length}</p>
                      <p className="text-xs text-gray-500">Applied</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full mr-4"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">On-Campus Opportunities</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Jobs available within your campus</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                      {grouped.onCampus.length} available
                    </span>
                  </div>
                </div>
                {renderJobs(grouped.onCampus)}
              </section>

              <section>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-4"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Off-Campus Opportunities</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">External job opportunities</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                      {grouped.offCampus.length} available
                    </span>
                  </div>
                </div>
                {renderJobs(grouped.offCampus.slice(0, offCampusLimit))}
                
                {grouped.offCampus.length > offCampusLimit && (
                  <div className="flex justify-center mt-10 pb-12">
                    <button
                      onClick={() => setOffCampusLimit(prev => prev + 30)}
                      className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-900 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm flex items-center space-x-2"
                    >
                      <span>Show More Off-Campus Jobs</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      {isModalOpen && selectedJob && (
        <ApplyModal
          jobId={selectedJob._id}
          applicationLink={selectedJob.ApplicationLink}
          userProfile={profile}
          onClose={() => setIsModalOpen(false)}
          onApplied={handleApplied}
        />
      )}

      {externalJobToConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Application Feedback</h3>
              <p className="text-blue-100 text-sm">Help us track your progress</p>
            </div>
            
            <div className="p-8 text-center">
              <p className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-6">
                Did you complete your application for <span className="text-blue-600 dark:text-blue-400 font-bold">{externalJobToConfirm.jobTitle}</span> at {externalJobToConfirm.Company}?
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleExternalAppliedConfirm(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
                >
                  No, not yet
                </button>
                <button
                  onClick={() => handleExternalAppliedConfirm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none hover:shadow-blue-300 hover:scale-[1.02] transition-all active:scale-95"
                >
                  Yes, I applied!
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setExternalJobToConfirm(null)}
              className="w-full py-4 text-gray-400 dark:text-gray-500 text-xs hover:text-gray-600 dark:hover:text-gray-400 transition-colors border-t border-gray-100 dark:border-gray-700"
            >
              I'll answer this later
            </button>
          </div>
        </div>
      )}

      {detailJob && (
        <JobDetailModal job={detailJob} onClose={() => setDetailJob(null)} />
      )}
    </div>
  );
};

export default Applications;
