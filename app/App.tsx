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
      {page === "landing" && <LandingPage navigateToFarmUrb={() => navigateTo("farmurb")} />}
      {page === "farmurb" && <FarmUrb navigateToLanding={() => navigateTo("landing")} />}
    </div>
  );
};

export default App;
