import React, { useState } from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";

const Grades = (props) => {
	const [modalShow, setShow] = useState(false);

	const handleClose = () => setShow(false);

	return (
		<>
			<section className="content p-4">
				<div className="row">
					<div className="col-lg-6">
						<h3>Grade </h3>
					</div>
					<div className="col-lg-6 text-right">
					<Link className="btn btn-dark mr-1" to="/admin/department"><i class="fa fa-boxes mr-1" aria-hidden="true"></i>Department </Link>
					</div>
				</div>

				<div className="container-fluid card mt-3">
					<div className="table_cont table-responsive">
						<table class="table table-hover text-nowrap">
							<thead>
								<tr>
									<th width="8%" scope="col">ID</th>
									<th width="40%" scope="col">GRADE</th>
									<th width="8%" scope="col">STATUS</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td >1</td>
									<td>L1</td>
									<td>
										<span className="badge badge-warning">Inactive</span>
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
export default Grades;
