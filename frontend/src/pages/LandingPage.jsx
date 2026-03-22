import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import Landing Components
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import InfoCards from '../components/landing/InfoCards';
import WhyIIT from '../components/landing/WhyIIT';
import DirectorMessage from '../components/landing/DirectorMessage';
import RecruitmentProcess from '../components/landing/RecruitmentProcess';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar Section */}
      <Navbar />

      {/* Hero Section with Login Buttons */}
      <HeroSection onLoginClick={handleLoginRedirect} onSignupClick={handleSignupRedirect} />

      {/* Overview / Info Cards */}
      <InfoCards />

      {/* Why IIT Section */}
      <WhyIIT />

      {/* Director's Message Section */}
      <DirectorMessage />

      {/* Recruitment Process (15 Steps) */}
      <RecruitmentProcess />

      {/* Contact Us Section */}
      <ContactSection />

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default LandingPage;
