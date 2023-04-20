import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/import.css";

const Header = (props) => {

	useEffect(() => {

		// eslint-disable-next-line
	}, []);

	return (
		<aside class="main-sidebar sidebar-dark-primary elevation-4">
			<a href="/admin" class="brand-link">
				<img src="https://www.hashcashconsultants.com/img/hashcash-logo.png" alt="AdminLTE Logo" class="brand-image" />
				<span class="brand-text font-weight-light">ADMIN</span>
			</a>
			<div class="sidebar">

				<div class="user-panel mt-3 pb-3 mb-3 d-flex">
					<div class="image">
						<img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" class="img-circle elevation-2" alt="User Image" />
					</div>
					<div class="info">
						<Link to="/profile" class="">Raj</Link>
					</div>
				</div>

				<nav class="mt-2">
					<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

						<li class="nav-item">
							<Link to="/admin" class="nav-link active">
								<i class="fa fa-crosshairs nav-icon" aria-hidden="true"></i>
								<p>Dashboard</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/employee" class="nav-link">
								<i class="fa fa-users nav-icon" aria-hidden="true"></i>
								<p>Employees</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/pre-joining" class="nav-link">
								<i class="fa fa-users nav-icon" aria-hidden="true"></i>
								<p>Pre Joining</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/employee-request" class="nav-link">
								<i class="fa fa-server nav-icon" aria-hidden="true"></i>
								<p>Assets Request</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/assets" class="nav-link">
								<i class="fa fa-desktop nav-icon" aria-hidden="true"></i>
								<p>Assets</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/loans" class="nav-link">
								<i class="fa fa-money-bill nav-icon" aria-hidden="true"></i>
								<p>Loans</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/apprisal" class="nav-link">
								<i class="fa fa-money-bill-alt nav-icon" aria-hidden="true"></i>
								<p>Apprisal</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/job-requisition" class="nav-link">
								<i class="fa fa-users nav-icon" aria-hidden="true"></i>
								<p>Job Requisition </p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/newsfeed" class="nav-link">
								<i class="fa fa-address-card nav-icon" aria-hidden="true"></i>
								<p>News Feed</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/holiday" class="nav-link">
								<i class="fa fa-calendar-alt nav-icon" aria-hidden="true"></i>
								<p>Holiday's</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/department" class="nav-link">
								<i class="fa fa-boxes nav-icon" aria-hidden="true"></i>
								<p>Department</p>
							</Link>
						</li>
						<li class="nav-item">
							<Link to="/admin/seperated" class="nav-link">
								<i class="fa fa-users nav-icon" aria-hidden="true"></i>
								<p>Seperated</p>
							</Link>
						</li>
					</ul>
				</nav>

			</div>
		</aside>
	)
};

export default Header;

