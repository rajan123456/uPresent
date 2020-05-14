import React, { useState, useEffect } from "react";
import ManageUserForm from "./ManageUserForm";
import Header from "../common/Header";
import * as userApi from "../../api/userApi";
import { toast } from "react-toastify";

const ManageUsersPage = (props) => {
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    name: "",
    password: "",
    username: "",
    userType: "admin",
    school: null,
    imageId: [],
    isActive: 1,
  });

  useEffect(() => {
    const username = props.match.params.username;
    if (username) {
      userApi.getUserByUsername(username).then((_user) => setUser(_user.data));
    }
  }, [props.match.params.username]);

  function handleChange({ target }) {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.name) _errors.name = "Name is required";
    if (!user.username) _errors.username = "Username is required";
    if (!user.password) _errors.password = "Password is required.";

    if (user.isActive === "0" || user.isActive === 0) user.isActive = 0;
    else if (user.isActive === "1" || user.isActive === 1) user.isActive = 1;
    else _errors.isActive = "Status can only be binary";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    userApi.updateUser(user).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/users");
        toast.success("User updated");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  function handleDelete(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    userApi.deleteUser(user.username).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/users");
        toast.success("User deleted");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{padding: '10px'}}>
        <h2>Manage User</h2>
        <ManageUserForm
          errors={errors}
          user={user}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleDelete}
        />
      </div>
    </div>
  );
};

export default ManageUsersPage;
