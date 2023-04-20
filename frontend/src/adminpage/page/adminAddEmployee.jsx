import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const AdminAddEmployee = (props) => {
  return (
    <>
      <section className="content rightpanel p-4">
        <h3>Add Employee</h3>
        <form>
        <div className="row add_form mt-3 p-3">
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2">
                  <label>Employee ID:</label>
                  <input type="text" class="form-control" />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2">
                  <label>Name:</label>
                  <input type="text" class="form-control" />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2">
                  <label>Designation:</label>
                  <input type="text" class="form-control" />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2">
                  <label>Department:</label>
                  <select class="form-control" id="exampleFormControlSelect1">
                    <option>Sales</option>
                    <option>Developer</option>
                    <option>UI/UX Designer</option>
                    <option>Human Resource</option>
                    <option>Accountant</option>
                  </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2">
                  <label>Joining Date:</label>
                  <input type="date" class="form-control" />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2">
                  <label>Status</label>
                  <input type="text" class="form-control" />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div class="form-group mb-2 mt-3">
                <button type="submit" class="btn btn-primary mb-2">Submit</button>
              </div>
            </div>
        </div>
        </form>
      </section>
    </>
  );
};
export default AdminAddEmployee;
