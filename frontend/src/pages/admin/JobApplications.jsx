
import { useParams } from "react-router-dom";
import { fetchApplicants, updateApplicationStatus } from "../../api/useApplications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const JobApplicants = () => {
  const { jobId } = useParams();
  const queryClient = useQueryClient();

  const { data: applicants = [] } = useQuery({
    queryKey: ["applicants", jobId],
    queryFn: () => fetchApplicants(jobId),
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants", jobId] });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
    },
  });

  const handleStatusChange = async (id, status) => {
    try {
      changeStatus({ id, status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Applicants</h2>

      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="bg-gray-100 rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {app.studentId?.name || "Unknown Name"}
                </p>
                <p className="text-sm text-gray-600">
                  {app.studentId?.email || "No email"}
                </p>
                <p>Status: <span className="font-medium">{app.status}</span></p>
              </div>
              <select
                className="border rounded p-1"
                value={app.status}
                onChange={(e) => handleStatusChange(app._id, e.target.value)}
              >
                <option value="applied">applied</option>
                <option value="under review">under review</option>
                <option value="selected">selected</option>
                <option value="rejected">rejected</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;