import React from "react";
import TextInput from "../common/TextInput";
import PropTypes from "prop-types";

function CreateUserForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <TextInput
        id="name"
        type="text"
        label="Name"
        onChange={props.onChange}
        name="name"
        value={props.user.name}
        error={props.errors.name}
        readOnly={false}
      />
      <TextInput
        id="password"
        type="password"
        label="Password"
        onChange={props.onChange}
        name="password"
        value={props.user.password}
        error={props.errors.password}
        readOnly={false}
      />
      <TextInput
        id="username"
        type="text"
        label="Username"
        onChange={props.onChange}
        name="username"
        value={props.user.username}
        error={props.errors.username}
        readOnly={false}
      />
      <div style={{textAlign: 'center'}}>
      <input type="submit" value="Save" className="btn btn-primary" />
      </div>
    </form>
  );
}

CreateUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default CreateUserForm;
