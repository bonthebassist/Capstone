import React from 'react'
import { Outlet } from 'react-router-dom';

function DisplaySchool() {

  return (
    <>
    <div className="content-div">
      <Outlet />
    </div>
    </>
  )
}

export default DisplaySchool