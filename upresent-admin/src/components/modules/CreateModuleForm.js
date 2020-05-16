import React from "react";
import TextInput from "../common/TextInput";
import MultiDropDown from "../common/MultiDropDown";
import PropTypes from "prop-types";
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Grid from "@material-ui/core/Grid";

function CreateModuleForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <Grid container spacing={Number(2)}>
      <Grid item xs={12}>
          <TextInput
            id="schoolCode"
            type="text"
            label="School Code"
            onChange={props.onChange}
            name="schoolCode"
            value={props.module.schoolCode}
            error={props.errors.schoolCode}
            readOnly={false}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            id="moduleCode"
            type="text"
            label="Module Code"
            onChange={props.onChange}
            name="moduleCode"
            value={props.module.moduleCode}
            error={props.errors.moduleCode}
            readOnly={false}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            id="moduleName"
            type="text"
            label="Module Name"
            onChange={props.onChange}
            name="moduleName"
            value={props.module.moduleName}
            error={props.errors.moduleName}
            readOnly={false}
          />
        </Grid>
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
          <Grid item xs={12}>
            <TimePicker
              id="startTime"
              placeholder="HH:mm"
              ampm={false}
              format={"HH:mm"}
              label="Start Time"
              name="startTime"
              value={props.module.startTime}
              onChange={props.onStartTimeChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TimePicker
              id="endTime"
              placeholder="HH:mm"
              ampm={false}
              format={"HH:mm"}
              label="End Time"
              name="endTime"
              value={props.module.endTime}
              onChange={props.onEndTimeChange}
            />
          </Grid>
        </MuiPickersUtilsProvider>
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
        <Grid item xs={12}>
          <MultiDropDown
            id="studentUsernames"
            name="studentUsernames"
            label="Students Enrolled"
            onChange={props.onChangeSelector}
            values={props.module.studentUsernames}
            error={props.errors.studentUsernames}
            options={props.availableStudents}
          />
        </Grid>
      </Grid>
      <div style={{textAlign: 'center'}}>
        <input type="submit" value="Save" className="btn btn-primary" />
        </div>
    </form>
  );
}

CreateModuleForm.propTypes = {
  module: PropTypes.object.isRequired,
  daysOfWeek: PropTypes.array.isRequired,
  availableStudents: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeSelector: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default CreateModuleForm;
