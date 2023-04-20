import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";
const JobReference = (props) => {
	return (
		<>
			<section className="content p-4">
				<div className="row">
					<div className="col-lg-6">
						<h3>Job Requisition </h3>
					</div>
					{/* <div className="col-lg-6 text-right">
						<Link to="/admin/add-employee" className="btn btn-dark"><i class="fa fa-plus" aria-hidden="true"></i> Add New</Link>
					</div> */}
				</div>

				<div className="container-fluid card mt-3">
					<div className="table_cont table-responsive">
						<table class="table table-striped table-light table-bordered">
							<thead>
								<tr>
									<th width="8%" scope="col">ID</th>
									<th width="20%" scope="col">TITLE</th>
									<th width="20%" scope="col">REASON</th>
									<th width="10%" scope="col">POSTED BY </th>
									<th width="8%" scope="col">HOD STATUS</th>
									<th width="8%" scope="col">HR STATUS</th>
									<th width="8%" scope="col">ACTION</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td >1</td>
									<td>Mark</td>
									<td>Otto</td>
									<td>Otto</td>
									<td>
										<button className="btn btn-sm btn-success rounded">Approved</button>
									</td>
									<td>
										<button className="btn btn-sm btn-warning rounded">Pending</button>
									</td>
									<td>
									<Link className="btn btn-dark" to="/admin/employee/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
									</td>
								</tr>
								<tr>
									<td >4</td>
									<td>Mark</td>
									<td>Otto</td>
									<td>Otto</td>
									<td>
										<button className="btn btn-sm btn-warning rounded">Pending</button>
									</td>
									<td>
										<button className="btn btn-sm btn-warning rounded">Pending</button>
									</td>
									<td>
										<Link className="btn btn-dark" to="/admin/employee/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
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
export default JobReference;
