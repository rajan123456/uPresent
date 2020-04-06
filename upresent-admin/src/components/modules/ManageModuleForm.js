import React from "react";
import TextInput from "../common/TextInput";
import MultiDropDown from "../common/MultiDropDown";
import PropTypes from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Grid from "@material-ui/core/Grid";

function ManageModuleForm(props) {
  return (
    <form onSubmit={props.onSubmit} onReset={props.onReset}>
      <Grid container spacing={Number(2)}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item xs={12}>
              <DatePicker
                id="startDate"
                placeholder="MM/DD/YYYY"
                format={"MM/DD/YYYY"}
                label="Start Date"
                value={props.module.startDate}
                onChange={props.onStartDateChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                id="endDate"
                placeholder="MM/DD/YYYY"
                format={"MM/DD/YYYY"}
                label="End Date"
                value={props.module.endDate}
                onChange={props.onEndDateChange}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <MultiDropDown
            id="scheduledDays"
            name="scheduledDays"
            label="Scheduled Days"
            onChange={props.onChangeSelector}
            values={props.module.scheduledDays}
            error={props.errors.scheduledDays}
            options={props.daysOfWeek}
          />
        </Grid>
        <input type="submit" value="Save" className="btn btn-primary mr-1" />
        <input type="reset" value="Delete" className="btn btn-primary" />
      </Grid>
    </form>
  );
}

ManageModuleForm.propTypes = {
  module: PropTypes.object.isRequired,
  daysOfWeek: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeSelector: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ManageModuleForm;
