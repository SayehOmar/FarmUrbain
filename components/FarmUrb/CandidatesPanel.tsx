
import React from 'react';

interface CandidatesPanelProps {
  candidates: any[];
  onZoomTo: (id: string) => void;
  onSimulate: (cooling: number) => void;
  simResult: string;
}

const CandidatesPanel: React.FC<CandidatesPanelProps> = ({ candidates, onZoomTo, onSimulate, simResult }) => {
  const [coolingEffect, setCoolingEffect] = React.useState(2);

  return (
    <aside className="md:col-span-1 bg-white rounded-lg shadow p-4 panel">
      <h3 className="font-semibold text-lg">Top Candidate Sites</h3>
      <ul className="mt-3 space-y-3 text-sm text-gray-700">
        {candidates.map((c, idx) => (
          <li key={c.id} className="p-2 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <strong>{idx + 1}. {c.name}</strong>
                <div className="text-xs text-gray-500">Score: {c.score.toFixed(2)}</div>
              </div>
              <button onClick={() => onZoomTo(c.id)} className="ml-2 text-sm px-2 py-1 bg-green-600 text-white rounded">Zoom</button>
            </div>
          </li>
        ))}
      </ul>

      <hr className="my-4" />
      <h4 className="font-medium">Simulation Controls</h4>
      <div className="text-sm text-gray-600 mt-2">
        <label className="block">Cooling Effect (°C): <input type="number" value={coolingEffect} onChange={e => setCoolingEffect(parseInt(e.target.value, 10))} min="0" max="10" className="w-20 ml-2 border rounded px-2 py-1" /></label>
        <button onClick={() => onSimulate(coolingEffect)} className="mt-3 px-3 py-2 bg-blue-600 text-white rounded">Simulate Impact</button>
      </div>

      <div className="mt-4 text-sm text-gray-700">{simResult}</div>
    </aside>
  );
};

export default CandidatesPanel;
