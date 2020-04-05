import React from "react";
import TextInput from "../common/TextInput";
import PropTypes from "prop-types";

function ManageUserForm(props) {
  return (
    <form onSubmit={props.onSubmit} onReset={props.onReset}>
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
        id="isActive"
        type="text"
        label="Status"
        onChange={props.onChange}
        name="isActive"
        value={`${props.user.isActive}`}
        error={props.errors.isActive}
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
        readOnly={true}
      />

      <input type="submit" value="Save" className="btn btn-primary mr-1" />
      <input type="reset" value="Delete" className="btn btn-primary" />
    </form>
  );
}

ManageUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ManageUserForm;
