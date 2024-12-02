import React, { useState } from 'react';
import { Home, FileText, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from "./sidebar/Dashboard";
import { Reports } from "./sidebar/Reports";
import { Settingss } from "./sidebar/Settings";

// Create a simple Logout component
const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the authentication token
    localStorage.removeItem('authToken');
    
    // Call the onLogout prop to update authentication state
    onLogout();
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl mb-4">Logout</h2>
      <p className="mb-6">Are you sure you want to log out?</p>
      <button 
        onClick={handleLogout}
        className="
          bg-yellow-500 
          text-black 
          px-4 py-2 
          rounded 
          hover:bg-yellow-600 
          transition 
          duration-200 
          ease-in-out
        "
      >
        Confirm Logout
      </button>
    </div>
  );
};

export default function DashboardLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      key: 'dashboard',
      component: Dashboard
    },
    { 
      name: 'Reports', 
      icon: FileText, 
      key: 'reports',
      component: Reports
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      key: 'settings',
      component: Settingss
    },
    { 
      name: 'Logout', 
      icon: LogOut, 
      key: 'logout',
      component: () => <Logout onLogout={onLogout} />
    }
  ];

  const ActiveComponent = sidebarItems.find(item => item.key === activeTab)?.component || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-white border-r-2 border-yellow-500 text-black fixed left-0 top-16 bottom-0 overflow-y-auto scrollbar-hide">
          <nav className="mt-4">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`
                  w-full text-left px-4 py-3 flex items-center 
                  ${activeTab === item.key 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'hover:bg-yellow-100 text-gray-800'}
                  transition duration-200 ease-in-out
                `}
              >
                <item.icon className="mr-3" size={20} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="w-4/5 ml-[20%] mt-0 overflow-y-auto">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}