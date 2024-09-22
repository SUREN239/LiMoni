import React, { useState, useEffect } from 'react';
import { Gauge, ArrowRight } from 'lucide-react';

const VirtualSpeedometer = ({ zones, zoneSpeedLimits, onSpeedExceeded }) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [rotation, setRotation] = useState(0);

  const handleZoneChange = () => {
    const currentIndex = zones.indexOf(selectedZone);
    const nextIndex = (currentIndex + 1) % zones.length;
    setSelectedZone(zones[nextIndex]);
  };

  const handleSpeedChange = (event) => {
    const speed = parseInt(event.target.value);
    setCurrentSpeed(speed);
    setRotation(speed * 1.8); // 180 degrees / 100 (max speed) = 1.8
    
    if (selectedZone && speed > zoneSpeedLimits[selectedZone]) {
      onSpeedExceeded({
        zone: selectedZone,
        speed: speed,
        speedLimit: zoneSpeedLimits[selectedZone]
      });
    }
  };

  useEffect(() => {
    setSelectedZone(zones[0]);
  }, [zones]);

  return (
    <div style={styles.speedometer}>
      <h3><Gauge size={18} style={styles.icon} /> Virtual Speedometer</h3>
      <div style={styles.arduinoBoard}>
        <div style={styles.display}>
          <p>Zone: {selectedZone}</p>
          <p>Speed: {currentSpeed} km/h</p>
          <p>Limit: {selectedZone ? zoneSpeedLimits[selectedZone] : '--'} km/h</p>
        </div>
        <div style={styles.controls}>
          <div style={styles.knob}>
            <div style={{...styles.knobIndicator, transform: `rotate(${rotation}deg)`}} />
            <input
              type="range"
              min="0"
              max="150"
              value={currentSpeed}
              onChange={handleSpeedChange}
              style={styles.knobInput}
            />
          </div>
          <button onClick={handleZoneChange} style={styles.zoneButton}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  speedometer: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  arduinoBoard: {
    backgroundColor: '#4a90e2',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  display: {
    backgroundColor: '#1e272e',
    color: '#00ff00',
    fontFamily: 'monospace',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    width: '100%',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  knob: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#ddd',
    position: 'relative',
    overflow: 'hidden',
  },
  knobIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2px',
    height: '40%',
    backgroundColor: 'red',
    transformOrigin: 'bottom',
  },
  knobInput: {
    width: '200%',
    height: '200%',
    appearance: 'none',
    backgroundColor: 'transparent',
    transform: 'translate(-25%, -25%) rotate(-90deg)',
  },
  zoneButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#2ecc71',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  },
  icon: {
    marginRight: '10px',
  },
};

export default VirtualSpeedometer;