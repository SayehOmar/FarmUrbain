import React from "react";

interface HeroProps {
  navigateToSelection: () => void;
  navigateToFarmUrb: () => void;
  goBack: () => void;
  showBackButton: boolean;
}

const Hero: React.FC<HeroProps> = ({
  navigateToSelection,
  navigateToFarmUrb,
  goBack,
  showBackButton,
}) => {
  return (
    <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
      {showBackButton && (
        <button
          onClick={goBack}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>
      )}
      <h1 className="text-4xl md:text-6xl font-bold text-green-900">
        Climate-Smart Urban Farming Platform
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
        Harness AI, GIS, and IoT to combat Urban Heat Islands and build
        sustainable, climate-controlled farms in cities.
      </p>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={navigateToSelection}
          className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          Get Started
        </button>

        <a
          href="#features"
          className="px-6 py-3 border border-green-700 text-green-700 rounded-lg hover:bg-green-50"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};

export default Hero;
