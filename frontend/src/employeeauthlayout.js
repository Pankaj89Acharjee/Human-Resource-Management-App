import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

const EmployeeAuthLayout = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    const admin = localStorage.getItem("hrmsemp");
    if (admin) {
      history.push("/employee");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {children}
    </>
  );
};

export default EmployeeAuthLayout;
