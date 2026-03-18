import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";

const IncomingRequests = () => {

  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/connect/incoming");
      const pendingRequests = res.data.requests.filter(req => req.status === "pending");
      setRequests(pendingRequests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      await api.put(`/api/connect/accept/${id}`);
      fetchRequests();
    } catch (error) {
      console.error("Failed to accept request:", error);
      // Consider showing a toast/alert to the user
    }
  };

  const declineRequest = async (id) => {
    try {
      await api.put(`/api/connect/decline/${id}`);
      fetchRequests();
    } catch (error) {
      console.error("Failed to decline request:", error);
      // Consider showing a toast/alert to the user
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-1 p-6 bg-gray-50">

        <h2 className="text-2xl font-semibold text-[#13665b] mb-6">
          Incoming Requests
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full overflow-hidden"
            >
              {/* Header section */}
              <div className="p-5 border-b border-gray-50 bg-white">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    {req.studentId?.name}
                  </h3>
                  <span className="bg-teal-50 text-[#13665b] text-xs px-2 py-1 rounded-full font-medium">
                    Student
                  </span>
                </div>
                <a href={`mailto:${req.studentId?.email}`} className="text-[#0fa18e] hover:underline text-sm font-medium">
                  {req.studentId?.email}
                </a>
              </div>

              {/* Body section */}
              <div className="p-5 flex-1 flex flex-col gap-3 bg-gray-50/30">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Purpose</h4>
                  <p className="text-gray-800 text-sm font-medium">{req.purpose}</p>
                </div>

                <div className="flex-1">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Message</h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                    "{req.message}"
                  </p>
                </div>
              </div>

              {/* Actions section */}
              <div className="p-4 bg-white border-t border-gray-50 flex gap-3">
                <button
                  onClick={() => acceptRequest(req._id)}
                  className="flex-1 bg-[#13665b] text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 shadow-sm"
                >
                  Accept
                </button>

                <button
                  onClick={() => declineRequest(req._id)}
                  className="flex-1 bg-white text-gray-700 border border-gray-200 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default IncomingRequests;