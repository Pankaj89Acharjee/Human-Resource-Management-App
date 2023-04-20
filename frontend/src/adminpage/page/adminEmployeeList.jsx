import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const AdminEmployeeList = (props) => {
  return (
    <>
      <section className="content p-4">
        <div className="row">
          <div className="col-lg-6">
            <h3>Employee List </h3>
          </div>
          <div className="col-lg-6 text-right">
          </div>
        </div>

        <div className="container-fluid card mt-3">
          <div className="table_cont table-responsive">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th width="6%" scope="col">ID</th>
                  <th width="18%" scope="col">NAME</th>
                  <th width="12%" scope="col">EMPLOYEE ID</th>
                  <th width="20%" scope="col">DEPARTMENT</th>
                  <th width="20%" scope="col">DESIGNATION</th>
                  <th width="15%" scope="col">PHONE</th>
                  <th width="15%" scope="col">EMAIL</th>
                  <th width="10%" className="text-center" scope="col">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >1</td>
                  <td>Amit Kumar</td>
                  <td>23434345</td>
                  <td>Developer</td>
                  <td>UI Developer</td>
                  <td>9988776655</td>
                  <td>amit@hashcashconsultants.com</td>
                  <td>
                    <Link className="btn btn-dark mr-1" to="/admin/employee/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
                  </td>
                </tr>
                <tr>
                  <td >2</td>
                  <td>Raman Kumar</td>
                  <td>44434345</td>
                  <td>Marketing</td>
                  <td>Content Writer</td>
                  <td>1122334455</td>
                  <td>raman@hashcashconsultants.com</td>
                  <td>
                    <Link className="btn btn-dark mr-1" to="/admin/employee/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};
export default AdminEmployeeList;
