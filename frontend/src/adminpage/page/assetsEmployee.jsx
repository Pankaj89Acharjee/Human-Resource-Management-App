import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const AssetsEmployee = (props) => {
  return (
    <>
      <section className="content p-4">
        <div className="row">
          <div className="col-lg-6">
            <h3>Employee List </h3>
          </div>
          <div className="col-lg-6 text-right">
            <Link to="/admin/add-employee" className="btn btn-dark"><i class="fa fa-plus" aria-hidden="true"></i> Add New</Link>
          </div>
        </div>

        <div className="container-fluid card mt-3">
          <div className="table_cont table-responsive">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Department</th>
                  <th scope="col">Joining Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td >2</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td >3</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td >4</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};
export default AssetsEmployee;
