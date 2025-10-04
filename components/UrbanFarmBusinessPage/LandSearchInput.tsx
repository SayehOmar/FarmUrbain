import React from 'react';

interface LandSearchInputProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LandSearchInput: React.FC<LandSearchInputProps> = ({
  handleSearch,
}) => {
  return (
    <input
      type="text"
      placeholder="Search lands..."
      onChange={handleSearch}
      className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
};

export default LandSearchInput;
