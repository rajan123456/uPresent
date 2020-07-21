import React from "react";
import TextInput from "../common/TextInput";
import MultiDropDown from "../common/MultiDropDown";
import PropTypes from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

function ManageModuleForm(props) {
  return (
    <form onSubmit={props.onSubmit} onReset={props.onReset}>
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
            readOnly={true}
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
            readOnly={true}
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
        </MuiPickersUtilsProvider>
        <div style={{ background: "yellow" }}>
          <label>&nbsp;Holiday Clashes observed at:&nbsp;&nbsp;</label>
          {props.holidayOverlap.map((overlap) => {
            return <label>{overlap}&nbsp;&nbsp;</label>;
          })}
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Delete Slot</th>
            </tr>
          </thead>
          <tbody>
            {props.module.schedule &&
              props.module.schedule.length > 0 &&
              props.module.schedule.map((module, index) => {
                return (
                  <tr key={module.date}>
                    <td>
                      <TextInput
                        type="text"
                        onChange={(e) =>
                          props.updateDate(
                            props.module.schedule,
                            e.target.value,
                            index
                          )
                        }
                        name="date"
                        value={module.date}
                        readOnly={false}
                      />
                    </td>
                    <td>
                      <TextInput
                        type="text"
                        onChange={(e) =>
                          props.updateStartTime(
                            props.module.schedule,
                            e.target.value,
                            index
                          )
                        }
                        name="startTime"
                        value={module.startTime}
                        readOnly={false}
                      />
                    </td>
                    <td>
                      <TextInput
                        type="text"
                        onChange={(e) =>
                          props.updateEndTime(
                            props.module.schedule,
                            e.target.value,
                            index
                          )
                        }
                        name="endTime"
                        value={module.endTime}
                        readOnly={false}
                      />
                    </td>
                    <td>
                      <Button
                        type="submit"
                        onClick={() =>
                          props.deleteSchedule(props.module.schedule, index)
                        }
                        variant="contained"
                        color="primary"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

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
        <input type="submit" value="Save" className="btn btn-primary mr-1" />
        <input type="reset" value="Delete" className="btn btn-primary" />
      </Grid>
    </form>
  );
}

ManageModuleForm.propTypes = {
  module: PropTypes.object.isRequired,
  availableStudents: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeSelector: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ManageModuleForm;
