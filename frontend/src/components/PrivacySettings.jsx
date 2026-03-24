import { useState } from "react";
import api from "../api/api";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function PrivacySettings() {

  const [allowMessages, setAllowMessages] = useState(true);
  const [departmentOnly, setDepartmentOnly] = useState(false);

  const { isLoading: loading } = useQuery({
    queryKey: ["privacy-settings"],
    queryFn: async () => {
      const res = await api.get("/alumni/privacy");
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.privacySettings) {
        setAllowMessages(data.privacySettings.allowMessages);
        setDepartmentOnly(data.privacySettings.departmentOnly);
      }
    },
    onError: (error) => {
      console.error("Failed to load privacy settings:", error);
    },
  });

  const { mutate: updatePrivacy } = useMutation({
    mutationFn: () => api.put("/alumni/privacy", {
      allowMessages,
      departmentOnly
    }),
    onSuccess: () => {
      alert("Privacy settings updated");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">

      <h2 className="text-lg font-semibold mb-4">
        Privacy Settings
      </h2>

      <div className="space-y-4">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowMessages}
            onChange={(e) => setAllowMessages(e.target.checked)}
          />
          Allow students to send requests
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={departmentOnly}
            onChange={(e) => setDepartmentOnly(e.target.checked)}
          />
          Only students from same department
        </label>

        <button
          onClick={updatePrivacy}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Save Settings
        </button>

      </div>
    </div>
  );
}