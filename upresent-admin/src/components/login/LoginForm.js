import React from "react";
import TextInput from "../common/TextInput";
import PropTypes from "prop-types";

function LoginForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <TextInput
        id="username"
        type="text"
        label="Username"
        onChange={props.onChange}
        name="username"
        value={props.user.username}
        error={props.errors.username}
      />
      <TextInput
        id="password"
        type="password"
        label="Password"
        onChange={props.onChange}
        name="password"
        value={props.user.password}
        error={props.errors.password}
      />
      <div class="text-center">
        <input type="submit" value="Login" className="btn btn-primary" />
      </div>
    </form>
  );
}

LoginForm.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default LoginForm;
