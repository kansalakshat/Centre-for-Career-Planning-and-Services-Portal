import React from 'react';
import { Instagram, Linkedin, Facebook } from "lucide-react"; // Added import

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:y-0">
          <div className="flex items-center space-x-3">
            <img src="/images/CCPS.png" alt="IIT Bhilai Logo" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-bold tracking-tight">Centre for Career Planning and Services</p>
              <p className="text-xs text-gray-400 uppercase">IIT Bhilai</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-light">
            © 2026 Indian Institute of Technology Bhilai. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {/* Instagram */}
            <a href="https://www.instagram.com/ccps_iit_bhilai/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
              <Instagram className="w-5 h-5" />
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/centre-for-career-planning-and-services-ccps-iit-bhilai-57588a194/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
              <Linkedin className="w-5 h-5" />
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/CCPSIITBhilai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
