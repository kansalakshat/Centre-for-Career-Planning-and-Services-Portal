import React from 'react';

const JobDetailModal = ({ job, onClose }) => {
    if (!job) return null;

    const isCampus = job.Type === "On-Campus" || job.Type === "on-campus";

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`p-6 ${isCampus
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    }`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                                    {job.Type}
                                </span>
                                {job.source && job.source !== 'Internal' && (
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                                        via {job.source}
                                    </span>
                                )}
                                {job.eligibilityStatus && (
                                    <span className={`px-3 py-1 backdrop-blur-md text-xs font-semibold rounded-full ${
                                        job.eligibilityStatus === "Eligible"
                                            ? "bg-green-400/30 text-green-100"
                                            : "bg-red-400/30 text-red-100"
                                    }`}>
                                        {job.eligibilityStatus}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{job.jobTitle}</h2>
                            <p className="text-white/80 text-lg font-medium">{job.Company}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors flex-shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {job.salary && job.salary !== "Not Disclosed" && (
                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-center">
                                <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-1">Salary</p>
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{job.salary}</p>
                            </div>
                        )}
                        {job.location && (
                            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 text-center">
                                <p className="text-xs text-green-500 dark:text-green-400 font-medium mb-1">Location</p>
                                <p className="text-sm font-bold text-green-700 dark:text-green-300 truncate" title={job.location}>{job.location}</p>
                            </div>
                        )}
                        {job.batch && (
                            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3 text-center">
                                <p className="text-xs text-orange-500 dark:text-orange-400 font-medium mb-1">Batch</p>
                                <p className="text-sm font-bold text-orange-700 dark:text-orange-300">{job.batch}</p>
                            </div>
                        )}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Deadline</p>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {job.Deadline
                                    ? new Date(job.Deadline).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                    : "Open"}
                            </p>
                        </div>
                    </div>

                    {/* Skill Match & Applicants row */}
                    {(typeof job.skillMatchScore === "number" || typeof job.totalApplicants === "number") && (
                        <div className="grid grid-cols-2 gap-3">
                            {typeof job.skillMatchScore === "number" && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3">
                                    <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1">Skill Match</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.round(job.skillMatchScore * 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                                            {Math.round(job.skillMatchScore * 100)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                            {typeof job.totalApplicants === "number" && (
                                <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-3">
                                    <p className="text-xs text-pink-500 dark:text-pink-400 font-medium mb-1">Applicants</p>
                                    <p className="text-sm font-bold text-pink-700 dark:text-pink-300">
                                        👥 {job.totalApplicants}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {job.jobDescription}
                        </p>
                    </div>

                    {/* Skills */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-lg border border-indigo-100 dark:border-indigo-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alumni Connections */}
                    {job.alumniCount > 0 && Array.isArray(job.alumniList) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Alumni Connections ({job.alumniCount})
                            </h3>
                            <div className="space-y-3">
                                {job.alumniList.map((alum, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/40">
                                        <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold">
                                                {alum.name?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{alum.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Batch {alum.batch}</p>
                                            {alum.roles?.length > 0 && (
                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 italic">
                                                    {alum.roles.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Application Link */}
                    {(job.ApplicationLink || job.originalLink) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Application Link</h3>
                            <a
                                href={job.originalLink || job.ApplicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Open Application Page
                            </a>
                        </div>
                    )}

                    {/* Extra Info */}
                    {(job.Expiry || job.author || job.eligibilityReason) && (
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 dark:text-gray-500">
                                {job.Expiry && (
                                    <span>Expires: {new Date(job.Expiry).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                )}
                                {job.author && (
                                    <span>Posted by: {job.author}</span>
                                )}
                                {job.eligibilityReason && job.eligibilityStatus !== "Eligible" && (
                                    <span className="text-red-400 dark:text-red-500">
                                        ⚠ {job.eligibilityReason}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailModal;
