import React from "react";
import { PrivateRoute } from "./common/PrivateRoute";
import LoginPage from "./login/LoginPage";
import UsersPage from "./users/UsersPage";
import { Route, Switch, Redirect } from "react-router-dom";
import FileNotFoundPage from "./NotFoundPage";
import ManageUsersPage from "./users/ManageUsersPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastDuration } from "../config/config";
import HomePage from "./home/HomePage";
import CreateUsersPage from "./users/CreateUsersPage";

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
          <Route component={FileNotFoundPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
