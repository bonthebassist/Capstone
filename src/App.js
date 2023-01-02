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
import TermDiary from './components/TermDiary';
import MyDetailsPage from './pages/MyDetailsPage';

import Login from './pages/Login';
import Register from './pages/Register'
import HomePage from './pages/HomePage';


function App() {
  return (
    <main >
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/Register' element={<Register />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Schools' element={<SchoolsPage />} />
        <Route path='/Students' element={<StudentsPage />} />
        <Route path='/Attendance' element={<Attendance />} />
        <Route path='/Invoice' element={<InvoicePage />} />
        <Route path='/MyDetails' element={<MyDetailsPage />} />
        <Route path='/Schools/NewSchoolForm' element={<NewSchoolForm />} />
        <Route path='/DisplaySchool' element={<DisplaySchool />}>
          <Route path=':schoolName' element={<DisplaySchoolInfo />} />
        </Route>
        <Route path='/Schools/Diaries/AshleyK' element={<TermDiary />} />
        <Route path='/Students/NewStudent' element={<NewStudentForm />} />
      </Routes>
    </main>
  );
}

export default App;
