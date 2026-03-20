import { useState } from "react";

function ConnectModal({ isOpen, onClose, onSubmit, loading }) {
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!purpose || !message) {
      alert("All fields are required");
      return;
    }

    onSubmit({ purpose, message });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Send Connection Request</h2>

        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Purpose</option>
          <option value="Career Guidance">Career Guidance</option>
          <option value="Referral">Referral</option>
          <option value="Internship Opportunity">Internship Opportunity</option>
          <option value="General Networking">General Networking</option>
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="w-full border p-2 rounded mb-4 h-24"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#13665b] text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectModal;