import React from 'react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Site Name */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-black">Limoni</span>
              <span className="ml-2 text-yellow-500 text-lg">•</span>
            </a>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-black hover:bg-yellow-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Refresh</a>
        
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
