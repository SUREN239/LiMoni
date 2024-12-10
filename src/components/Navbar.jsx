import React, { useState } from 'react';
import { RefreshCw, Menu } from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  const [lastSync, setLastSync] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastSync(new Date());

    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const formatLastSync = () => {
    return lastSync.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Refresh overlay */}
      {isRefreshing && <div className="fixed inset-0 bg-white/80 z-[100] animate-pulse" />}

      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Menu Toggle for Mobile */}
            <div className="md:hidden">
              <button
                onClick={onMenuToggle}
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center md:justify-start items-center">
              <a href="/" className="flex items-center">
                <span className="text-2xl font-bold text-black">Limoni</span>
                <span className="ml-2 text-yellow-500 text-lg">•</span>
              </a>
            </div>

            {/* Sync and Refresh */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 mr-2 hidden md:block">
                Last sync at {formatLastSync()}
              </div>

              <button
                onClick={handleRefresh}
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                disabled={isRefreshing}
              >
                <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
