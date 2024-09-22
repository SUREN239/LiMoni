import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data structure for regions, zones, and sub-zones
const regions = {
  'North India': {
    'Delhi NCR': ['Delhi', 'Gurgaon', 'Noida'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar']
  },
  'South India': {
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai']
  },
  'West India': {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
  },
  'East India': {
    'West Bengal': ['Kolkata', 'Siliguri', 'Asansol'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela']
  }
};

// Mock function to simulate receiving data from LoRa module
const receiveLoRaData = () => {
  const allSubZones = Object.values(regions).flatMap(zones => 
    Object.values(zones).flatMap(subZones => subZones)
  );
  const randomSubZone = allSubZones[Math.floor(Math.random() * allSubZones.length)];
  const [region, zone] = Object.entries(regions).find(([_, zones]) => 
    Object.values(zones).some(subZones => subZones.includes(randomSubZone))
  );
  const cityCode = randomSubZone.substring(0, 2).toUpperCase();
  
  return {
    vehicleId: `${cityCode}-${Math.floor(Math.random() * 100)}-${String.fromCharCode(65 + Math.random() * 26)}-${Math.floor(Math.random() * 10000)}`,
    speed: Math.floor(Math.random() * 50) + 30, // 30-80 km/h
    location: {
      lat: 20 + Math.random() * 10,
      lon: 70 + Math.random() * 10
    },
    region,
    zone,
    subZone: randomSubZone,
    timestamp: new Date().toISOString(),
  };
};

// Fine calculation function
const calculateFine = (speed, speedLimit) => {
  const overSpeed = speed - speedLimit;
  if (overSpeed <= 10) return 500;
  if (overSpeed <= 20) return 1000;
  return 2000;
};

const SpeedLimitSettings = ({ speedLimits, setSpeedLimits }) => {
    const [selectedRegion, setSelectedRegion] = useState(Object.keys(regions)[0]);
    const [selectedZone, setSelectedZone] = useState(Object.keys(regions[Object.keys(regions)[0]])[0]);
  
    const handleSpeedLimitChange = (subZone, newLimit) => {
      setSpeedLimits(prev => ({
        ...prev,
        [selectedRegion]: {
          ...prev[selectedRegion],
          [selectedZone]: {
            ...prev[selectedRegion][selectedZone],
            [subZone]: newLimit
          }
        }
      }));
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Speed Limit Settings</h2>
        <div className="grid grid-cols-3 gap-4">
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedZone(Object.keys(regions[e.target.value])[0]);
            }}
            className="p-2 border rounded-md"
          >
            {Object.keys(regions).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="p-2 border rounded-md"
          >
            {Object.keys(regions[selectedRegion]).map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
          <div></div>
          {Object.values(regions[selectedRegion][selectedZone]).map(subZone => (
  <div key={subZone} className="flex items-center justify-between">
    <span>{subZone}:</span>
    <input 
      type="number" 
      value={speedLimits[selectedRegion]?.[selectedZone]?.[subZone] || 50}
      onChange={(e) => handleSpeedLimitChange(subZone, parseInt(e.target.value))}
      className="w-24 p-1 border rounded-md"
    />
  </div>
))}

        </div>
      </div>
    );
  };

const ProfessionalSpeedViolationDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [alerts, setAlerts] = useState([]);
  const [speedLimits, setSpeedLimits] = useState({});
  const [statistics, setStatistics] = useState({
    totalViolations: 0,
    totalFines: 0,
    violationsByRegion: {}
  });

  useEffect(() => {
    // Initialize speed limits
    const initialSpeedLimits = Object.fromEntries(
      Object.entries(regions).map(([region, zones]) => [
        region,
        Object.fromEntries(
          Object.entries(zones).map(([zone, subZones]) => [
            zone,
            Object.fromEntries(subZones.map(subZone => [subZone, 50]))
          ])
        )
      ])
    );
    setSpeedLimits(initialSpeedLimits);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = receiveLoRaData();
      const speedLimit = speedLimits[newData.region]?.[newData.zone]?.[newData.subZone] || 50;
      if (newData.speed > speedLimit) {
        const fine = calculateFine(newData.speed, speedLimit);
        const newAlert = {
          ...newData,
          fine: fine,
          id: Date.now(),
        };
        setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 99)]);
        setStatistics(prev => ({
          totalViolations: prev.totalViolations + 1,
          totalFines: prev.totalFines + fine,
          violationsByRegion: {
            ...prev.violationsByRegion,
            [newData.region]: (prev.violationsByRegion[newData.region] || 0) + 1
          }
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [speedLimits]);

  const chartData = Object.entries(statistics.violationsByRegion).map(([region, violations]) => ({
    region,
    violations
  }));

  const tabs = ['Dashboard', 'Speed Limits', 'Analytics', 'Settings'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Indian Roadways Speed Monitoring System</h1>
      
      <div className="mb-6">
        <ul className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                className={`py-2 px-4 focus:outline-none ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {activeTab === 'Dashboard' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-bold p-4 bg-blue-50">Real-time Map</h2>
              <div className="p-4">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {alerts.slice(0, 10).map(alert => (
                    <Circle
                      key={alert.id}
                      center={[alert.location.lat, alert.location.lon]}
                      radius={20000}
                      pathOptions={{ color: 'red', fillColor: 'red' }}
                    >
                      <Popup>
                        Vehicle: {alert.vehicleId}<br />
                        Speed: {alert.speed} km/h<br />
                        Region: {alert.region}<br />
                        Zone: {alert.zone}<br />
                        Sub-zone: {alert.subZone}<br />
                        Fine: ₹{alert.fine}
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-bold p-4 bg-green-50">Statistics</h2>
              <div className="p-4">
                <p className="text-lg mb-2">Total Violations: {statistics.totalViolations}</p>
                <p className="text-lg">Total Fines Collected: ₹{statistics.totalFines}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-bold p-4 bg-red-50">Recent Alerts</h2>
              <div className="p-4 max-h-80 overflow-y-auto">
                {alerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className="mb-4 p-3 bg-red-50 rounded">
                    <h3 className="font-semibold">Speed Violation in {alert.subZone}, {alert.zone}</h3>
                    <p>Vehicle: {alert.vehicleId}</p>
                    <p>Speed: {alert.speed} km/h (Limit: {speedLimits[alert.region]?.[alert.zone]?.[alert.subZone] || 50} km/h)</p>
                    <p>Fine: ₹{alert.fine}</p>
                    <p className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-bold p-4 bg-purple-50">Violations by Region</h2>
              <div className="p-4" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="violations" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Speed Limits' && (
        <SpeedLimitSettings speedLimits={speedLimits} setSpeedLimits={setSpeedLimits} />
      )}

      {activeTab === 'Analytics' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <p>Advanced analytics features would be implemented here.</p>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">System Settings</h2>
          <p>System configuration options would be available here.</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSpeedViolationDashboard;