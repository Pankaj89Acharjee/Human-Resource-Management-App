import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const AssetsAddNew = (props) => {
  return (
    <>
      <section className="content p-4">
        <div className="row">
          <div className="col-lg-6">
            <h3>Add New Assets </h3>
          </div>
        </div>

        <div className="container-fluid card mt-3">
         <p>Add new assets</p>
        </div>
      </section>
    </>
  );
};
export default AssetsAddNew;
