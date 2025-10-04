import React from 'react';
import Hero from './Hero';
import Features from './Features';
import CallToAction from './CallToAction';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;