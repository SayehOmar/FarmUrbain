"use client";

import React, { useState } from "react";
import LandingPage from '../components/LandingPage/LandingPage';
import FarmUrb from '../components/FarmUrb/FarmUrb';

const App: React.FC = () => {
  const [page, setPage] = useState("landing");

  const navigateTo = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div>
      <nav className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a
            href="#"
            onClick={() => navigateTo("landing")}
            className="font-bold text-lg text-green-700"
          >
            🌿 UrbanFarmSaaS
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="#"
            onClick={() => navigateTo("landing")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Landing
          </a>
          <a
            href="#"
            onClick={() => navigateTo("farmurb")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            App
          </a>
        </div>
      </nav>

      {page === "landing" && <LandingPage />}
      {page === "farmurb" && <FarmUrb />}
    </div>
  );
};

export default App;
