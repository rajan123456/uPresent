import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import * as userApi from "../../api/userApi";
import * as authApi from "../../api/authApi";
import { toast } from "react-toastify";

const LoginPage = (props) => {
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const username = props.match.params.username;
    if (username) {
      userApi.getUserByUsername(username).then((_user) => setUser(_user));
    }
    localStorage.clear();
  }, [props.match.params.username]);

  function handleChange({ target }) {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.username) _errors.username = "Username is required";
    if (!user.password) _errors.password = "Password is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    let authRequest = { password: user.password, username: user.username };
    authApi
      .loginUser(authRequest)
      .then((_resp) => {
        if (_resp.data === "ADMIN") {
          localStorage.setItem("user", user.username);
          props.history.push("/home");
          toast.success("Welcome to uPresent Admin Portal");
        } else handleError("You do not have sufficient privileges to login.");
      })
      .catch(handleError);
  }

  function handleError(error) {
    toast.warn("Something went wrong");
  }

  return (
    <div>
    <h1 style={{textAlign: 'center'}}>uPresent Admin Portal</h1>
    <div className="jumbotron" style={{width:'50%', marginLeft:'25%'}}>
      <div className="container">
          <>
          <h2 style={{textAlign: 'center',color:'black'}}>Login</h2>
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
