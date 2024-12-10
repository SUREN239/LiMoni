import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import DashboardLayout from '../components/DashboardLayout';

function MainDashboard({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar onMenuToggle={toggleSidebar} />
      <div className="pt-16">
        <DashboardLayout onLogout={onLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
    </>
  );
}

export default MainDashboard;
