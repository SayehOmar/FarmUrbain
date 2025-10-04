"use client";

import React, { useState } from "react";
import LandingPage from '../components/LandingPage/LandingPage';
import SelectionPage from '../components/SelectionPage/SelectionPage';
import LandownerPage from '../components/LandownerPage/LandownerPage';
import UrbanFarmBusinessPage from '../components/UrbanFarmBusinessPage/UrbanFarmBusinessPage';

const App: React.FC = () => {
  const [page, setPage] = useState("landing");

  const navigateTo = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div>
      {page === "landing" && <LandingPage navigateToSelection={() => navigateTo("selection")} />}
      {page === "selection" && <SelectionPage navigateToUrbanFarm={() => navigateTo("urban-farm")} navigateToLandowner={() => navigateTo("landowner")} />}
      {page === "landowner" && <LandownerPage />}
      {page === "urban-farm" && <UrbanFarmBusinessPage />}
    </div>
  );
};

export default App;
