import React, { useState, useEffect } from "react";
import ManageUserForm from "./ManageUserForm";
import Header from "../common/Header";
import * as userApi from "../../api/userApi";
import { toast } from "react-toastify";

const ManageUsersPage = props => {
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    name: "",
    password: "",
    username: "",
    userType: "admin",
    imageId: [],
    isActive: 1
  });

  useEffect(() => {
    const username = props.match.params.username;
    if (username) {
      userApi.getUserByUsername(username).then(_user => setUser(_user.data));
    }
  }, [props.match.params.username]);

  function handleChange({ target }) {
    setUser({
      ...user,
      [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.name) _errors.name = "Name is required";
    if (!user.username) _errors.username = "Username is required";
    if (!user.password) _errors.password = "Password is required.";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    userApi.updateUser(user).then(_resp => {
      if (_resp.message === "ok") {
        props.history.push("/users");
        toast.success("User updated");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Manage User</h2>
        <ManageUserForm
          errors={errors}
          user={user}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ManageUsersPage;
