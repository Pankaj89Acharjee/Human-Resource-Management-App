import React from "react";
import { Router, Route, Switch, useHistory } from "react-router-dom";
import { EmployeeRouter, EmployeeAuthRouter, AdminRouter, AdminAuthRouter, AuthRouter } from "./router";

// EMPLOYEE
import EmployeeLayout from "./employeelayout";
import EmployeeAuthLayout from "./employeeauthlayout";

// ADMIN
import AdminAuthLayout from "./adminauthlayout";
import AdminLayout from "./adminlayout";

import AuthLayout from "./authlayout";

const Navigation = () => {
  const history = useHistory();

  return (
    <Router history={history}>
      <Switch>
        {EmployeeRouter.map((i, index) => (
          <Route
            exact
            key={index}
            path={i.path}
            render={(props) => (
              <EmployeeLayout history={props.history}>
                <i.component {...props} />
              </EmployeeLayout>
            )}
          />
        ))}

        {/* {EmployeeAuthRouter.map((i, index) => (
          <Route
            exact
            key={index}
            path={i.path}
            render={(props) => (
              <EmployeeAuthLayout history={props.history}>
                <i.component {...props} />
              </EmployeeAuthLayout>
            )}
          />
        ))} */}
        
        {/* {AdminAuthRouter.map((i, index) => (
          <Route
            exact
            key={index}
            path={i.path}
            render={(props) => (
              <AdminAuthLayout history={props.history}>
                <i.component {...props} />
              </AdminAuthLayout>
            )}
          />
        ))} */}
        {AuthRouter.map((i, index) => (
          <Route
            exact
            key={index}
            path={i.path}
            render={(props) => (
              <AuthLayout history={props.history}>
                <i.component {...props} />
              </AuthLayout>
            )}
          />
        ))}

        {AdminRouter.map((i, index) => (
          <Route
            exact
            key={index}
            path={i.path}
            render={(props) => (
              <AdminLayout history={props.history}>
                <i.component {...props} />
              </AdminLayout>
            )}
          />
        ))}
      </Switch>
    </Router>
  );
};

export default Navigation;