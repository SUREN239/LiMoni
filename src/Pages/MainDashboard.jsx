import React from 'react'

import Navbar from '../components/Navbar'
import DashboardLayout from '../components/DashboardLayout'

function MainDashboard({onLogout}) {
  return (
    <>
      <Navbar/>
      <div className="pt-16 ">
        <DashboardLayout onLogout={onLogout}/>
      </div>
    </>
  )
}

export default MainDashboard