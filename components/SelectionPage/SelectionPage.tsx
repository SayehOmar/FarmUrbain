
import React from 'react';

interface SelectionPageProps {
  navigateToUrbanFarm: () => void;
  navigateToLandowner: () => void;
}

const SelectionPage: React.FC<SelectionPageProps> = ({ navigateToUrbanFarm, navigateToLandowner }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">For Urban Farmers</h2>
          <p className="text-gray-600 mb-6">Find the perfect spot for your next urban farm. Browse available lands, check their specs, and secure your location.</p>
          <button onClick={navigateToUrbanFarm} className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
            Urban-Farm Business
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold mb-4">For Landowners</h2>
          <p className="text-gray-600 mb-6">Have unused land? List your property for urban farmers to rent. Contribute to a greener city and earn income.</p>
          <button onClick={navigateToLandowner} className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
            Landowner
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
