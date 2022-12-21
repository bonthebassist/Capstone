import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import DashboardElements from './DashboardPage';

export default function MyDetailsPage() {
  return (
    <>
    <DashboardElements/>
    <div className='content-div'>
      <h2>My Details</h2>
      <p>Name: John Smith</p>
      <p>Email: john.smith@email.com</p>
      <p>Instrument/s: Piano, Voice</p>
      <p>Schools: Hills School</p>
      <Button>Edit</Button>
    </div>
    </>
  );
}