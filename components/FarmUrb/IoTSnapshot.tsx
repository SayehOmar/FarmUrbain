
import React from 'react';

interface IoTSnapshotProps {
  sensors: any[];
}

const IoTSnapshot: React.FC<IoTSnapshotProps> = ({ sensors }) => {
  return (
    <div>
      <h5 className="font-semibold">IoT Snapshot</h5>
      <div className="mt-2 text-sm text-gray-700">
        {sensors.length === 0 && "Loading sensors..."}
        {sensors.map(s => (
          <div key={s.id} className="p-2 border rounded mb-2">
            <strong>{s.id}</strong> — Temp: {s.temp}°C — Hum: {s.hum}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default IoTSnapshot;
