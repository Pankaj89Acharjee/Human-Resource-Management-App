import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const EmployeeRequest = (props) => {
	return (
		<>
			<section className="content p-4">
				<div className="row">
					<div className="col-lg-6">
						<h3>Employee Request </h3>
					</div>
					{/* <div className="col-lg-6 text-right">
						<Link to="/admin/add-employee" className="btn btn-dark"><i class="fa fa-plus" aria-hidden="true"></i> Add New</Link>
					</div> */}
				</div>

				<div className="container-fluid card mt-3">
					<div className="table_cont table-responsive">
					<table class="table table-hover text-nowrap">
							<thead>
								<tr>
									<th scope="col">ID</th>
									<th scope="col">NAME</th>
									<th scope="col">ITEM</th>
									<th scope="col">CATEGORY</th>
									<th scope="col">REMARKS</th>
									<th scope="col">STATUS</th>
									<th scope="col">REQ. DATE</th>
									<th scope="col">ACTION</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td >1</td>
									<td>Aman Singh</td>
									<td>Low End Laptop_HP EliteBook 840 G3</td>
									<td>Laptop</td>
									<td>Need Laptop</td>
									<td>
										<span className="badge badge-success">Approve</span>
									</td>
									<td>20 Jan 2023</td>
									<td>
									<Link className="btn btn-dark" to="/admin/employee-request/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
									</td>
								</tr>
								<tr>
									<td >1</td>
									<td>Aman Singh</td>
									<td>Low End Laptop_HP EliteBook 840 G3</td>
									<td>Laptop</td>
									<td>Need Laptop</td>
									<td>
										<span className="badge badge-danger">Reject</span>
									</td>
									<td>20 Jan 2023</td>
									<td>
									<Link className="btn btn-dark" to="/admin/employee-request/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
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
export default EmployeeRequest;
