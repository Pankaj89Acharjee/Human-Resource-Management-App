
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import "../assets/import.css";

import PrejoineeHeader from "./header";

const PrejoineeProfile = (props) => {
	const { dispatch } = useContext(UserContext);

	const [email, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [otp, setOtp] = useState('');

	const [loginpage, setLoginpage] = useState(true);
	const [loadingbtn, setLoadingbtn] = useState(false);
	const [otpbtn, setotpbtn] = useState(false);


	const showError = (type, message) => {
		function leftur() {
			document.getElementById('error').innerHTML = '';
		}
		document.getElementById('error').innerHTML = `<div class="bs-component"><div class="alert alert-dismissible alert-${type}"><button class="close" type="button" data-dismiss="alert">×</button> ${message} </div></div>`;
		setTimeout(leftur, 3000);
	}

	const getLogin = async () => {
		if (email === "") {
			return showError("danger", "Please enter valid Email Id")
		}
		if (password === "") {
			return showError("danger", "Please enter your password")
		}
		setLoadingbtn(true);
		setLoginpage(false)
	}

	useEffect(() => {
		// if (!localStorage.getItem("hrmsprejoinee")) {
		// 	window.location.href = '/prejoinee/login'
		// }
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<body class="hold-transition">
                <PrejoineeHeader />
                <div className="col-lg-12">
                    <div className="card p-3">
                        <h5>Hi, </h5>
                    </div>
                </div>
			</body>
		</>
	);
};

export default PrejoineeProfile;