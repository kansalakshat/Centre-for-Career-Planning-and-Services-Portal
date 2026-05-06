import React from 'react';

const RecruitmentProcess = () => {
  const steps = [
    "The Placement Office appoints a point of contact for you and sends invitations to recruiting organizations.",
    "Recruiters will be mailed the Job Application Form (JAF) and Internship Application Form (IAF).", // CUSTOM STEP 2
    "Recruiters interested in hiring will need to submit the filled JAF/IAF to the Training and Placement Office (TPO).", // CUSTOM STEP 3
    "Recruiters can now create jobs/internships containing the details of opportunity as required by the Placement Office.",
    "The details of the job are verified by the executive officers (including remuneration and other details).",
    "After successful verification, the job is made available online to the students as per dates decided by the Placement Office.",
    "Interested students apply for the job to participate in the recruitment process.",
    "Companies can view resumes of interested students and shortlist candidates using their online account.",
    "Companies proceed with tests/screening after finalizing the schedule in coordination with the Placement Office.",
    "Companies shortlist students for the final interview process.",
    "The Placement Office allots interview dates based on company requirements.",
    "The organization confirms the interview dates with the Placement Office.",
    "Organizations provide the list of selected students at the end of the interview process.",
    "The Placement Office notifies organizations regarding the acceptance of selected students.",
    "Organizations generate and deliver offer letters to selected candidates consistent with job details."
  ];

  return (
    <section id="process" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-emerald-900">Recruitment Process</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto" />
          <p className="text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            A simplified, efficient 15-step process designed for the benefit of both students and recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300 h-full flex flex-row items-center text-left space-x-5 transform hover:scale-[1.02] hover:border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold text-lg shrink-0 shadow-inner">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-gray-700 leading-snug">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecruitmentProcess;