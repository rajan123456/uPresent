import React from "react";
import TextInput from "../common/TextInput";
import MultiDropDown from "../common/MultiDropDown";
import PropTypes from "prop-types";

function ManageModuleForm(props) {
  return (
    <form onSubmit={props.onSubmit} onReset={props.onReset}>
      <TextInput
        id="moduleCode"
        type="text"
        label="Code"
        onChange={props.onChange}
        name="moduleCode"
        value={props.module.moduleCode}
        error={props.errors.moduleCode}
        readOnly={true}
      />
      <TextInput
        id="moduleName"
        type="text"
        label="Name"
        onChange={props.onChange}
        name="moduleName"
        value={props.module.moduleName}
        error={props.errors.moduleName}
        readOnly={false}
      />
      <TextInput
        id="startDate"
        type="text"
        label="Start Date"
        onChange={props.onChange}
        name="startDate"
        value={props.module.startDate}
        error={props.errors.startDate}
        readOnly={false}
      />
      <TextInput
        id="endDate"
        type="text"
        label="End Date"
        onChange={props.onChange}
        name="endDate"
        value={props.module.endDate}
        error={props.errors.endDate}
        readOnly={false}
      />
      <MultiDropDown
        id="scheduledDays"
        name="scheduledDays"
        label="Scheduled Days"
        onChange={props.onChangeSelector}
        values={props.module.scheduledDays}
        error={props.errors.scheduledDays}
        options={props.daysOfWeek}
      />
      <input type="submit" value="Save" className="btn btn-primary mr-1" />
      <input type="reset" value="Delete" className="btn btn-primary" />
    </form>
  );
}

ManageModuleForm.propTypes = {
  module: PropTypes.object.isRequired,
  daysOfWeek: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeSelector: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ManageModuleForm;
