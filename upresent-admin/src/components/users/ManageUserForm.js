import React from "react";
import TextInput from "../common/TextInput";
import PropTypes from "prop-types";
import DropDown from "../common/DropDown";

function ManageUserForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <TextInput
        id="first_name"
        type="text"
        label="First Name"
        onChange={props.onChange}
        name="first_name"
        value={props.user.first_name}
        error={props.errors.first_name}
      />
      <TextInput
        id="last_name"
        type="text"
        label="Last Name"
        onChange={props.onChange}
        name="last_name"
        value={props.user.last_name}
        error={props.errors.last_name}
      />
      <TextInput
        id="email"
        type="text"
        label="Email"
        onChange={props.onChange}
        name="email"
        value={props.user.email}
        error={props.errors.email}
      />
      <TextInput
        id="mobile_number"
        type="text"
        label="Mobile Number"
        onChange={props.onChange}
        name="mobile_number"
        value={props.user.mobile_number}
        error={props.errors.mobile_number}
      />
      <TextInput
        id="device_id"
        type="text"
        label="Device ID"
        onChange={props.onChange}
        name="device_id"
        value={props.user.device_id}
        error={props.errors.device_id}
      />
      <DropDown
        id="user_role"
        name="user_role"
        label="Role"
        onChange={props.onChange}
        value={props.user.user_role}
        error={props.errors.user_role}
      />

      <input type="submit" value="Save" className="btn btn-primary" />
    </form>
  );
}

ManageUserForm.propTypes = {
  user: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default ManageUserForm;
