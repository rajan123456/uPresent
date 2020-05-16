import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from "./common/PrivateRoute";
import HomePage from "./home/HomePage";
import FileNotFoundPage from "./NotFoundPage";
import LoginPage from "./login/LoginPage";
import { ToastContainer } from "react-toastify";
import { toastDuration } from "../config/config";
import "react-toastify/dist/ReactToastify.css";
import UsersPage from "./users/UsersPage";
import CreateUsersPage from "./users/CreateUsersPage";
import ManageUsersPage from "./users/ManageUsersPage";
import SchoolPage from "./school/SchoolPage";
import CreateSchoolPage from "./school/CreateSchoolPage";
import ManageSchoolPage from "./school/ManageSchoolPage";
import ModulesPage from "./modules/ModulesPage";
import CreateModulesPage from "./modules/CreateModulesPage";
import ManageModulesPage from "./modules/ManageModulesPage";
import ReportsPage from "./reports/ReportsPage";

function App() {
  return (
    <div className="container-fluid">
      <ToastContainer autoClose={toastDuration} hideProgressBar />
      <div className="body">
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Redirect path="/login" to="/" />
          <PrivateRoute path="/home" component={HomePage} />
          <PrivateRoute path="/users" component={UsersPage} />
          <PrivateRoute path="/user/add" exact component={CreateUsersPage} />
          <PrivateRoute path="/user/:username" component={ManageUsersPage} />
          <PrivateRoute path="/schools" component={SchoolPage} />
          <PrivateRoute path="/school/add" exact component={CreateSchoolPage} />
          <PrivateRoute
            path="/school/:universityName"
            component={ManageSchoolPage}
          />
          <PrivateRoute path="/modules" component={ModulesPage} />
          <PrivateRoute
            path="/module/add"
            exact
            component={CreateModulesPage}
          />
          <PrivateRoute
            path="/module/:moduleCode"
            component={ManageModulesPage}
          />
          <PrivateRoute path="/reports" component={ReportsPage} />
          <Route component={FileNotFoundPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
