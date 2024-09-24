// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// import { AlertTriangle, AlertCircle, TrendingUp, RefreshCcw, Download, BarChart as BarChartIcon, Car, MapPin, Clock, DollarSign, Gauge, Ticket, X } from 'lucide-react';
// import ZoneSpeedLimitManager from './ZoneSpeedLimitManager';
// import AlertDataViewer from './AlertDataViewer';


// // Mock function to simulate receiving data from LoRa module
// const receiveLoRaData = () => {
//   const zones = [
//     { name: 'Dharavi Slum', lat: 19.0380, lon: 72.8538, type: 'Urban' },
//     { name: 'Manali Hill Road', lat: 32.2396, lon: 77.1887, type: 'Hill' },
//     { name: 'Ranthambore National Park', lat: 26.0173, lon: 76.5026, type: 'Rural' },
//     { name: 'AIIMS Delhi', lat: 28.5672, lon: 77.2100, type: 'Hospital' },
//     { name: 'Navodaya School Pune', lat: 18.5204, lon: 73.8567, type: 'School' },
//     { name: 'Kolkata Dock', lat: 22.5448, lon: 88.3426, type: 'Industrial' },
//     { name: 'Ladakh Highway', lat: 34.1526, lon: 77.5771, type: 'Hill' },
//     { name: 'Varanasi Ghats', lat: 25.3176, lon: 83.0064, type: 'Urban' },
//     { name: 'Kaziranga National Park', lat: 26.5888, lon: 93.1706, type: 'Rural' },
//     { name: 'Apollo Hospital Chennai', lat: 13.0827, lon: 80.2707, type: 'Hospital' }
//   ];
//   const randomZone = zones[Math.floor(Math.random() * zones.length)];
//   return {
//     vehicleId: `${['MH', 'DL', 'KA', 'TN', 'UP', 'GJ', 'WB', 'RJ'][Math.floor(Math.random() * 8)]}-${Math.floor(Math.random() * 100)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 10000)}`,
//     speed: Math.floor(Math.random() * 50) + 30, // 30-80 km/h
//     location: { lat: randomZone.lat + (Math.random() - 0.5) * 0.05, lon: randomZone.lon + (Math.random() - 0.5) * 0.05 },
//     zone: randomZone.name,
//     zoneType: randomZone.type,
//     timestamp: new Date().toISOString(),
//   };
// };

// const SpeedViolationDashboard = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [zoneSpeedLimits, setZoneSpeedLimits] = useState({
//     'Dharavi Slum': 30,
//     'Manali Hill Road': 40,
//     'Ranthambore National Park': 30,
//     'AIIMS Delhi': 20,
//     'Navodaya School Pune': 15,
//     'Kolkata Dock': 25,
//     'Ladakh Highway': 50,
//     'Varanasi Ghats': 20,
//     'Kaziranga National Park': 40,
//     'Apollo Hospital Chennai': 20
//   });
//   const [statistics, setStatistics] = useState({
//     totalViolations: 0,
//     violationsByZone: {},
//     violationsByType: {},
//     violationsByHour: Array(24).fill(0)
//   });
//   const [speedAlert, setSpeedAlert] = useState(null);
//   const [showAlertViewer, setShowAlertViewer] = useState(false);
//   const [ticketedVehicles, setTicketedVehicles] = useState([]);
//   const [showTickets, setShowTickets] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
//   const [mapZoom, setMapZoom] = useState(5);
//   const mapRef = useRef(null);

   

//   const handleViewTickets = () => {
//     setShowTickets(true);
//   };

//   const handleCloseTickets = () => {
//     setShowTickets(false);
//   };

//   const MapEvents = () => {
//     const map = useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setSelectedLocation({ lat, lng });
//         setMapCenter([lat, lng]);
//         setMapZoom(10);
//       },
//     });
//     return null;
//   };

//   const MapController = () => {
//     const map = useMap();
//     useEffect(() => {
//       map.setView(mapCenter, mapZoom);
//     }, [map, mapCenter, mapZoom]);
//     return null;
//   };

//   const handleMarkerClick = (lat, lng) => {
//     setMapCenter([lat, lng]);
//     setMapZoom(12);
//   };

//   const handleViewData = () => {
//     const viewerData = {
//       alerts,
//       statistics,
//       zoneSpeedLimits
//     };
//     setShowAlertViewer(true);
//   };

//   const updateData = useCallback(() => {
//     const newData = receiveLoRaData();
//     if (newData.speed > zoneSpeedLimits[newData.zone]) {
//       const newAlert = {
//         ...newData,
//         id: Date.now(),
//       };
//       setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 99)]);
//       setStatistics(prev => {
//         const hour = new Date(newData.timestamp).getHours();
//         const newViolationsByHour = [...prev.violationsByHour];
//         newViolationsByHour[hour]++;
//         return {
//           totalViolations: prev.totalViolations + 1,
//           violationsByZone: {
//             ...prev.violationsByZone,
//             [newData.zone]: (prev.violationsByZone[newData.zone] || 0) + 1
//           },
//           violationsByType: {
//             ...prev.violationsByType,
//             [newData.zoneType]: (prev.violationsByType[newData.zoneType] || 0) + 1
//           },
//           violationsByHour: newViolationsByHour
//         };
//       });
//       setTicketedVehicles(prev => [...prev, newAlert]);
//       setSpeedAlert(newAlert);
//     }
//   }, [zoneSpeedLimits]);

//   useEffect(() => {
//     const interval = setInterval(updateData, 2000);
//     return () => clearInterval(interval);
//   }, [updateData]);

//   const handleRefresh = () => {
//     setAlerts([]);
//     setStatistics({
//       totalViolations: 0,
//       violationsByZone: {},
//       violationsByType: {},
//       violationsByHour: Array(24).fill(0)
//     });
//     setTicketedVehicles([]);
//     for (let i = 0; i < 50; i++) {
//       updateData();
//     }
//   };

//   const handleExport = () => {
//     const exportData = {
//       alerts,
//       statistics,
//       zoneSpeedLimits,
//       ticketedVehicles
//     };
//     const dataStr = JSON.stringify(exportData, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//     const exportFileDefaultName = 'speed_violation_data.json';
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   const chartData = Object.entries(statistics.violationsByZone).map(([zone, violations]) => ({
//     zone,
//     violations
//   }));

//   const pieChartData = Object.entries(statistics.violationsByType).map(([type, value]) => ({
//     name: type,
//     value
//   }));

//   const hourlyData = statistics.violationsByHour.map((violations, hour) => ({
//     hour: hour.toString().padStart(2, '0') + ':00',
//     violations
//   }));

//   const handleSpeedLimitChange = (zone, newSpeedLimit) => {
//     setZoneSpeedLimits(prevLimits => ({
//       ...prevLimits,
//       [zone]: newSpeedLimit
//     }));
//   };

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

//   return (
//     <div style={styles.container}>
//       <nav style={styles.navbar}>
//         <div style={styles.navLeft}></div>
//         <h1 style={styles.title}>LiMoni</h1>
//         <div style={styles.navRight}>
//           <button style={styles.navButton} onClick={handleRefresh}><RefreshCcw size={16} /> Refresh</button>
//           <button style={styles.navButton} onClick={handleExport}><Download size={16} /> Export</button>
//           <button style={styles.navButton} onClick={handleViewTickets}><Ticket size={16} /> View Tickets</button>
//         </div>
//       </nav>
//       <div style={styles.mainContent}>
//         <div style={styles.sidebar}>
//           <ul style={styles.menu}>
//             <li style={styles.menuItem}><BarChartIcon size={18} /> Dashboard</li>
//             <li style={styles.menuItem}><AlertTriangle size={18} /> Reports</li>
//             <li style={styles.menuItem}><AlertCircle size={18} /> Settings</li>
//           </ul>
//           <ZoneSpeedLimitManager
//             zones={Object.keys(zoneSpeedLimits)}
//             zoneSpeedLimits={zoneSpeedLimits}
//             onSpeedLimitChange={handleSpeedLimitChange}
//           />
//         </div>
//         <div style={styles.dashboard}>
//           {speedAlert && (
//             <div style={styles.alertBanner}>
//               <AlertTriangle size={24} style={styles.alertIcon} />
//               <p>Speed Alert: {speedAlert.speed} km/h in {speedAlert.zone} (Limit: {zoneSpeedLimits[speedAlert.zone]} km/h)</p>
//               <p>Vehicle: {speedAlert.vehicleId} - Ticket issued!</p>
//             </div>
//           )}
//           <div style={{ ...styles.card, gridColumn: 'span 2', gridRow: 'span 2' }}>
//             <h2 style={styles.cardHeader}><MapPin style={styles.icon} /> Real-time Map</h2>
//             <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '400px', borderRadius: '8px' }} ref={mapRef}>
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               <MapEvents />
//               <MapController />
//               {ticketedVehicles.map(vehicle => (
//                 <Marker
//                   key={vehicle.id}
//                   position={[vehicle.location.lat, vehicle.location.lon]}
//                   eventHandlers={{
//                     click: () => handleMarkerClick(vehicle.location.lat, vehicle.location.lon),
//                   }}
//                 >
//                   <Popup>
//                     <strong>{vehicle.zone}</strong><br />
//                     Vehicle: {vehicle.vehicleId}<br />
//                     Speed: {vehicle.speed} km/h<br />
//                     Ticket issued!
//                   </Popup>
//                 </Marker>
//               ))}
//               {selectedLocation && (
//                 <Marker 
//                   position={[selectedLocation.lat, selectedLocation.lng]}
//                   eventHandlers={{
//                     click: () => handleMarkerClick(selectedLocation.lat, selectedLocation.lng),
//                   }}
//                 >
//                   <Popup>
//                     You clicked here:<br />
//                     Lat: {selectedLocation.lat.toFixed(4)}<br />
//                     Lng: {selectedLocation.lng.toFixed(4)}
//                   </Popup>
//                 </Marker>
//               )}
//             </MapContainer>
//           </div>
//           <div style={styles.card}>
//             <h2 style={styles.cardHeader}><TrendingUp style={styles.icon} /> Statistics</h2>
//             <div style={styles.statisticContainer}>
//               <div style={styles.statistic}>
//                 <Car size={24} style={styles.statIcon} />
//                 <p style={styles.statLabel}>Total Violations</p>
//                 <p style={styles.statValue}>{statistics.totalViolations}</p>
//               </div>
//               <div style={styles.statistic}>
//                 <AlertTriangle size={24} style={styles.statIcon} />
//                 <p style={styles.statLabel}>Tickets Issued</p>
//                 <p style={styles.statValue}>{ticketedVehicles.length}</p>
//               </div>
//             </div>
//           </div>
//           <div style={styles.card}>
//             <h2 style={styles.cardHeader}><BarChartIcon style={styles.icon} /> Violations by Zone</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="zone" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="violations" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={styles.card}>
//             <h2 style={styles.cardHeader}><BarChartIcon style={styles.icon} /> Violations by Type</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
//                   {pieChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={styles.card}>
//             <h2 style={styles.cardHeader}><BarChartIcon style={styles.icon} /> Violations by Hour</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={hourlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="hour" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="violations" stroke="#8884d8" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//       {showAlertViewer && (
//         <AlertDataViewer
//           data={{ alerts, statistics, zoneSpeedLimits, ticketedVehicles }}
//           onClose={() => setShowAlertViewer(false)}
//         />
//       )}
//       <div style={{
//         ...styles.ticketPanel,
//         right: showTickets ? '0' : '-400px'
//       }}>
//         <div style={styles.ticketHeader}>
//           <h2>Ticketed Vehicles</h2>
//           <button style={styles.closeButton} onClick={handleCloseTickets}>
//             <X size={24} />
//           </button>
//         </div>
//         <div style={styles.ticketList}>
//           {ticketedVehicles.map(vehicle => (
//             <div key={vehicle.id} style={styles.ticketItem}>
//               <p><strong>Vehicle ID:</strong> {vehicle.vehicleId}</p>
//               <p><strong>Zone:</strong> {vehicle.zone}</p>
//               <p><strong>Speed:</strong> {vehicle.speed} km/h</p>
//               <p><strong>Time:</strong> {new Date(vehicle.timestamp).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// // Styles for the component
// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//     backgroundColor: '#f4f4f4',
//   },
//   navbar: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '1rem',
//     backgroundColor: '#3f51b5',
//     color: '#fff',
//   },
//   navLeft: {
//     width: '200px',  // To balance the right side
//   },
//   title: {
//     margin: 0,
//     textAlign: 'center',
//     flex: 1,
//   },
//   navRight: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     width: '200px',
//   },
//   navButton: {
//     marginLeft: '10px',
//     backgroundColor: '#fff',
//     color: '#3f51b5',
//     border: 'none',
//     padding: '0.5rem 1rem',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   mainContent: {
//     display: 'flex',
//     flex: 1,
//     margin: '20px',
//     backgroundColor: '#fff',
//     borderRadius: '8px',
//     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   },
//   modal: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '8px',
//     maxWidth: '80%',
//     maxHeight: '80%',
//     overflow: 'auto',
//   },
//   sidebar: {
//     width: '200px',
//     borderRight: '1px solid #e0e0e0',
//     padding: '20px',
//   },
//   menu: {
//     listStyle: 'none',
//     padding: 0,
//     margin: 0,
//   },
//   menuItem: {
//     padding: '10px 0',
//     cursor: 'pointer',
//   },
//   speedLimitControl: {
//     marginTop: '20px',
//   },
//   select: {
//     width: '100%',
//     padding: '5px',
//     marginBottom: '10px',
//   },
//   input: {
//     width: '100%',
//     padding: '5px',
//     marginBottom: '10px',
//   },
//   button: {
//     width: '100%',
//     padding: '5px',
//     backgroundColor: '#3f51b5',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   dashboard: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     gridTemplateRows: 'repeat(3, auto)',
//     gap: '20px',
//     padding: '20px',
//     flex: 1,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: '8px',
//     padding: '20px',
//     boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
//   },
//   cardHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: '1.5rem',
//     marginBottom: '1rem',
//   },
//   icon: {
//     marginRight: '10px',
//   },
//   statisticContainer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
//   statistic: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   statLabel: {
//     fontSize: '1rem',
//     color: '#888',
//   },
//   statValue: {
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//   },
//   ticketPanel: {
//     position: 'fixed',
//     top: 0,
//     right: '-400px',
//     width: '400px',
//     height: '100%',
//     backgroundColor: '#fff',
//     boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
//     transition: 'right 0.3s ease-in-out',
//     zIndex: 1000,
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   ticketHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '20px',
//     borderBottom: '1px solid #e0e0e0',
//   },
//   closeButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//   },
//   ticketList: {
//     overflowY: 'auto',
//     flex: 1,
//     padding: '20px',
//   },
//   ticketItem: {
//     borderBottom: '1px solid #e0e0e0',
//     paddingBottom: '10px',
//     marginBottom: '10px',
//   },
//   statIcon: {
//     color: '#3f51b5',
//   }
// };

// export default SpeedViolationDashboard;



import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, AlertCircle, TrendingUp, RefreshCcw, Download, BarChart as BarChartIcon, Car, MapPin, Clock, DollarSign, Gauge, Ticket, X } from 'lucide-react';
import ZoneSpeedLimitManager from './ZoneSpeedLimitManager';
import AlertDataViewer from './AlertDataViewer';


const coimbatoreLocations = [
  { name: 'Gandhipuram', lat: 11.0168, lon: 76.9558, type: 'Urban' },
  { name: 'RS Puram', lat: 11.0050, lon: 76.9592, type: 'Urban' },
  { name: 'Peelamedu', lat: 11.0343, lon: 77.0297, type: 'Urban' },
  { name: 'Singanallur', lat: 11.0070, lon: 77.0390, type: 'Urban' },
  { name: 'Saibaba Colony', lat: 11.0263, lon: 76.9426, type: 'Residential' },
  { name: 'Race Course', lat: 11.0056, lon: 76.9689, type: 'Urban' },
  { name: 'Coimbatore Medical College Hospital', lat: 11.0176, lon: 76.9674, type: 'Hospital' },
  { name: 'PSG College of Technology', lat: 11.0242, lon: 77.0022, type: 'School' },
  { name: 'CODISSIA Trade Fair Complex', lat: 11.0749, lon: 76.9897, type: 'Industrial' },
  { name: 'Marudhamalai Hill Temple', lat: 11.0443, lon: 76.8561, type: 'Hill' }
];


// Mock function to simulate receiving data from LoRa module
const receiveLoRaData = () => {
  const randomLocation = coimbatoreLocations[Math.floor(Math.random() * coimbatoreLocations.length)];
  return {
    vehicleId: `TN-${Math.floor(Math.random() * 100)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 10000)}`,
    speed: Math.floor(Math.random() * 50) + 30, // 30-80 km/h
    location: { lat: randomLocation.lat + (Math.random() - 0.5) * 0.01, lon: randomLocation.lon + (Math.random() - 0.5) * 0.01 },
    zone: randomLocation.name,
    zoneType: randomLocation.type,
    timestamp: new Date().toISOString(),
  };
};

const pingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const SpeedViolationDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [zoneSpeedLimits, setZoneSpeedLimits] = useState(
    Object.fromEntries(coimbatoreLocations.map(loc => [loc.name, 40]))
  );
  const [statistics, setStatistics] = useState({
    totalViolations: 0,
    violationsByZone: {},
    violationsByType: {},
    violationsByHour: Array(24).fill(0)
  });
  const [speedAlert, setSpeedAlert] = useState(null);
  const [showAlertViewer, setShowAlertViewer] = useState(false);
  const [ticketedVehicles, setTicketedVehicles] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [mapCenter, setMapCenter] = useState([11.0168, 76.9558]); // Centered on Coimbatore
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);;

   

  const handleViewTickets = () => {
    setShowTickets(true);
  };

  const handleCloseTickets = () => {
    setShowTickets(false);
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        setMapCenter([lat, lng]);
        setMapZoom(10);
      },
    });
    return null;
  };

  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(mapCenter, mapZoom);
    }, [map, mapCenter, mapZoom]);
    return null;
  };

  const handleMarkerClick = (lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(12);
  };

  const handleViewData = () => {
    const viewerData = {
      alerts,
      statistics,
      zoneSpeedLimits
    };
    setShowAlertViewer(true);
  };

  const updateData = useCallback(() => {
    const newData = receiveLoRaData();
    if (newData.speed > zoneSpeedLimits[newData.zone]) {
      const newAlert = {
        ...newData,
        id: Date.now(),
      };
      setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 99)]);
      setStatistics(prev => {
        const hour = new Date(newData.timestamp).getHours();
        const newViolationsByHour = [...prev.violationsByHour];
        newViolationsByHour[hour]++;
        return {
          totalViolations: prev.totalViolations + 1,
          violationsByZone: {
            ...prev.violationsByZone,
            [newData.zone]: (prev.violationsByZone[newData.zone] || 0) + 1
          },
          violationsByType: {
            ...prev.violationsByType,
            [newData.zoneType]: (prev.violationsByType[newData.zoneType] || 0) + 1
          },
          violationsByHour: newViolationsByHour
        };
      });
      setTicketedVehicles(prev => [...prev, newAlert]);
      setSpeedAlert(newAlert);
    }
  }, [zoneSpeedLimits]);

  useEffect(() => {
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, [updateData]);

  const handleRefresh = () => {
    setAlerts([]);
    setStatistics({
      totalViolations: 0,
      violationsByZone: {},
      violationsByType: {},
      violationsByHour: Array(24).fill(0)
    });
    setTicketedVehicles([]);
    for (let i = 0; i < 50; i++) {
      updateData();
    }
  };

  const handleExport = () => {
    const exportData = {
      alerts,
      statistics,
      zoneSpeedLimits,
      ticketedVehicles
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'speed_violation_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const chartData = Object.entries(statistics.violationsByZone).map(([zone, violations]) => ({
    zone,
    violations
  }));

  const pieChartData = Object.entries(statistics.violationsByType).map(([type, value]) => ({
    name: type,
    value
  }));

  const hourlyData = statistics.violationsByHour.map((violations, hour) => ({
    hour: hour.toString().padStart(2, '0') + ':00',
    violations
  }));

  const handleSpeedLimitChange = (zone, newSpeedLimit) => {
    setZoneSpeedLimits(prevLimits => ({
      ...prevLimits,
      [zone]: newSpeedLimit
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}></div>
        <h1 style={styles.title}>LiMoni</h1>
        <div style={styles.navRight}>
          <button style={styles.navButton} onClick={handleRefresh}><RefreshCcw size={16} /> Refresh</button>
          <button style={styles.navButton} onClick={handleExport}><Download size={16} /> Export</button>
          <button style={styles.navButton} onClick={handleViewTickets}><Ticket size={16} /> View Tickets</button>
        </div>
      </nav>
      <div style={styles.mainContent}>
        <div style={styles.sidebar}>
          <ul style={styles.menu}>
            <li style={styles.menuItem}><BarChartIcon size={18} /> Dashboard</li>
            <li style={styles.menuItem}><AlertTriangle size={18} /> Reports</li>
            <li style={styles.menuItem}><AlertCircle size={18} /> Settings</li>
          </ul>
          <ZoneSpeedLimitManager
            zones={Object.keys(zoneSpeedLimits)}
            zoneSpeedLimits={zoneSpeedLimits}
            onSpeedLimitChange={handleSpeedLimitChange}
          />
        </div>
        <div style={styles.dashboard}>
          {speedAlert && (
            <div style={styles.alertBanner}>
              <AlertTriangle size={24} style={styles.alertIcon} />
              <p>Speed Alert: {speedAlert.speed} km/h in {speedAlert.zone} (Limit: {zoneSpeedLimits[speedAlert.zone]} km/h)</p>
              <p>Vehicle: {speedAlert.vehicleId} - Ticket issued!</p>
            </div>
          )}
          <div style={{ ...styles.card, gridColumn: 'span 2', gridRow: 'span 2' }}>
            <h2 style={styles.cardHeader}><MapPin style={styles.icon} /> Real-time Map (Coimbatore)</h2>
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '400px', borderRadius: '8px' }} ref={mapRef}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapEvents />
              <MapController />
              {ticketedVehicles.map(vehicle => (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.location.lat, vehicle.location.lon]}
                  eventHandlers={{
                    click: () => handleMarkerClick(vehicle.location.lat, vehicle.location.lon),
                  }}
                >
                  <Popup>
                    <strong>{vehicle.zone}</strong><br />
                    Vehicle: {vehicle.vehicleId}<br />
                    Speed: {vehicle.speed} km/h<br />
                    Ticket issued!
                  </Popup>
                </Marker>
              ))}
              {selectedLocation && (
                <Marker 
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={pingIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(selectedLocation.lat, selectedLocation.lng),
                  }}
                >
                  <Popup>
                    You clicked here:<br />
                    Lat: {selectedLocation.lat.toFixed(4)}<br />
                    Lng: {selectedLocation.lng.toFixed(4)}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardHeader}><TrendingUp style={styles.icon} /> Statistics</h2>
            <div style={styles.statisticContainer}>
              <div style={styles.statistic}>
                <Car size={24} style={styles.statIcon} />
                <p style={styles.statLabel}>Total Violations</p>
                <p style={styles.statValue}>{statistics.totalViolations}</p>
              </div>
              <div style={styles.statistic}>
                <AlertTriangle size={24} style={styles.statIcon} />
                <p style={styles.statLabel}>Tickets Issued</p>
                <p style={styles.statValue}>{ticketedVehicles.length}</p>
              </div>
            </div>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardHeader}><BarChartIcon style={styles.icon} /> Violations by Zone</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="violations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardHeader}><BarChartIcon style={styles.icon} /> Violations by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardHeader}><BarChartIcon style={styles.icon} /> Violations by Hour</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="violations" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {showAlertViewer && (
        <AlertDataViewer
          data={{ alerts, statistics, zoneSpeedLimits, ticketedVehicles }}
          onClose={() => setShowAlertViewer(false)}
        />
      )}
      <div style={{
        ...styles.ticketPanel,
        right: showTickets ? '0' : '-400px'
      }}>
        <div style={styles.ticketHeader}>
          <h2>Ticketed Vehicles</h2>
          <button style={styles.closeButton} onClick={handleCloseTickets}>
            <X size={24} />
          </button>
        </div>
        <div style={styles.ticketList}>
          {ticketedVehicles.map(vehicle => (
            <div key={vehicle.id} style={styles.ticketItem}>
              <p><strong>Vehicle ID:</strong> {vehicle.vehicleId}</p>
              <p><strong>Zone:</strong> {vehicle.zone}</p>
              <p><strong>Speed:</strong> {vehicle.speed} km/h</p>
              <p><strong>Time:</strong> {new Date(vehicle.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// Styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#3f51b5',
    color: '#fff',
  },
  navLeft: {
    width: '200px',  // To balance the right side
  },
  title: {
    margin: 0,
    textAlign: 'center',
    flex: 1,
  },
  navRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '200px',
  },
  navButton: {
    marginLeft: '10px',
    backgroundColor: '#fff',
    color: '#3f51b5',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    margin: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
  },
  sidebar: {
    width: '200px',
    borderRight: '1px solid #e0e0e0',
    padding: '20px',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: '10px 0',
    cursor: 'pointer',
  },
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
  dashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3, auto)',
    gap: '20px',
    padding: '20px',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  icon: {
    marginRight: '10px',
  },
  statisticContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  statistic: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#888',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  ticketPanel: {
    position: 'fixed',
    top: 0,
    right: '-400px',
    width: '400px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
    transition: 'right 0.3s ease-in-out',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  ticketList: {
    overflowY: 'auto',
    flex: 1,
    padding: '20px',
  },
  ticketItem: {
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  statIcon: {
    color: '#3f51b5',
  }
};

export default SpeedViolationDashboard;

