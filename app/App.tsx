"use client";

import React, { useState } from "react";
import LandingPage from "../components/LandingPage/LandingPage";
import SelectionPage from "../components/SelectionPage/SelectionPage";
import dynamic from "next/dynamic";

const DynamicUrbanFarmBusinessPage = dynamic(
  () => import("../components/UrbanFarmBusinessPage/UrbanFarmBusinessPage"),
  { ssr: false }
);
const DynamicFarmUrb = dynamic(() => import("../components/FarmUrb/FarmUrb"), {
  ssr: false,
});
const DynamicLandownerPage = dynamic(
  () => import("../components/LandownerPage/LandownerPage"),
  { ssr: false }
);

const App: React.FC = () => {
  const [history, setHistory] = useState<string[]>(["landing"]);
  const currentPage = history[history.length - 1];

  const navigateTo = (pageName: string) => {
    setHistory((prevHistory) => [...prevHistory, pageName]);
  };

  const goBack = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 1) {
        return prevHistory.slice(0, prevHistory.length - 1);
      }
      return prevHistory; // Stay on the current page if it's the first one
    });
  };

  return (
    <div>
      {currentPage === "landing" && (
        <LandingPage
          navigateToSelection={() => navigateTo("selection")}
          navigateToFarmUrb={() => navigateTo("farmurb")}
          goBack={goBack}
          showBackButton={history.length > 1}
        />
      )}
      {currentPage === "selection" && (
        <SelectionPage
          navigateToUrbanFarm={() => navigateTo("urban-farm")}
          navigateToLandowner={() => navigateTo("landowner")}
          goBack={goBack}
        />
      )}
      {currentPage === "landowner" && <DynamicLandownerPage />}
      {currentPage === "urban-farm" && (
        <DynamicUrbanFarmBusinessPage goBack={goBack} />
      )}
      {currentPage === "farmurb" && <DynamicFarmUrb goBack={goBack} />}
    </div>
  );
};

export default App;
