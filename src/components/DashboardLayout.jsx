import React, { useState, useEffect } from 'react';
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
  LogOut,
  Menu, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import all previous imports (Dashboard, Analytics, etc.)
import { Dashboard } from "./sidebar/Dashboard";
import { Analytics } from "./sidebar/Analytics";
import { ZoneInsights } from "./sidebar/ZoneInsights";
import { Reports } from "./sidebar/Reports";
import { MailAndSQSPage } from "./sidebar/MailAndSQSPage";
import { TicketingPage } from "./sidebar/TicketingPage";
import { AnalyticalReport } from "./sidebar/AnalyticalReport";
import { AccidentFlaggedVehicles } from "./sidebar/AccidentFlaggedVehicles";
import { Settingss } from "./sidebar/Settings";

// Import SpeedBreakerChatbot
import SpeedBreakerChatbot from './SpeedBreakerChatBot';


const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  
    const handleLogout = () => {
      // Clear local storage
      localStorage.removeItem('token');
      
      // Call logout method to clear any auth state
      onLogout();
      
      // Perform a full page reload to reset all application state
      window.location.href = '/login';
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

export default function DashboardLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      key: 'dashboard',
      component: Dashboard
    },
    { 
      name: 'Analytics', 
      icon: Activity, 
      key: 'analytics',
      component: Analytics
    },
    { 
      name: 'Zone Insights', 
      icon: MapPin, 
      key: 'zone-insights',
      component: ZoneInsights
    },
    { 
      name: 'Reports', 
      icon: FileText, 
      key: 'reports',
      component: Reports
    },
    { 
      name: 'Mail & SQS', 
      icon: Mail, 
      key: 'mail-sqs',
      component: MailAndSQSPage
    },
    { 
      name: 'Ticketing', 
      icon: Ticket, 
      key: 'ticketing',
      component: TicketingPage
    },
    { 
      name: 'Analytical Report', 
      icon: BarChart, 
      key: 'analytical-report',
      component: AnalyticalReport
    },
    { 
      name: 'Accident Flagged', 
      icon: AlertTriangle, 
      key: 'accident-flagged',
      component: AccidentFlaggedVehicles
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

  // Check and update mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const ActiveComponent = sidebarItems.find(item => item.key === activeTab)?.component || null;

  // Mobile sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle tab selection
  const handleTabSelect = (key) => {
    setActiveTab(key);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };


  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-yellow-500 p-2 rounded-full shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Responsive Design */}
        <div 
          className={`
            ${isMobile 
              ? `fixed top-0 left-0 bottom-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out 
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
              : 'w-1/5 bg-white border-r-2 border-yellow-500 fixed left-0 top-16 bottom-0 overflow-y-auto'}
          `}
        >
          <nav className={`mt-4 ${isMobile ? 'pt-16' : ''}`}>
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabSelect(item.key)}
                className={`
                  w-full text-left px-4 py-3 flex items-center 
                  ${activeTab === item.key 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'hover:bg-yellow-100 text-gray-800'}
                  transition duration-200 ease-in-out
                `}
              >
                <item.icon className="mr-3" size={20} />
                {!isMobile && item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div 
          className={`
            ${isMobile 
              ? 'w-full pl-0 mt-16' 
              : 'w-4/5 ml-[20%] mt-0'} 
            overflow-y-auto
          `}
        >
          {ActiveComponent && <ActiveComponent />}
        </div>

        {/*SpeedBreakerChatbot */}
        <SpeedBreakerChatbot />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}