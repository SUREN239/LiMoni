import React, { useState, useEffect } from 'react';

// Mock function to simulate receiving data from LoRa module
const receiveLoRaData = () => {
  return {
    vehicleId: `VEH-${Math.floor(Math.random() * 1000)}`,
    speed: Math.floor(Math.random() * 50) + 70, // 70-120 km/h
    location: `${(Math.random() * 100).toFixed(6)}, ${(Math.random() * 100).toFixed(6)}`,
    timestamp: new Date().toISOString(),
  };
};

// Fine calculation function
const calculateFine = (speed, speedLimit) => {
  const overSpeed = speed - speedLimit;
  if (overSpeed <= 10) return 50;
  if (overSpeed <= 20) return 100;
  return 200;
};

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const SpeedViolationAlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [speedLimit, setSpeedLimit] = useState(80);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = receiveLoRaData();
      if (newData.speed > speedLimit) {
        setAlerts(prevAlerts => [
          {
            ...newData,
            fine: calculateFine(newData.speed, speedLimit),
            id: Date.now(),
          },
          ...prevAlerts.slice(0, 4), // Keep only the last 5 alerts
        ]);
      }
    }, 5000); // Check for new data every 5 seconds

    return () => clearInterval(interval);
  }, [speedLimit]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Speed Violation Alert System</h1>
      
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Speed Limit: {speedLimit} km/h</h2>
        <div>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => setSpeedLimit(prevLimit => prevLimit - 10)}
          >
            -10 km/h
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setSpeedLimit(prevLimit => prevLimit + 10)}
          >
            +10 km/h
          </button>
        </div>
      </div>

      {alerts.map(alert => (
        <div key={alert.id} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircleIcon />
            <h3 className="font-bold ml-2">Speed Violation Detected</h3>
          </div>
          <div className="mt-2">
            <p>Vehicle ID: {alert.vehicleId}</p>
            <p>Speed: {alert.speed} km/h</p>
            <p>Location: {alert.location}</p>
            <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
            <p className="font-bold flex items-center mt-1">
              <DollarSignIcon />
              <span className="ml-1">Fine: ${alert.fine}</span>
            </p>
          </div>
        </div>
      ))}

      {alerts.length === 0 && (
        <p className="text-center text-gray-500">No recent speed violations.</p>
      )}
    </div>
  );
};

export default SpeedViolationAlertSystem;