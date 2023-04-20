import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const AdminLoans = (props) => {
	return (
		<>
			<section className="content p-4">
				<div className="row">
					<div className="col-lg-6">
						<h3>Loans </h3>
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
									<th width="5%" scope="col">ID</th>
									<th width="20%" scope="col">NAME</th>
									<th width="10%" scope="col">AMOUNT</th>
									<th width="10%" scope="col">APPLIED ON </th>
									<th width="10%" scope="col">REASON</th>
									<th width="10%" scope="col">HR STATUS</th>
									<th width="10%" scope="col">A/C STATUS</th>
									<th width="10%" scope="col">FINAL STATUS</th>
									<th width="10%" scope="col">ACTION</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td >1</td>
									<td>Mark</td>
									<td>Otto</td>
									<td>Otto</td>
									<td>Reason</td>
									<td>
										<span className="badge badge-success">Approved</span>
									</td>
									<td>
										<span className="badge badge-warning">Pending</span>
									</td>
									<td>
										<span className="badge badge-warning">Pending</span>
									</td>
									<td>
										<Link className="btn btn-dark" to="/admin/loans/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
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
export default AdminLoans;
