import React from 'react'

import Navbar from '../components/Navbar'
import DashboardLayout from '../components/DashboardLayout'

function MainDashboard() {
  return (
    <>
      <Navbar/>
      <div className="pt-16 ">
        <DashboardLayout/>
      </div>
    </>
  )
}

export default MainDashboard