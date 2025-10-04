
import React from 'react';

interface ControlPanelProps {
  onRunAHP: (weights: { NDVI: number; NDBI: number; LST: number; }) => void;
  onToggleHeatmap: () => void;
  onShowCandidates: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onRunAHP, onToggleHeatmap, onShowCandidates }) => {
  const [wNDVI, setWNDVI] = React.useState(0.4);
  const [wNDBI, setWNDBI] = React.useState(0.3);
  const [wLST, setWLST] = React.useState(0.3);

  const handleRunAHP = () => {
    const total = wNDVI + wNDBI + wLST || 1;
    onRunAHP({ NDVI: wNDVI / total, NDBI: wNDBI / total, LST: wLST / total });
  };

  return (
    <section className="md:col-span-1 bg-white rounded-lg shadow p-4 panel">
      <h3 className="font-semibold text-lg mb-2">Site Selection (AHP)</h3>

      <label className="block text-sm text-gray-600 mt-3">Weight - Vegetation (NDVI): <span>{wNDVI}</span></label>
      <input type="range" min="0" max="1" step="0.01" value={wNDVI} onChange={e => setWNDVI(parseFloat(e.target.value))} className="w-full" />

      <label className="block text-sm text-gray-600 mt-3">Weight - Impervious (NDBI): <span>{wNDBI}</span></label>
      <input type="range" min="0" max="1" step="0.01" value={wNDBI} onChange={e => setWNDBI(parseFloat(e.target.value))} className="w-full" />

      <label className="block text-sm text-gray-600 mt-3">Weight - Temperature (LST): <span>{wLST}</span></label>
      <input type="range" min="0" max="1" step="0.01" value={wLST} onChange={e => setWLST(parseFloat(e.target.value))} className="w-full" />

      <button onClick={handleRunAHP} className="mt-4 w-full px-3 py-2 rounded bg-green-600 text-white">Run Suitability</button>

      <hr className="my-4" />

      <h4 className="font-medium text-black">Quick Actions</h4>
      <ul className="text-sm text-gray-600 mt-2 space-y-2">
        <li><button onClick={onToggleHeatmap} className="text-left w-full px-2 py-2 rounded hover:bg-gray-100">Toggle Heatmap</button></li>
        <li><button onClick={onShowCandidates} className="text-left w-full px-2 py-2 rounded hover:bg-gray-100">Show Candidate Sites</button></li>
      </ul>
    </section>
  );
};

export default ControlPanel;
