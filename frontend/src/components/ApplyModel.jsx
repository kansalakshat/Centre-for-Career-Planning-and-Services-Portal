import { applyToJob } from "../api/useApply";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// Zod schema for apply form
const applySchema = z.object({
  resume: z.string().url("Invalid resume URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const ApplyModal = ({ jobId, applicationLink, userProfile, onClose, onApplied }) => {
  const [formData, setFormData] = useState({
    resume: userProfile?.resumeUrl || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
  });

  const { mutate: submitApplication, isPending: loading } = useMutation({
    mutationFn: () => applyToJob({
      jobId,
      resume: formData.resume || "",
      phone: formData.phone || "",
      address: formData.address || "",
    }),
    onSuccess: () => {
      toast.success("Applied successfully");
      onApplied();
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Application failed");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zod validation
    const result = applySchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error?.errors?.[0];
      toast.error(firstError?.message || "Please check your inputs");
      return;
    }

    if (!window.confirm("Apply with saved details?")) return;
    submitApplication();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
          <h2 className="text-lg font-semibold text-white">Apply for This Role</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Resume URL */}
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resume URL (optional)
            </label>
            <input
              id="resume"
              type="url"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              placeholder="https://your-resume-link"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91-XXXXXXXXXX"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address (optional)
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your current address"
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* External Link */}
          {applicationLink && (
            <div className="text-right">
              <a
                href={applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Apply Externally &rarr;
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center transition"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin text-white mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 10-8 8z"
                  ></path>
                </svg>
              ) : null}
              <span>{loading ? "Submitting..." : "Submit Application"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;