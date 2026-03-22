import React, { useState, useEffect } from 'react';

const DirectorMessage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullMessage = [
    "A warm welcome to IIT Bhilai. It gives me immense pleasure to write to you. IIT Bhilai has grown tremendously since its inception in 2016 and is slowly but surely evolving in stature. Our institute has established the required infrastructure, including a permanent campus spread over 400 acres in Bhilai, Durg district, Chhattisgarh. Our highly qualified faculty members are renowned in their respective fields and are recognized globally for fundamental and result-oriented research. We believe in fostering multidimensional social development through student clubs and co-curricular activities, which play a crucial role in nurturing professional talents. Thus, our students have been adequately prepared to unleash their potential.",
    "The Centre for Career Planning and Services (CCPS) aims to provide placement and internship opportunities and relevant training for students, along with guidance for their career progression. The CCPS Office runs smoothly under the supervision of Dr. Dhiman Saha (Faculty In-Charge) and Dr. Soumajit Pramanik (Associate Faculty In-Charge), who are supported by faculty coordinators from each discipline, handling important issues related to their respective disciplines. CCPS is involved in the decision-making process regarding placement-related matters and policies. A dedicated student placement team also aids the CCPS Office by coordinating placement drives, conducting placement preparedness activities, publicity, career guidance sessions, etc.",
    "This placement brochure will help the students who will participate in the seventh placement session, i.e., the students who will be graduating in the year 2026.",
    "All the best!"
  ];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <section id="director-message" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-16">
          <div className="md:w-1/3 w-full">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-900 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <img
                src="/images/Director.png"
                alt="Director"
                className="relative rounded-2xl shadow-2xl transition duration-500 w-full"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
                <p className="text-emerald-900 font-bold text-lg">Prof. Rajiv Prakash</p>
                <p className="text-gray-600 text-sm italic font-medium">Director, IIT Bhilai</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3 space-y-6">
            <h2 className="text-3xl font-bold text-emerald-900 italic font-montserrat tracking-tight">
              "Building the future leaders of the technology world."
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
              <p>{fullMessage[0]}</p>
              <p>The Centre for Career Planning and Services (CCPS) aims to provide placement and internship...</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 border-b-2 border-emerald-900 text-emerald-900 font-bold hover:bg-emerald-900 hover:text-white transition duration-300"
            >
              Read Full Message
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Content Box */}
          <div 
            className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 md:p-12 animate-slideUp"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-emerald-900 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Director's Message</h3>
                <p className="text-gray-500">Prof. Rajiv Prakash</p>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg font-light">
                {fullMessage.map((paragraph, index) => (
                  <p key={index} className={index === 3 ? "font-semibold text-emerald-900 pt-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DirectorMessage;