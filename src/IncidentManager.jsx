// import React, { useState, useMemo } from 'react';
// import { X, Search, ArrowUpDown } from 'lucide-react';

// const IncidentManager = ({ incidents, onClose }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState('timestamp');
//   const [sortOrder, setSortOrder] = useState('desc');

//   const filteredAndSortedIncidents = useMemo(() => {
//     return incidents
//       .filter(incident =>
//         incident.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         incident.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         incident.zoneType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         incident.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (incident.eventDetails && incident.eventDetails.toLowerCase().includes(searchTerm.toLowerCase()))
//       )
//       .sort((a, b) => {
//         if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
//         if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
//         return 0;
//       });
//   }, [incidents, searchTerm, sortField, sortOrder]);

//   const handleSort = (field) => {
//     if (field === sortField) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('asc');
//     }
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.incidentManager}>
//         <div style={styles.header}>
//           <h2>Incident Manager</h2>
//           <button style={styles.closeButton} onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>
//         <div style={styles.searchBar}>
//           <Search size={20} />
//           <input
//             type="text"
//             placeholder="Search incidents..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={styles.searchInput}
//           />
//         </div>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th onClick={() => handleSort('vehicleId')} style={styles.tableHeader}>
//                 Vehicle ID <ArrowUpDown size={14} />
//               </th>
//               <th onClick={() => handleSort('zone')} style={styles.tableHeader}>
//                 Zone <ArrowUpDown size={14} />
//               </th>
//               <th onClick={() => handleSort('zoneType')} style={styles.tableHeader}>
//                 Zone Type <ArrowUpDown size={14} />
//               </th>
//               <th onClick={() => handleSort('eventType')} style={styles.tableHeader}>
//                 Event Type <ArrowUpDown size={14} />
//               </th>
//               <th onClick={() => handleSort('timestamp')} style={styles.tableHeader}>
//                 Timestamp <ArrowUpDown size={14} />
//               </th>
//               <th style={styles.tableHeader}>Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredAndSortedIncidents.map((incident) => (
//               <tr key={incident.id} style={styles.tableRow}>
//                 <td>{incident.vehicleId}</td>
//                 <td>{incident.zone}</td>
//                 <td>{incident.zoneType}</td>
//                 <td>{incident.eventType}</td>
//                 <td>{new Date(incident.timestamp).toLocaleString()}</td>
//                 <td>{incident.eventDetails}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   incidentManager: {
//     backgroundColor: '#fff',
//     borderRadius: '8px',
//     width: '80%',
//     maxWidth: '1200px',
//     maxHeight: '80%',
//     overflowY: 'auto',
//     padding: '20px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '20px',
//   },
//   closeButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//   },
//   searchBar: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '20px',
//     padding: '10px',
//     backgroundColor: '#f0f0f0',
//     borderRadius: '4px',
//   },
//   searchInput: {
//     marginLeft: '10px',
//     border: 'none',
//     background: 'none',
//     flex: 1,
//     fontSize: '16px',
//     outline: 'none',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//   },
//   tableHeader: {
//     textAlign: 'left',
//     padding: '10px',
//     borderBottom: '2px solid #e0e0e0',
//     cursor: 'pointer',
//   },
//   tableRow: {
//     borderBottom: '1px solid #e0e0e0',
//   },
// };

// export default IncidentManager;

import React, { useState, useMemo } from 'react';
import { X, Search, ArrowUpDown, Calendar, Clock } from 'lucide-react';

const IncidentManager = ({ incidents, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const filteredAndSortedIncidents = useMemo(() => {
    return incidents
      .filter(incident => {
        const matchesSearch = 
          incident.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.zoneType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (incident.eventDetails && incident.eventDetails.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDate = !dateFilter || incident.timestamp.includes(dateFilter);
        const matchesTime = !timeFilter || incident.timestamp.includes(timeFilter);
        const matchesEventType = eventTypeFilter === 'all' || incident.eventType === eventTypeFilter;

        return matchesSearch && matchesDate && matchesTime && matchesEventType;
      })
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [incidents, searchTerm, sortField, sortOrder, dateFilter, timeFilter, eventTypeFilter]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.incidentManager}>
        <div style={styles.header}>
          <h2 style={styles.title}>Incident Manager</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.filterContainer}>
          <div style={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterItem}>
            <Calendar size={20} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={styles.filterInput}
            />
          </div>
          <div style={styles.filterItem}>
            <Clock size={20} />
            <input
              type="time"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={styles.filterInput}
            />
          </div>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Events</option>
            <option value="accident">Accidents</option>
            <option value="vehicleFailure">Vehicle Failures</option>
          </select>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['vehicleId', 'zone', 'zoneType', 'eventType', 'timestamp'].map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    style={styles.tableHeader}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)} <ArrowUpDown size={14} />
                  </th>
                ))}
                <th style={styles.tableHeader}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedIncidents.map((incident) => (
                <tr key={incident.id} style={{
                  ...styles.tableRow,
                  backgroundColor: incident.eventType === 'accident' ? '#ffeeee' : '#fff5ee'
                }}>
                  <td>{incident.vehicleId}</td>
                  <td>{incident.zone}</td>
                  <td>{incident.zoneType}</td>
                  <td>{incident.eventType}</td>
                  <td>{new Date(incident.timestamp).toLocaleString()}</td>
                  <td>{incident.eventDetails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  incidentManager: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '90%',
    overflowY: 'auto',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    flex: 1,
    marginRight: '10px',
  },
  searchInput: {
    marginLeft: '10px',
    border: 'none',
    background: 'none',
    flex: 1,
    fontSize: '16px',
    outline: 'none',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
  },
  filterInput: {
    marginLeft: '5px',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  select: {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '2px solid #e0e0e0',
    cursor: 'pointer',
  },
  tableRow: {
    borderBottom: '1px solid #e0e0e0',
  },
};

export default IncidentManager;