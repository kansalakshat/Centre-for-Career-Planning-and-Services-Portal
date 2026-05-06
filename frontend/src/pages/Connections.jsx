import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Connections() {
  const navigate = useNavigate();

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const res = await api.get("/api/connect/incoming");
      const acceptedConnections = res.data.requests.filter(
        (req) => req.status === "accepted"
      );
      return acceptedConnections;
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold text-[#13665b] mb-6">
          Your Connections
        </h1>

        {connections.length === 0 ? (
          <p>No accepted connections yet</p>
        ) : (
          <div className="grid gap-4">
            {connections.map((conn) => (
              <div
                key={conn._id}
                className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {conn.studentId?.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {conn.purpose}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/chat/${conn.studentId._id}`)}
                  className="bg-[#13665b] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;