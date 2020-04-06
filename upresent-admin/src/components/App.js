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
import FencesPage from "./fences/FencesPage";
import CreateFencesPage from "./fences/CreateFencesPage";
import ManageFencesPage from "./fences/ManageFencesPage";
import ModulesPage from "./modules/ModulesPage";
import CreateModulesPage from "./modules/CreateModulesPage";
import ManageModulesPage from "./modules/ManageModulesPage";

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
          <PrivateRoute path="/fences" component={FencesPage} />
          <PrivateRoute path="/fence/add" exact component={CreateFencesPage} />
          <PrivateRoute
            path="/fence/:universityName"
            component={ManageFencesPage}
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
          <Route component={FileNotFoundPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
