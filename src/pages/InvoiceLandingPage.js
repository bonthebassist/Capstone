import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import HorizontalLogo from '../Chuta-logo-horizontal-01.svg'
import { Icon } from '@iconify/react';

export default function InvoiceLandingPage() {
  return (
    <>
      <div className="content-div">
        <h1 id="page-title"><Icon icon="noto-v1:party-popper" width="100" height="100" rotate={3} />    Invoicing feature coming soon!    <Icon icon="noto-v1:party-popper" width="100" height="100" /></h1>
        <MDBContainer className="py-5">
          <MDBCard className="p-4">
            <MDBCardBody>
              <MDBContainer className="mb-2 mt-3">
                <MDBRow className="d-flex align-items-baseline">
                  <MDBCol xl="9">
                    <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                      Invoice No: <strong>0001</strong>
                    </p>
                  </MDBCol>
                  <MDBCol xl="3" className="float-end">
                    <MDBBtn
                      color="light"
                      ripple="dark"
                      className="text-capitalize border-0"
                      disabled
                    >
                      <MDBIcon fas icon="print" color="primary" className="me-1" />
                      Print
                    </MDBBtn>
                    <MDBBtn
                      color="light"
                      ripple="dark"
                      className="text-capitalize border-0 ms-2"
                      disabled
                    >
                      <MDBIcon
                        far
                        icon="file-pdf"
                        color="danger"
                        className="me-1"
                      />
                      Export
                    </MDBBtn>
                    <hr />
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
              <MDBContainer>
                <MDBCol md="12" className="text-center">
                  <img
                    src={HorizontalLogo}
                    height='70'
                    alt='Chuta'
                    loading='lazy'
                  />
                  <p className="pt-0">www.chuta.com</p>
                </MDBCol>
              </MDBContainer>
              <MDBRow>
                <MDBCol xl="8">
                  <MDBTypography listUnStyled>
                    <li className="text-muted">
                      To: <span style={{ color: "#5d9fc5" }}>John Lorem</span>
                    </li>
                  </MDBTypography>
                </MDBCol>
                <MDBCol xl="4">
                  <p className="text-muted">Invoice</p>
                  <MDBTypography listUnStyled>
                    <li className="text-muted">
                      <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                      <span className="fw-bold ms-1">ID:</span>#123-456
                    </li>
                    <li className="text-muted">
                      <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                      <span className="fw-bold ms-1">Creation Date: </span>Jan
                      10, 2023
                    </li>
                    <li className="text-muted">
                      <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                      <span className="fw-bold ms-1">Status:</span>
                      <span className="badge bg-warning text-black fw-bold ms-1">
                        Unpaid
                      </span>
                    </li>
                  </MDBTypography>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  <MDBTypography>
                    <h5>Term 1, 2023 Tuition</h5>
                  </MDBTypography>
                </MDBCol>
              </MDBRow>
              <MDBRow className="my-2 mx-1 justify-content-center">
                <MDBTable striped borderless>
                  <MDBTableHead
                    className="text-white"
                    style={{ backgroundColor: "#84B0CA" }}
                  >
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Description</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Unit Price</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Inidivudal 30 minute lessons</td>
                      <td>8</td>
                      <td>$35</td>
                      <td>$280</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>AMEB Grade 4 Piano Book</td>
                      <td>1</td>
                      <td>$10</td>
                      <td>$10</td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </MDBRow>
              <MDBRow>
                <MDBCol xl="8">
                  <p className="ms-3">
                    Please make payments via direct deposit to: <br />
                    Acc Name: Chuta Tutor <br />
                    BSB: 123-456 <br />
                    Acc No: 123456789 <br />
                  </p>
                </MDBCol>
                <MDBCol xl="3">
                  <MDBTypography listUnStyled>
                    <li className="text-muted ms-3">
                      <span class="text-black me-4">SubTotal</span>$290
                    </li>
                    <li className="text-muted ms-3 mt-2">
                      <span class="text-black me-4">GST(10%)</span>$29
                    </li>
                  </MDBTypography>
                  <p className="text-black float-start">
                    <span className="text-black me-3"> Total Amount</span>
                    <span style={{ fontSize: "25px" }}>$319</span>
                  </p>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol xl="10">
                  <p>Thank you</p>
                </MDBCol>
                <MDBCol xl="2">
                  <MDBBtn
                    className="text-capitalize"
                    style={{ backgroundColor: "#60bdf3" }}
                    disabled
                  >
                    Send Now
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </>
  );
}