import React, { useState } from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";

const Department = (props) => {
	const [modalShow, setShow] = useState(false);

	const handleClose = () => setShow(false);

	return (
		<>
			<section className="content p-4">
				<div className="row">
					<div className="col-lg-6">
						<h3>Department </h3>
					</div>
					<div className="col-lg-6 text-right">
					<Link className="btn btn-dark mr-1" to="/admin/grade"><i class="fa fa-tasks mr-1" aria-hidden="true"></i> Grade</Link>
						<button className="btn btn-dark ml-3" onClick={() => setShow(true)}><i class="fa fa-plus mr-1" aria-hidden="true"></i> Add New</button>
					</div>
				</div>

				<div className="container-fluid card mt-3">
					<div className="table_cont table-responsive">
						<table class="table table-hover text-nowrap">
							<thead>
								<tr>
									<th width="8%" scope="col">ID</th>
									<th width="30%" scope="col">DEPARTMENT</th>
									<th width="40%" scope="col">DESIGNATION</th>
									<th width="8%" scope="col">STATUS</th>
									<th width="8%" scope="col" className="text-center">ACTION</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td >1</td>
									<td>Otto</td>
									<td>Otto</td>
									<td>
										<span className="badge badge-warning">Inactive</span>
									</td>
									<td className="text-center">
										<button className="btn btn-dark ml-3" onClick={() => setShow(true)}><i class="fa fa-pencil-alt" aria-hidden="true"></i></button>
									</td>
								</tr>
								<tr>
									<td >1</td>
									<td>Otto</td>
									<td>Otto</td>
									<td>
										<span className="badge badge-success">Active</span>
									</td>
									<td className="text-center">
										<button className="btn btn-dark ml-3" onClick={() => setShow(true)}><i class="fa fa-pencil-alt" aria-hidden="true"></i></button>
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
export default Department;
