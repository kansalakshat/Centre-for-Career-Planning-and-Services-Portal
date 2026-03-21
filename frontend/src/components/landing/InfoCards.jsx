import React, { useState, useEffect } from 'react';

const InfoCards = () => {
  const [activeCard, setActiveCard] = useState(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (activeCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeCard]);

  const cards = [
    {
      title: 'Academic Facilities',
      image: '/images/campus.png',
      shortDesc: 'IIT Bhilai offers a dynamic and progressive learning environment designed to meet the evolving demands of modern education. The institute provides flexible academic programmes...',
      fullDesc: `IIT Bhilai offers a dynamic and progressive learning environment designed to meet the evolving demands of modern education. The institute provides flexible academic programmes that balance both depth and breadth of knowledge, while fostering creativity, innovation, and interdisciplinary learning. With the integration of modern teaching methodologies such as tele-education, research-oriented coursework, and a wide range of electives, students are encouraged to explore diverse domains and build a strong academic foundation.

The academic structure emphasizes a strong blend of theoretical understanding and practical application. Students are actively encouraged to engage in research, projects, and collaborative learning experiences from an early stage. The curriculum is continuously updated to incorporate emerging technologies and contemporary developments, ensuring alignment with global academic and industrial trends.

IIT Bhilai is equipped with state-of-the-art laboratories and facilities that support both teaching and advanced research. The Automation Systems Laboratory provides hands-on training in industrial technologies such as PLC-based control systems, sensors, motors, relays, and robotic manipulators, enabling students to gain practical exposure to modern automation and robotics. The Digital Fabrication Lab introduces students to next-generation manufacturing technologies such as 3D printing and rapid prototyping, fostering innovation and problem-solving skills through project-based learning.

The institute also houses a Central Instrumentation Facility (CIF), which enables researchers, faculty, and students to conduct advanced scientific investigations using sophisticated instruments and generate valuable research insights. In addition, well-equipped laboratories across disciplines provide opportunities for experimentation, analysis, and discovery, supporting both academic learning and cutting-edge research.

The Central Library serves as a vital knowledge hub, offering a rich collection of books, journals, theses, and digital resources across engineering, sciences, humanities, and management. With access to thousands of e-journals, national and international databases, and advanced research tools, the library ensures that students and researchers have continuous access to high-quality academic content. It also supports research visibility and academic integrity through platforms for faculty profiling and tools such as plagiarism detection and writing assistance systems.

IIT Bhilai’s IT infrastructure further strengthens the academic ecosystem. The institute’s Information Technology and Infrastructure Services (ITIS) provides seamless high-speed network connectivity, advanced computing facilities, and access to high-performance servers and storage systems. With robust internet connectivity through national research networks, students and faculty benefit from uninterrupted access to global knowledge resources and collaborative platforms.

Beyond academics, the institute promotes holistic development by encouraging creativity and self-expression through courses in creative arts such as music, filmmaking, fine arts, and performing arts. This integration of technical education with creative exploration helps nurture well-rounded individuals with strong leadership qualities and an entrepreneurial mindset.

Within a short span of time, IIT Bhilai has established a robust academic ecosystem and a stimulating intellectual environment that encourages curiosity, critical thinking, and lifelong learning. The institute remains committed to shaping individuals who are not only academically proficient but also socially responsible and capable of contributing meaningfully to global progress.`,
    },
    {
      title: 'Departments & Programs',
      image: '/images/Lab.png',
      shortDesc: 'IIT Bhilai offers a comprehensive range of academic programmes across engineering, sciences, and interdisciplinary domains...',
      fullDesc: `IIT Bhilai offers a comprehensive range of academic programmes across engineering, sciences, and interdisciplinary domains, designed to prepare students for the evolving demands of technology, research, and society. The institute provides undergraduate, postgraduate, and doctoral programmes with a strong emphasis on conceptual clarity, practical exposure, and innovation.

The academic structure at IIT Bhilai follows a modern and flexible approach that integrates breadth and depth of knowledge. It promotes interdisciplinary learning, encourages undergraduate research, and provides students with a wide choice of electives and emerging areas of study. This framework ensures that students are not only academically strong but also industry-ready and research-oriented.

The curriculum is complemented by project-based learning, industry collaborations, and exposure to cutting-edge technologies. Students actively participate in research, internships, and technical activities, enabling them to develop problem-solving skills, creativity, and leadership qualities.

Departments at IIT Bhilai

The institute hosts a diverse set of departments across core engineering, sciences, and interdisciplinary areas:
• Computer Science and Engineering
• Data Science and Artificial Intelligence
• Electrical Engineering
• Electronics and Communication Engineering
• Mechanical Engineering
• Mechatronics Engineering
• Materials Science and Metallurgical Engineering
• Bioscience and Biomedical Engineering
• Chemistry
• Mathematics
• Physics
• Liberal Arts

These departments work collaboratively to foster interdisciplinary research and innovation, addressing real-world challenges and contributing to technological advancement.

Programmes Offered

IIT Bhilai offers programmes at multiple levels to cater to diverse academic and research interests:

• Undergraduate Programmes (B.Tech)
Designed to build strong fundamentals in engineering and sciences, with emphasis on analytical thinking, hands-on learning, and real-world applications.

• Postgraduate Programmes (M.Tech / M.Sc)
Focused on specialization and advanced technical knowledge, enabling students to explore cutting-edge domains and research areas.

• Doctoral Programmes (Ph.D.)
Aimed at fostering high-quality research and innovation, allowing scholars to contribute to global scientific and technological advancements.

Academic Highlights

• Flexible and interdisciplinary curriculum
• Strong integration of theory with practical learning
• Emphasis on research, innovation, and entrepreneurship
• Exposure to modern technologies and industry practices
• Opportunities for global research and higher studies
• Supportive academic ecosystem with modern infrastructure

Departmental Strength & Ecosystem

Each department at IIT Bhilai contributes uniquely to the institute’s academic excellence:

• Advanced laboratories and research facilities
• Active research in emerging domains such as AI, robotics, communication systems, materials, and biomedical sciences
• Strong industry collaboration and internship opportunities
• Faculty engaged in high-impact research and global collaborations

The institute continues to expand its academic programmes and research domains, ensuring alignment with global technological trends and societal needs.`,
    },
  ];

  return (
    <section id="overview" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {cards.map((card, index) => (
            <div key={index} className="group overflow-hidden rounded-2xl bg-white shadow-xl transform transition hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition duration-300 z-10" />
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-emerald-900">{card.title}</h3>
                <p className="text-gray-700 leading-relaxed font-semibold">{card.shortDesc}</p>
                <button
                  onClick={() => setActiveCard(card)}
                  className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-800 transition"
                >
                  Read More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up Modal */}
      {activeCard && (
        <div 
          onClick={() => setActiveCard(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-emerald-900">{activeCard.title}</h3>
              <button onClick={() => setActiveCard(null)} className="text-gray-400 hover:text-gray-600 transition p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto text-gray-800 leading-relaxed font-medium whitespace-pre-line">
              {activeCard.fullDesc}
            </div>
            <div className="p-6 bg-gray-50 text-right rounded-b-2xl">
              <button 
                onClick={() => setActiveCard(null)}
                className="px-8 py-2 bg-emerald-900 text-white font-bold rounded-lg hover:bg-emerald-800 transition shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InfoCards;
