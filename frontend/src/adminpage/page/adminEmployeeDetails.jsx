import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const AdminEmployeeDetails = (props) => {
  return (
    <>
      <section className="content rightpanel p-4">
      <div className="row">
          <div className="col-lg-6">
            <h3>Amit Kumar - 923748964 </h3>
          </div>
          <div className="col-lg-6 text-right">
            <Link to="/admin/" className="btn btn-dark ml-2"><i class="fa fa-desktop mr-1" aria-hidden="true"></i> Assets</Link>
            <Link to="/admin/" className="btn btn-dark ml-2"><i class="fa fa-money-bill mr-1" aria-hidden="true"></i> Salary</Link>
            <Link to="/admin/" className="btn btn-dark ml-2"><i class="fa fa-calendar-check mr-1" aria-hidden="true"></i> Leaves</Link>
            <Link to="/admin/" className="btn btn-dark ml-2"><i class="fa fa-calendar mr-1" aria-hidden="true"></i> Attendance</Link>
          </div>
        </div>
        <div className="container-fluid card mt-3">
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

        <div className="container-fluid card mt-3">
          <div className="card-header">
            <h5 className="text-uppercase font-weight-bold">Personal Profile</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-4 col-lg-4">
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Date Of Birth
                  </div>
                  <div className="col-12 prof_text">
                    02-04-1990
                  </div>
                </div>
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Blood Group
                  </div>
                  <div className="col-12 prof_text">
                    O+
                  </div>
                </div>
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Nationality
                  </div>
                  <div className="col-12 prof_text">
                    Indian
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-8 col-lg-4 prof_text pl-md-3">
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Martial Status
                  </div>
                  <div className="col-12 prof_text">
                    Kartick Kumar Swarnakar
                  </div>
                </div>
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Marriage Date
                  </div>
                  <div className="col-12 prof_text">
                    36000444
                  </div>
                </div>
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Spouse
                  </div>
                  <div className="col-12 prof_text">
                    ****
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-12 col-lg-4">
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Residensial Address
                  </div>
                  <div className="col-12 prof_text">
                    12 B Hari Lane
                  </div>
                </div>
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Father Name
                  </div>
                  <div className="col-12 prof_text">
                    Uday Singh
                  </div>
                </div>
                <div className="row prof_text_cont">
                  <div className="col-12 prof_heading">
                    Physically Challenge
                  </div>
                  <div className="col-12 prof_text">
                    No
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="container-fluid card mt-3">
          <div className="card-header">
            <h5 className="text-uppercase font-weight-bold">Documents</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-6 prof_heading">
                Aadhar Card (Front)
              </div>
              <div className="col-6 prof_text">
                <button className="btn btn-sm btn-success"> <i className="fa fa-paperclip"></i> Updated </button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6 prof_heading">
                Aadhar Card (Back)
              </div>
              <div className="col-6 prof_text">
                <button className="btn btn-sm btn-success"> <i className="fa fa-paperclip"></i> Updated </button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6 prof_heading">
                PAN Card
              </div>
              <div className="col-6 prof_text">
                <button className="btn btn-sm btn-danger"> Not Updated </button>
              </div>
            </div>


          </div>
        </div>

      </section>
    </>
  );
};
export default AdminEmployeeDetails;
