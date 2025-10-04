
import React from 'react';

interface NavbarProps {
  onRefresh: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRefresh }) => {
  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <a href="/" className="font-bold text-lg text-green-700">🌿 UrbanFarmSaaS</a>
        <span className="text-sm text-gray-500">Dashboard</span>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={onRefresh} className="px-3 py-2 bg-green-700 text-white rounded">Refresh Data</button>
        <a href="/" className="text-sm text-gray-600 hover:text-gray-900">Back to Landing</a>
      </div>
    </nav>
  );
};

export default Navbar;
