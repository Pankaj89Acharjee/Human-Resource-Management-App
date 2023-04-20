import React from "react";
import { Link } from "react-router-dom";
import "../../assets/import.css";
import { Button } from 'react-bootstrap';

const AdminHome = (props) => {
  return (
    <>
      <section className="content rightpanel p-4">
        <div className="row">
          <div className="col-lg-6">
            <h3>Dashboard </h3>
          </div>
        </div>

        <div class="container-fluid pt-3">
          <div class="row">
            <div class="col-12 col-sm-6 col-md-3">
              <div class="info-box">
                <span class="info-box-icon bg-info elevation-1"><i class="fas fa-user"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Employee</span>
                  <h4 class="info-box-number">
                    10
                  </h4>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="info-box mb-3">
                <span class="info-box-icon bg-success elevation-1"><i class="fas fa-desktop"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Assets Request</span>
                  <h4 class="info-box-number">10</h4>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="info-box mb-3">
                <span class="info-box-icon bg-danger elevation-1"><i class="fas fa-users"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Pre Joining</span>
                  <h4 class="info-box-number">10</h4>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <div class="info-box">
                <span class="info-box-icon bg-success elevation-1"><i class="fas fa-user"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Pre Joining</span>
                  <h4 class="info-box-number">10</h4>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="container-fluid pt-3">
          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Pre Joining</h3>
                  <div class="card-tools">
                    <Link className="btn btn-dark btn-sm" to="/admin/pre-joining">View</Link>
                  </div>
                </div>

                <div class="card-body p-0">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Task</th>
                        <th>Progress</th>
                        <th>Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1.</td>
                        <td>Update software</td>
                        <td>

                        </td>
                        <td><span class="badge bg-danger">55%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>



            </div>
            <div className="col-lg-6">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Assets Requests</h3>
                  <div class="card-tools">
                    <Link className="btn btn-dark btn-sm" to="/admin/employee-request">View</Link>
                  </div>
                </div>

                <div class="card-body p-0">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th >#</th>
                        <th>Task</th>
                        <th>Progress</th>
                        <th >Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1.</td>
                        <td>Update software</td>
                        <td>

                        </td>
                        <td><span class="badge bg-danger">55%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>
    </>
  );
};
export default AdminHome;
