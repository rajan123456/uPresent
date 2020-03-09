import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import * as userApi from "../../api/userApi";
import { toast } from "react-toastify";

const LoginPage = props => {
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    email: "",
    user_password: ""
  });

  useEffect(() => {
    const user_id = props.match.params.user_id;
    if (user_id) {
      userApi.getUserById(user_id).then(_user => setUser(_user));
    }
    localStorage.clear();
  }, [props.match.params.user_id]);

  function handleChange({ target }) {
    setUser({
      ...user,
      [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.email) _errors.email = "Email is required";
    if (!user.user_password) _errors.user_password = "Password is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    userApi
      .loginUser(user.email, user.user_password)
      .then(() => {
        props.history.push("/home");
        toast.success("Welcome to Piggyback Portal!");
      })
      .catch(handleError);
  }

  function handleError(error) {
    toast.warn("Something went wrong");
  }

  return (
    <div className="jumbotron">
      <div className="container">
        <div className="col-sm-8 col-sm-offset-2">
          <>
            <h1>Piggyback Partners</h1>
            <LoginForm
              errors={errors}
              user={user}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
