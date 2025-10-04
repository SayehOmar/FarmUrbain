
import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white px-6">
      <h2 className="text-3xl md:text-4xl font-semibold text-center text-green-900 mb-12">
        Key Features
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="shadow-lg rounded-2xl p-6 text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105">
          <div className="w-12 h-12 bg-green-100 text-green-700 mx-auto mb-4 flex items-center justify-center rounded-full">🌡️</div>
          <h3 className="text-xl font-semibold mb-2">Heat Map Analytics</h3>
          <p className="text-gray-600">
            Detect and monitor urban heat islands with satellite and IoT data.
          </p>
        </div>

        <div className="shadow-lg rounded-2xl p-6 text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105">
          <div className="w-12 h-12 bg-green-100 text-green-700 mx-auto mb-4 flex items-center justify-center rounded-full">🏙️</div>
          <h3 className="text-xl font-semibold mb-2">Smart Site Selection</h3>
          <p className="text-gray-600">
            AI-powered recommendations for optimal farm locations.
          </p>
        </div>

        <div className="shadow-lg rounded-2xl p-6 text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105">
          <div className="w-12 h-12 bg-green-100 text-green-700 mx-auto mb-4 flex items-center justify-center rounded-full">🌿</div>
          <h3 className="text-xl font-semibold mb-2">Farm Monitoring</h3>
          <p className="text-gray-600">
            Real-time dashboards for climate, crop health, and water usage.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
