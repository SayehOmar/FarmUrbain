import React from 'react';
import Hero from './Hero';
import Features from './Features';
import CallToAction from './CallToAction';
import Footer from './Footer';

interface LandingPageProps {
  navigateToSelection: () => void;
  navigateToFarmUrb: () => void;
  goBack: () => void;
  showBackButton: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigateToSelection, navigateToFarmUrb, goBack, showBackButton }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      <Hero navigateToSelection={navigateToSelection} navigateToFarmUrb={navigateToFarmUrb} goBack={goBack} showBackButton={showBackButton} />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;