import React, { useState, useEffect } from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

const PreJoining = (props) => {
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
            <h3>Pre Joining </h3>
          </div>
          <div className="col-lg-6 text-right">
            <button className="btn btn-dark" onClick={() => setShow(true)}><i class="fa fa-plus" aria-hidden="true"></i> Add New</button>
          </div>
        </div>

        <div className="container-fluid card mt-3">
          <div className="table_cont table-responsive">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th width="10%" scope="col">ID</th>
                  <th width="30%" scope="col">NAME</th>
                  <th width="30%" scope="col">EMAIL ID</th>
                  <th width="15%" className="text-center" scope="col">STATUS</th>
                  <th width="15%" className="text-center" scope="col">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >1</td>
                  <td>Aman Singh</td>
                  <td>aman@gmail.com</td>
                  <td className="text-center">
                    <span className="badge badge-warning">Pending</span>
                  </td>
                  <td className="text-center">
                    <Link className="btn btn-dark ml-3" to="/admin/pre-joining/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
                  </td>
                </tr>

              </tbody>
            </table>
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
export default PreJoining;
