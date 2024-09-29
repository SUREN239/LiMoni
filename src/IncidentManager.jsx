import React, { useState, useMemo } from 'react';
import { X, Search, ArrowUpDown } from 'lucide-react';

const IncidentManager = ({ incidents, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedIncidents = useMemo(() => {
    return incidents
      .filter(incident =>
        incident.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.zoneType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.eventDetails && incident.eventDetails.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [incidents, searchTerm, sortField, sortOrder]);

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
          <h2>Incident Manager</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
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
        <table style={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('vehicleId')} style={styles.tableHeader}>
                Vehicle ID <ArrowUpDown size={14} />
              </th>
              <th onClick={() => handleSort('zone')} style={styles.tableHeader}>
                Zone <ArrowUpDown size={14} />
              </th>
              <th onClick={() => handleSort('zoneType')} style={styles.tableHeader}>
                Zone Type <ArrowUpDown size={14} />
              </th>
              <th onClick={() => handleSort('eventType')} style={styles.tableHeader}>
                Event Type <ArrowUpDown size={14} />
              </th>
              <th onClick={() => handleSort('timestamp')} style={styles.tableHeader}>
                Timestamp <ArrowUpDown size={14} />
              </th>
              <th style={styles.tableHeader}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedIncidents.map((incident) => (
              <tr key={incident.id} style={styles.tableRow}>
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
    width: '80%',
    maxWidth: '1200px',
    maxHeight: '80%',
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
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
  },
  searchInput: {
    marginLeft: '10px',
    border: 'none',
    background: 'none',
    flex: 1,
    fontSize: '16px',
    outline: 'none',
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