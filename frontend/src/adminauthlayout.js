import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

const AdminAuthLayout = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    const admin = localStorage.getItem("hrmsadmin");
    if (admin) {
      history.push("/admin");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {children}
    </>
  );
};

export default AdminAuthLayout;
