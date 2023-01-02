import React from 'react'
import { Outlet } from 'react-router-dom';
import DashboardElements from '../pages/DashboardPage';

function DisplaySchool() {

  return (
    <>
    <DashboardElements/>
    <div className="content-div">
      <Outlet />
    </div>
    </>
  )
}

export default DisplaySchool