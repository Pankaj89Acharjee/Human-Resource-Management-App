import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    const admin = localStorage.getItem("hrmsadmin");
    if (admin) {
      history.push("/admin");
    }
    const employee = localStorage.getItem("hrmsemployee");
    if (employee) {
      history.push("/employee");
    }
    const prejoinee = localStorage.getItem("prejoinee");
    if (prejoinee) {
      history.push("/prejoinee");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {children}
    </>
  );
};

export default AuthLayout;
