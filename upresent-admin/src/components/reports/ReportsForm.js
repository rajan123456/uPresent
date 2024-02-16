import React from "react";
import DropDown from "../common/DropDown";
import PropTypes from "prop-types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

function ReportsForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <Grid container spacing={Number(2)}>
        <Grid item xs={12}>
          <div style={{width:'25%'}}>
          <DropDown
            id="moduleCode"
            name="moduleCode"
            label="Module Code"
            onChange={props.onChangeSelector}
            value={props.report.moduleCode}
            error={props.errors.moduleCode}
            options={props.modules}
          /></div>
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12}>
            <DatePicker
              id="startDate"
              placeholder="MM/DD/YYYY"
              format={"MM/DD/YYYY"}
              label="Start Date"
              value={props.report.startDate}
              onChange={props.onStartDateChange}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              id="endDate"
              placeholder="MM/DD/YYYY"
              format={"MM/DD/YYYY"}
              label="End Date"
              value={props.report.endDate}
              onChange={props.onEndDateChange}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Button type="submit" variant="contained" color="primary">
          Generate
        </Button>
      </Grid>
    </form>
  );
}

ReportsForm.propTypes = {
  report: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  onChangeSelector: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ReportsForm;
