import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import ApplyModal from "../../components/ApplyModel";
import { fetchSavedApplications, unsaveJob } from "../../api/useSavedJobs";
import { fetchMyApplications } from "../../api/useApply";
import JobCard from "../../components/JobCard";
import { toast } from "react-hot-toast";

const SavedApplicationsPage = () => {
  const [savedApps, setSavedApps] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [saved, apps] = await Promise.all([
          fetchSavedApplications(),
          fetchMyApplications(),
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
    } catch {
      toast.error("Failed to refresh applications");
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      toast.success("Job unsaved!");
      // Remove from local state
      setSavedApps((prev) => prev.filter((s) => (s.jobId._id || s.jobId) !== jobId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to unsave job.");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-green-600"></div>
        </main>
      </div>
    );

  // Merge saved + applied (avoid duplicates by jobId)
  const allJobsMap = new Map();
  savedApps.forEach((s) => {
    if (s.jobId) allJobsMap.set(s.jobId._id, { job: s.jobId, saved: true });
  });
  myApps.forEach((a) => {
    if (a.jobId) {
      allJobsMap.set(a.jobId._id, {
        job: a.jobId,
        application: a,
        saved: allJobsMap.has(a.jobId._id),
      });
    }
  });
  const allJobs = Array.from(allJobsMap.values());

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:bg-none dark:bg-black">
      <Sidebar />
      <main className="flex-1 pt-20 md:pt-10 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 font-montserrat">
          <span className="text-[#13665b] dark:text-emerald-400">Saved</span> Applications
        </h1>

        {allJobs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-lg">No saved or applied applications yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {allJobs.map(({ job }) => (
              <JobCard
                key={job._id}
                job={job}
                myApps={myApps}
                savedJobs={savedApps}
                openApplyModal={openApplyModal}
                handleSaveJob={handleUnsave}
              />
            ))}
          </div>
        )}

        {isModalOpen && selectedJob && (
          <ApplyModal
            jobId={selectedJob._id}
            applicationLink={selectedJob.ApplicationLink}
            onClose={() => setIsModalOpen(false)}
            onApplied={handleApplied}
          />
        )}
      </main>
    </div>
  );
};

export default SavedApplicationsPage;
