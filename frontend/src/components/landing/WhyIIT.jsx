import React, { useState, useEffect } from 'react';
import { Trophy, GraduationCap, FileText, Microscope } from 'lucide-react';

const WhyIIT = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const points = [
    {
      title: 'Top Ranking amongst Engineering Institutions (NIRF 2024)',
      content: 'IIT Bhilai secured the 72nd position in NIRF 2025 among the top 200 engineering colleges in India, 11th among all IITs in the Placement and Higher Studies Matrix, and 2nd among 3rd Generation IITs in the Median Salary Matrix, reflecting our commitment to excellent placements and student career success.',
      icon: Trophy,
      iconColor: 'text-yellow-400',
    },
    {
      title: 'World Class Curriculum and Faculty',
      content: 'IIT Bhilai has best-in-class faculty not only for their academic expertise but also for their global experience and insight. The institute provides a comprehensive yet flexible learning environment, with stress over project-based and hands-on teaching and liberal arts and creative arts to impart a more holistic education.',
      icon: GraduationCap,
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Rigorous Selection',
      content: 'The undergraduates at IIT Bhilai are scrutinized through IIT-JEE. The selection of various programmes at IIT Bhilai is extremely stringent to ensure that only the best of the students throughout the country secure admission which is considered one of the toughest examinations across the globe. Only the top 2% of the students make it to the IITs.',
      icon: FileText,
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Research and Collaboration',
      content: 'IIT Bhilai collaborates with research and industry through projects like the IMPRINT Grant, Nano Mission, and DST Inspire. Students work on faculty-led projects, including smart card solutions and vending machines. Numerous MoUs with industries and academia foster a collaborative environment, bridging the gap between industry and academia.',
      icon: Microscope,
      iconColor: 'text-purple-400',
    },
  ];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPoint) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPoint]);

  return (
    <section id="why-recruit" className="py-20 bg-emerald-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest">Why Recruit at IIT Bhilai?</h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto" />
          <p className="text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed">
            IIT Bhilai stands for academic excellence, innovation, and global leadership. Our students are trained to be the best in their respective fields.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition shadow-lg flex flex-col transform hover:scale-[1.02]">
              <div className="space-y-4">
                <point.icon className={`w-10 h-10 ${point.iconColor}`} strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-emerald-300 leading-tight">
                  {point.title}
                </h3>
                
                {/* Truncation Logic: Increased to 5 lines and removed justify-between to keep button close to text */}
                <p className="text-sm text-emerald-50/70 font-light leading-relaxed line-clamp-5">
                  {point.content}
                </p>
              </div>
              
              <div className="mt-auto pt-6">
                <button 
                  onClick={() => setSelectedPoint(point)}
                  className="text-sm font-bold text-emerald-400 hover:text-white transition-colors flex items-center group"
                >
                  Know More
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Logic: Controlled via selectedPoint state */}
      {selectedPoint && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPoint(null)}
        >
          <div 
            className="relative bg-white text-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl p-8 md:p-12 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPoint(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-emerald-900 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
                <selectedPoint.icon className={`w-12 h-12 ${selectedPoint.iconColor.replace('text-', 'text-opacity-80 text-')}`} strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-emerald-900 leading-tight">
                  {selectedPoint.title}
                </h3>
              </div>
              
              <div className="text-gray-700 leading-relaxed text-lg font-light">
                {selectedPoint.content}
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="px-8 py-3 bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800 transition shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhyIIT;