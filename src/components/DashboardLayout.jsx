import React, { useState } from 'react';
import { Home, FileText, Settings } from 'lucide-react';
import { Dashboard } from "./sidebar/Dashboard";
import { Reports } from "./sidebar/Reports";
import { Settingss } from "./sidebar/Settings";

export default function DashboardLayout() {
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