import React, { useState, useEffect } from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

const PreJoiningView = (props) => {
  const [modalShow, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <section className="content rightpanel p-4">
          <div className="row">
            <div className="col-lg-6">
              <h3>View Details of Pre Joining </h3>
            </div>
            <div className="col-lg-6 text-right">

            </div>
          </div>

        <div className="  mt-3">
          <div className="card">
            <div className="card-header">
              <h5 className="text-uppercase font-weight-bold">Employee Details</h5>
            </div>
            <div className="card-body">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-md-4 col-lg-4 mb-3">
                    <div className="row">
                      <div className="col-12 col-md-8 prof_pic">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="user dta" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-8 col-lg-4 prof_text pl-md-3">
                    <div className="row prof_text_cont">
                      <div className="col-12 prof_heading">
                        Name
                      </div>
                      <div className="col-12 prof_text">
                        Kartick Kumar Swarnakar
                      </div>
                    </div>
                    <div className="row prof_text_cont">
                      <div className="col-12 prof_heading">
                        Employee Id
                      </div>
                      <div className="col-12 prof_text">
                        36000444
                      </div>
                    </div>
                    <div className="row prof_text_cont">
                      <div className="col-12 prof_heading">
                        Primary Contact
                      </div>
                      <div className="col-12 prof_text">
                        9836600000
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-4">
                    <div className="row prof_text_cont">
                      <div className="col-12 prof_heading">
                        Company Email
                      </div>
                      <div className="col-12 prof_text">
                        kartick@hashcashconsultants.com
                      </div>
                    </div>
                    <div className="row prof_text_cont">
                      <div className="col-12 prof_heading">
                        Extension
                      </div>
                      <div className="col-12 prof_text">
                        414
                      </div>
                    </div>
                    <div className="row prof_text_cont">
                      <div className="col-12 prof_heading">
                        Alternative No
                      </div>
                      <div className="col-12 prof_text">
                        9831155555
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={modalShow}
          onHide={() => setShow(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Pre Joining Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" onChange={(e) => setName(e.target.value)} className="form-control p_input" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control p_input" />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="text" onChange={(e) => setPassword(e.target.value)} className="form-control p_input" />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShow(false)}>Close</Button>
            <Button onClick={() => setShow(false)} variant="success">Submit Details</Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};
export default PreJoiningView;
