import React, { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import Header from "../common/Header";
import * as userApi from "../../api/userApi";
import { toast } from "react-toastify";

const CreateUsersPage = (props) => {
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
        <h2>Add User</h2>
        <CreateUserForm
          errors={errors}
          user={user}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateUsersPage;
