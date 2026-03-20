import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import ApplyModal from "../../components/ApplyModel";
import { fetchSavedApplications, unsaveJob, saveJob } from "../../api/useSavedJobs";
import { fetchMyApplications, withdrawApplication, applyToJob } from "../../api/useApply";
import JobCard from "../../components/JobCard";
import JobDetailModal from "../../components/JobDetailModal";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { getStudentProfile } from "../../api/profile/useStudentProfile";

const userData = {
  resumeUrl: "",
  phone: "",
  address: "",
};

const SavedApplicationsPage = () => {
  const [savedApps, setSavedApps] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailJob, setDetailJob] = useState(null);
  const [externalJobToConfirm, setExternalJobToConfirm] = useState(null);

  const { authUser } = useAuthContext();
  const [profile, setProfile] = useState(userData);

  const loadAll = async () => {
    try {
      const [saved, apps] = await Promise.all([
        fetchSavedApplications(),
        fetchMyApplications(),
        fetchProfile(),
      ]);
      setSavedApps(saved || []);
      setMyApps([...(apps.onCampus || []), ...(apps.offCampus || [])]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load saved/applications data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = () => {
    if (!authUser?._id) return Promise.resolve();
    return getStudentProfile(authUser._id)
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
      });
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
      const apps = await fetchMyApplications();
      setMyApps([...(apps.onCampus || []), ...(apps.offCampus || [])]);
      toast.success("Application list updated!");
    } catch {
      toast.error("Failed to refresh applications");
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const isAlreadySaved = savedApps.some(s => (s.jobId?._id || s.jobId) === jobId);
      if (isAlreadySaved) {
        await handleUnsave(jobId);
      } else {
        await saveJob(jobId);
        toast.success("Job saved!");
        const updatedSaved = await fetchSavedApplications();
        setSavedApps(updatedSaved);
      }
    } catch (err) {
      toast.error("Failed to update job save status.");
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      toast.success("Job unsaved!");
      setSavedApps((prev) => prev.filter((s) => (s.jobId?._id || s.jobId) !== jobId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to unsave job.");
    }
  };

  const handleWithdraw = async (jobId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await withdrawApplication(jobId);
      toast.success("Application withdrawn successfully");
      handleApplied();
    } catch (err) {
      toast.error(err.message || "Failed to withdraw application");
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
        handleApplied();
      } catch (err) {
        toast.error(err.message || "Failed to track external application");
      }
    }
    setExternalJobToConfirm(null);
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-none dark:bg-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center pt-20 sm:pt-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );

  // Combine jobs to show in a single list (Priority: Applied status > Saved status)
  const allJobsMap = new Map();

  // First, add all saved jobs
  savedApps.forEach((s) => {
    if (s.jobId) {
      allJobsMap.set(s.jobId._id, { ...s.jobId, isSaved: true });
    }
  });

  // Then, update with applied status
  myApps.forEach((app) => {
    const jobData = app.jobId;
    if (jobData) {
      const existing = allJobsMap.get(jobData._id) || { ...jobData };
      allJobsMap.set(jobData._id, {
        ...existing,
        isApplied: true,
        applicationStatus: app.status || 'applied'
      });
    }
  });

  const allJobs = Array.from(allJobsMap.values());

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:bg-none dark:bg-black">
      <Sidebar />
      <main className="flex-1 pt-20 md:pt-10 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">
            <span className="text-[#13665b] dark:text-emerald-400">My</span> Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your saved and applied applications</p>
        </div>

        {allJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No jobs saved or applied yet.</p>
            <p className="text-gray-400 text-sm mt-2">Start exploring on the job opportunities page!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            {allJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                myApps={myApps}
                savedJobs={savedApps}
                isAppliedJob={job.isApplied}
                openApplyModal={openApplyModal}
                handleSaveJob={handleSaveJob}
                onWithdraw={handleWithdraw}
                onCardClick={setDetailJob}
                onExternalApply={handleExternalApplyClick}
              />
            ))}
          </div>
        )}

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
      </main>
    </div>
  );
};

export default SavedApplicationsPage;
