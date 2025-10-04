
import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-green-700 text-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to make cities cooler and greener?
      </h2>
      <p className="text-lg mb-6 max-w-2xl mx-auto">
        Join municipalities, urban planners, and innovators using our platform to fight
        heat and grow food sustainably.
      </p>
      <a
        href="/app"
        className="px-6 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100"
      >
        Go to App
      </a>
    </section>
  );
};

export default CallToAction;
