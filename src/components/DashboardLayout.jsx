import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  MapPin, 
  FileText, 
  Mail, 
  Ticket, 
  BarChart, 
  AlertTriangle, 
  Settings, 
  LogOut 
} from 'lucide-react';

// Import your components
import { Dashboard } from './sidebar/Dashboard';
import { Analytics } from './sidebar/Analytics';
import { ZoneInsights } from './sidebar/ZoneInsights';
import { Reports } from './sidebar/Reports';
import { MailAndSQSPage } from './sidebar/MailAndSQSPage';
import { TicketingPage } from './sidebar/TicketingPage';
import { AnalyticalReport } from './sidebar/AnalyticalReport';
import { AccidentFlaggedVehicles } from './sidebar/AccidentFlaggedVehicles';
import { Settingss } from './sidebar/Settings';
import SpeedBreakerChatbot from './SpeedBreakerChatBot';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    
    // Call logout method to clear any auth state
    onLogout();
    
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl mb-4">Logout</h2>
      <p className="mb-6">Are you sure you want to log out?</p>
      <button 
        onClick={handleLogout}
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
      >
        Confirm Logout
      </button>
    </div>
  );
};

const DashboardLayout = ({ onLogout, isSidebarOpen, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, key: 'dashboard', component: Dashboard },
    { name: 'Analytics', icon: Activity, key: 'analytics', component: Analytics },
    { name: 'Zone Insights', icon: MapPin, key: 'zone-insights', component: ZoneInsights },
    { name: 'Reports', icon: FileText, key: 'reports', component: Reports },
    { name: 'Mail & SQS', icon: Mail, key: 'mail-sqs', component: MailAndSQSPage },
    { name: 'Ticketing', icon: Ticket, key: 'ticketing', component: TicketingPage },
    { name: 'Analytical Report', icon: BarChart, key: 'analytical-report', component: AnalyticalReport },
    { name: 'Accident Flagged', icon: AlertTriangle, key: 'accident-flagged', component: AccidentFlaggedVehicles },
    { name: 'Settings', icon: Settings, key: 'settings', component: Settingss },
    { name: 'Logout', icon: LogOut, key: 'logout', component: () => <Logout onLogout={onLogout} /> },
  ];

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const ActiveComponent = sidebarItems.find(item => item.key === activeTab)?.component || null;

  const handleTabSelect = (key) => {
    setActiveTab(key);
    if (isMobile) toggleSidebar();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            isMobile 
              ? `fixed top-0 left-0 bottom-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out 
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
              : 'w-1/5 bg-white border-r-2 border-yellow-500 fixed left-0 top-16 bottom-0 overflow-y-auto'
          }`}
        >
          <nav className={`mt-4 ${isMobile ? 'pt-16' : ''}`}>
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabSelect(item.key)}
                className={`w-full text-left px-4 py-3 flex items-center ${
                  activeTab === item.key 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'hover:bg-yellow-100 text-gray-800'
                } transition duration-200 ease-in-out`}
              >
                <item.icon className="mr-3" size={20} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className={`${isMobile ? 'w-full' : 'w-4/5 ml-[20%]'} overflow-y-auto`}>
          {ActiveComponent && <ActiveComponent />}
        </div>

        {/* SpeedBreakerChatbot */}
        <SpeedBreakerChatbot />
      </div>

      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
