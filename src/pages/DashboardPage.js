import React, { useState, useEffect, useContext } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBCollapse,
  MDBRipple,
  MDBListGroup, 
  MDBListGroupItem
} from 'mdb-react-ui-kit';

import HorizontalLogo from '../Chuta-logo-horizontal-01.svg'
import {NavLink} from 'react-router-dom'
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';


export default function DashboardElements() {
  const {auth} = useContext(AuthContext)
  const [showShow, setShowShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarURL, setAvatarURL] = useState('');
  const [active, setActive] = useState(false)

  const toggleShow = () => setShowShow(!showShow);

  // let location = useLocation
  // const setActiveLocation = () => {
  //   if (location === useLocation){
  //     setActive(!active)
  //   }
  // }

  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/user?email=${auth.email}`, config)
    .then((resp) => {
      console.log(resp.data)
      setFirstName(resp.data.firstName)
      setLastName(resp.data.lastName)
      setAvatarURL(`https://ui-avatars.com/api/?name=${firstName}+${lastName}&size=128`)
    })
    
  }, [auth.email, auth.token, firstName, lastName])

  return (
    <>
      <link
        href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
        rel="stylesheet"
    	/>
      <MDBCollapse show={showShow} tag="nav" className="d-lg-block bg-white sidebar">
        <div className="position-sticky collapsible-div">
          <MDBListGroup flush className="mx-3 mt-4">

            <MDBRipple rippleTag='span'>
              <NavLink to='/Schools'>
              <MDBListGroupItem href='#' action className='border-0 border-bottom rounded' active={setActive} aria-current='true'>
                <MDBIcon fas icon="school me-3" />
                Schools
              </MDBListGroupItem>
              </NavLink>
            </MDBRipple>

            <MDBRipple rippleTag='span'>
            <NavLink to='/Students'>
              <MDBListGroupItem href='#' action className='border-0 border-bottom rounded' active={setActive}>
                <MDBIcon fas icon="users me-3" />
                Students
              </MDBListGroupItem>
              </NavLink>
            </MDBRipple>

            <MDBRipple rippleTag='span'>
            <NavLink to='/Attendance'>
              <MDBListGroupItem href='#' action className='border-0 border-bottom rounded'active={setActive}>
                <MDBIcon fas icon="table me-3" />
                Attendance
              </MDBListGroupItem>
              </NavLink>
            </MDBRipple>

            <MDBRipple rippleTag='span'>
            <NavLink to='/Invoice'>
              <MDBListGroupItem href='#' action className='border-0 border-bottom rounded' active={setActive}>
                <MDBIcon fas icon="file-invoice-dollar me-3" />
                Invoice
              </MDBListGroupItem>
              </NavLink>
            </MDBRipple>

          </MDBListGroup>
        </div>
        
      </MDBCollapse>

      <MDBNavbar expand='lg' light bgColor='light'>
        <MDBContainer fluid>
          <MDBNavbarNav className="d-flex flex-row align-items-center w-auto">
            <MDBNavbarToggler
              type='button'
              aria-label='Toggle navigation'
              onClick={toggleShow}
            >
              <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
            <MDBNavbarBrand href='#'>
              <img
                src={HorizontalLogo}
                height='50'
                alt=''
                loading='lazy'
              />
            </MDBNavbarBrand>

          </MDBNavbarNav>
          <MDBNavbarNav className="d-flex flex-row justify-content-end w-auto">

            <MDBNavbarItem className='me-3 me-lg-0 d-flex align-items-center'>
              <MDBDropdown>

                <MDBDropdownToggle tag="a" className="hidden-arrow nav-link">
                  <img src={avatarURL} className="rounded-circle" height="50" alt="" loading="lazy" />
                </MDBDropdownToggle>

                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <NavLink to="/MyDetails">
                      <MDBDropdownLink>My Details</MDBDropdownLink>
                    </NavLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink>Logout</MDBDropdownLink>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>     
    </>
  );
}