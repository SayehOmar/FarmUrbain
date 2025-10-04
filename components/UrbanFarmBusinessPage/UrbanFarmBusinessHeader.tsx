import React from 'react';

interface UrbanFarmBusinessHeaderProps {
  goBack: () => void;
}

const UrbanFarmBusinessHeader: React.FC<UrbanFarmBusinessHeaderProps> = ({
  goBack,
}) => {
  return (
    <button
      onClick={goBack}
      className="absolute top-4 left-4 z-[1000] px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
    >
      ← Go Back
    </button>
  );
};

export default UrbanFarmBusinessHeader;
