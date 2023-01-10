import './App.css';
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Attendance from './pages/AttendancePage'
import SchoolsPage from './pages/SchoolsPage';
import StudentsPage from './pages/StudentsPage';
import InvoicePage from './pages/InvoiceLandingPage';
import NewSchoolForm from './components/NewSchoolForm';
import NewStudentForm from './components/NewStudentForm';
import DisplaySchool from './components/DisplaySchool';
import DisplaySchoolInfo from './components/DisplaySchoolInfo';
import MyDetailsPage from './pages/MyDetailsPage';
import DisplayStudent from './components/DisplayStudent';
import DisplayStudentInfo from './components/DisplayStudentInfo';
import LoggedInHome from './pages/LoggedInHome';

import Login from './pages/Login';
import Register from './pages/Register'
import HomePage from './pages/HomePage';
import NavbarBoots from './components/NavbarBoots';


function App() {
  return (
    <main >
      <NavbarBoots />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/Register' element={<Register />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Home' element={<LoggedInHome/>} />
        <Route path='/Schools' element={<SchoolsPage />} />
        <Route path='/Students' element={<StudentsPage />} />
        <Route path='/Attendance' element={<Attendance />} />
        <Route path='/Invoice' element={<InvoicePage />} />
        <Route path='/MyDetails' element={<MyDetailsPage />} />
        <Route path='/Schools/NewSchoolForm' element={<NewSchoolForm />} />
        <Route path='/DisplaySchool' element={<DisplaySchool />}>
          <Route path=':schoolName' element={<DisplaySchoolInfo />} />
        </Route>
        <Route path='/DisplayStudent' element={<DisplayStudent />}>
          <Route path=':studentName' element={<DisplayStudentInfo />} />
        </Route>
        <Route path='/Students/NewStudent' element={<NewStudentForm />} />
      </Routes>
      {/* <footer className='footer'>
      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2022 Copyright Bonnie Aue
      </div>
      </footer> */}
    </main>
  );
}

export default App;
