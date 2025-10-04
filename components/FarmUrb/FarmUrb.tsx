import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ControlPanel from './ControlPanel';
import Map from './Map';
import CandidatesPanel from './CandidatesPanel';
import IoTSnapshot from './IoTSnapshot';

interface FarmUrbProps {
  navigateToLanding: () => void;
}

const FarmUrb: React.FC<FarmUrbProps> = ({ navigateToLanding }) => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedInfo, setSelectedInfo] = useState('Select a site to view details');
  const [selectedScore, setSelectedScore] = useState('');
  const [simResult, setSimResult] = useState('');
  const [map, setMap] = useState<any>(null);
  const [heatLayer, setHeatLayer] = useState<any>(null);
  const [candidateGroup, setCandidateGroup] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  const initialCandidates = [
    { id: 'C1', name: 'Tunis Centre Roof A', coords: [36.8008, 10.1859], NDVI: 0.12, NDBI: 0.65, LST: 28 },
    { id: 'C2', name: 'Ariana Lot B', coords: [36.8625, 10.1956], NDVI: 0.18, NDBI: 0.58, LST: 26 },
    { id: 'C3', name: 'Industrial Zone C', coords: [36.7721, 10.1510], NDVI: 0.05, NDBI: 0.75, LST: 30 },
    { id: 'C4', name: 'Suburb Far A', coords: [36.9100, 10.0870], NDVI: 0.35, NDBI: 0.30, LST: 22 },
    { id: 'C5', name: 'Rooftop Mall D', coords: [36.8035, 10.2064], NDVI: 0.08, NDBI: 0.70, LST: 29 }
  ];

  const initialSensors = [
    {id:'S1', loc:[36.8065,10.1815], temp:28, hum:35},
    {id:'S2', loc:[36.8600,10.1900], temp:26, hum:43},
    {id:'S3', loc:[36.7800,10.1500], temp:30, hum:30}
  ];

  useEffect(() => {
    if (map) return; // prevent re-initialization

    const L = require('leaflet');
    require('leaflet.heat');

    const mapInstance = L.map('map').setView([36.8065, 10.1815], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(mapInstance);
    setMap(mapInstance);

    const heat = (L as any).heatLayer([], {radius: 25, blur:15}).addTo(mapInstance);
    setHeatLayer(heat);

    const candidates = L.layerGroup().addTo(mapInstance);
    setCandidateGroup(candidates);

    setSensors(initialSensors);

    return () => {
        mapInstance.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map) return;

    const L = require('leaflet');

    const newMarkers: any[] = [];
    candidateGroup?.clearLayers();

    const computedCandidates = computeSuitability({NDVI:0.4, NDBI:0.3, LST:0.3});
    setCandidates(computedCandidates);

    computedCandidates.forEach((c: any) => {
      const m = L.circleMarker(c.coords, {radius:8, color:'#16a34a', fillColor:'#a7f3d0', fillOpacity:0.9})
        .bindPopup(`<strong>${c.name}</strong><br>NDVI:${c.NDVI}<br>NDBI:${c.NDBI}<br>LST:${c.LST} °C`)
        .on('click', ()=> {
          setSelectedInfo(c.name);
          setSelectedScore(`NDVI:${c.NDVI} NDBI:${c.NDBI} LST:${c.LST}°C`);
        });
      m.addTo(candidateGroup);
      newMarkers.push({id:c.id, marker:m, data:c});
    });
    setMarkers(newMarkers);

    const heatPoints = computedCandidates.map((c:any) => [c.coords[0], c.coords[1], (c.LST-20)/10]);
    heatLayer?.setLatLngs(heatPoints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const computeSuitability = (weights: { NDVI: number; NDBI: number; LST: number; }) => {
    return initialCandidates.map(c => {
      const ndviNorm = c.NDVI;
      const ndbiNorm = c.NDBI;
      const lstNorm = Math.min(Math.max((c.LST-20)/15, 0),1);
      const score = weights.NDVI*ndviNorm + weights.NDBI*(1-ndbiNorm) + weights.LST*(1-lstNorm);
      return {...c, score};
    }).sort((a,b)=> b.score - a.score);
  };

  const handleRunAHP = (weights: { NDVI: number; NDBI: number; LST: number; }) => {
    const computedCandidates = computeSuitability(weights);
    setCandidates(computedCandidates);

    const top = computedCandidates[0];
    const found = markers.find(m=>m.id===top.id);
    if(found){ map.setView(found.marker.getLatLng(),15); found.marker.openPopup(); }

    setSelectedInfo(`Top site: ${top.name}`);
    setSelectedScore(`Suitability score: ${top.score.toFixed(2)}`);
  };

  const handleToggleHeatmap = () => {
    if (map.hasLayer(heatLayer)) {
      map.removeLayer(heatLayer);
    } else {
      heatLayer.addTo(map);
    }
  };

  const handleShowCandidates = () => {
    if (map.hasLayer(candidateGroup)) {
      map.removeLayer(candidateGroup);
    } else {
      candidateGroup.addTo(map);
    }
  };

  const handleRefresh = () => {
    const newSensors = sensors.map(s => ({ ...s, temp: Math.round(24 + Math.random() * 8), hum: Math.round(30 + Math.random() * 40) }));
    setSensors(newSensors);
    alert('Sensor data refreshed (simulated)');
  };

  const handleDownloadReport = () => {
    const top = candidates[0];
    const report = `Site Report\nName: ${top.name}\nScore: ${top.score.toFixed(2)}\nNDVI:${top.NDVI}\nNDBI:${top.NDBI}\nLST:${top.LST}°C`;
    const blob = new Blob([report], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${top.id}_report.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const handleZoomTo = (id: string) => {
    const found = markers.find(m=>m.id===id);
    if(found){ map.setView(found.marker.getLatLng(),16); found.marker.openPopup(); }
  };

  const handleSimulate = (cooling: number) => {
    const top = candidates[0];
    const newLST = Math.max(0, top.LST - cooling);
    setSimResult(`If implemented at ${top.name}, estimated LST drop: ${cooling}°C (from ${top.LST}°C to ${newLST}°C)`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onRefresh={handleRefresh} navigateToLanding={navigateToLanding} />
      <main className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-6">
            <ControlPanel onRunAHP={handleRunAHP} onToggleHeatmap={handleToggleHeatmap} onShowCandidates={handleShowCandidates} />
            <IoTSnapshot sensors={sensors} />
        </div>
        <Map selectedInfo={selectedInfo} selectedScore={selectedScore} onDownloadReport={handleDownloadReport} />
        <CandidatesPanel candidates={candidates} onZoomTo={handleZoomTo} onSimulate={handleSimulate} simResult={simResult} />
      </main>
    </div>
  );
};

export default FarmUrb;