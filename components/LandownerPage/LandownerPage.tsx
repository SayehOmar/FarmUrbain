import React from 'react';
import LandownerHeader from './LandownerHeader';
import FarmDetailsForm from './FarmDetailsForm';

const LandownerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <LandownerHeader />
      <main className="mx-auto max-w-4xl">
        <FarmDetailsForm />
      </main>
    </div>
  );
};

export default LandownerPage;