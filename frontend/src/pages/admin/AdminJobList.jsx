import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import { fetchJobs } from "../../api/jobsApi";

const AdminJobList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("ccps-token");

  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['jobs', token],
    queryFn: () => fetchJobs(token),
    enabled: !!token
  });

  const jobs = data?.jobs || [];

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 flex-1 text-center">
          <p className="text-xl dark:text-white">Loading job postings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 flex-1 text-center">
          <p className="text-xl text-red-500">Something went wrong: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">All Job Postings</h2>

        {jobs.length === 0 && (
          <p className="text-red-500">No job postings available.</p>
        )}

        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h3 className="text-xl font-bold dark:text-gray-100">{job.jobTitle}</h3>
              <p className="dark:text-gray-300">
                {job.Company} — <span className="italic">{job.Type}</span>
              </p>
              <p className="dark:text-gray-300">Batch: {job.batch}</p>
              <p className="dark:text-gray-300">Deadline: {new Date(job.Deadline).toLocaleDateString()}</p>
              <button
                onClick={() => navigate(`/admin/job/${job._id}/applicants`)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Applicants
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminJobList;
