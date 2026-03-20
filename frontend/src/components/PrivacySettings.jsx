import { useState, useEffect } from "react";
import api from "../api/api";

export default function PrivacySettings() {

  const [allowMessages, setAllowMessages] = useState(true);
  const [departmentOnly, setDepartmentOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/alumni/privacy");
        if (res.data?.privacySettings) {
          setAllowMessages(res.data.privacySettings.allowMessages);
          setDepartmentOnly(res.data.privacySettings.departmentOnly);
        }
      } catch (error) {
        console.error("Failed to load privacy settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updatePrivacy = async () => {
    try {
      await api.put("/alumni/privacy", {
        allowMessages,
        departmentOnly
      });

      alert("Privacy settings updated");

    } catch (error) {
      console.error(error);
    }
  };

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