import React, { useState } from 'react';

const ZoneSpeedLimitManager = ({ zones, zoneSpeedLimits, onSpeedLimitChange }) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [newSpeedLimit, setNewSpeedLimit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedZone && newSpeedLimit) {
      onSpeedLimitChange(selectedZone, parseInt(newSpeedLimit, 10));
      setSelectedZone('');
      setNewSpeedLimit('');
    }
  };

  return (
    <div style={styles.speedLimitControl}>
      <h3>Manage Zone Speed Limits</h3>
      <form onSubmit={handleSubmit}>
        <select
          style={styles.select}
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          <option value="">Select a zone</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone} (Current: {zoneSpeedLimits[zone]} km/h)
            </option>
          ))}
        </select>
        <input
          type="number"
          style={styles.input}
          value={newSpeedLimit}
          onChange={(e) => setNewSpeedLimit(e.target.value)}
          placeholder="New speed limit (km/h)"
          min="1"
          max="120"
        />
        <button type="submit" style={styles.button}>
          Update Speed Limit
        </button>
      </form>
    </div>
  );
};

const styles = {
  speedLimitControl: {
    marginTop: '20px',
  },
  select: {
    width: '100%',
    padding: '5px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '5px',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '5px',
    backgroundColor: '#3f51b5',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ZoneSpeedLimitManager;