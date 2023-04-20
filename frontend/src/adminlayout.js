import React, { useContext, useEffect } from "react";

import HEADER from "./adminpage/include/header";
import SIDEBAR from "./adminpage/include/sidebar";

import { useHistory } from "react-router-dom";
import { UserContext } from "./App";

const AdminLayout = ({ children }) => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    // const admin = localStorage.getItem("hrmsadmin");
    // if (admin) {
    //   dispatch({ type: "HASHCASHADMIN", payload: admin });
    // } else {
    //   history.push("/admin/login");
    //   localStorage.clear();
    // }
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

export default AdminLayout;