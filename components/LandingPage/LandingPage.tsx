import React from 'react';
import Hero from './Hero';
import Features from './Features';
import CallToAction from './CallToAction';
import Footer from './Footer';

interface LandingPageProps {
  navigateToFarmUrb: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigateToFarmUrb }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      <Hero navigateToFarmUrb={navigateToFarmUrb} />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;