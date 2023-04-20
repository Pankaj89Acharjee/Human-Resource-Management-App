import React, { useContext, useEffect } from "react";

import HEADER from "./employeepage/include/header";
import SIDEBAR from "./employeepage/include/sidebar";

import { useHistory } from "react-router-dom";
import { UserContext } from "./App";

const EmployeeLayout = ({ children }) => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    const admin = localStorage.getItem("hrmsemp");
    if (admin) {
      dispatch({ type: "HASHCASHEMPLOYEE", payload: admin });
    } else {
      history.push("/employee/login");
      localStorage.clear();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="wrapper">
      <HEADER />
      <SIDEBAR />
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </>
  )
};

export default EmployeeLayout;