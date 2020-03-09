import React, { useState, useEffect } from "react";
import ManageUserForm from "./ManageUserForm";
import Header from "../common/Header";
import * as userApi from "../../api/userApi";
import { toast } from "react-toastify";

const ManageUsersPage = props => {
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    device_id: "",
    user_role: ""
  });

  useEffect(() => {
    const user_id = props.match.params.user_id;
    if (user_id) {
      userApi.getUserById(user_id).then(_user => setUser(_user));
    }
  }, [props.match.params.user_id]);

  function handleChange({ target }) {
    setUser({
      ...user,
      [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.first_name) _errors.first_name = "First Name is required";
    if (!user.last_name) _errors.last_name = "Last Name is required";
    if (!user.email) _errors.email = "Email is required";
    if (!user.mobile_number)
      _errors.mobile_number = "Mobile number is required";
    if (!user.device_id) _errors.device_id = "Device ID is required";
    if (!user.user_role) _errors.user_role = "Role is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    userApi.saveUser(user).then(() => {
      props.history.push("/users");
      toast.success("User saved");
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
