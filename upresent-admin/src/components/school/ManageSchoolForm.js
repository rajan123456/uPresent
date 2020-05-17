import React from "react";
import TextInput from "../common/TextInput";
import PropTypes from "prop-types";
import MultipleDatePicker from 'react-multiple-datepicker'

function ManageSchoolForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <TextInput
        id="schoolName"
        type="text"
        label="School Name"
        onChange={props.onChange}
        name="schoolName"
        value={props.fence.schoolName}
        error={props.errors.schoolName}
        readOnly={false}
      />
      <TextInput
        id="schoolCode"
        type="text"
        label="School Code"
        onChange={props.onChange}
        name="schoolCode"
        value={props.fence.schoolCode}
        error={props.errors.schoolCode}
        readOnly={false}
      />
      <TextInput
        id="longitude"
        type="text"
        label="Longitude"
        onChange={props.onChange}
        name="longitude"
        value={props.fence.geoFenceData.longitude}
        error={props.errors.longitude}
        readOnly={false}
      />
      <TextInput
        id="latitude"
        type="text"
        label="Latitude"
        onChange={props.onChange}
        name="latitude"
        value={props.fence.geoFenceData.latitude}
        error={props.errors.latitude}
        readOnly={false}
      />
      <TextInput
        id="radiusInMeter"
        type="text"
        label="Radius (m)"
        onChange={props.onChange}
        name="radiusInMeter"
        value={props.fence.geoFenceData.radiusInMeter}
        error={props.errors.radiusInMeter}
        readOnly={false}
      />
      <label>Holidays</label>
      <MultipleDatePicker
        id="holidays"
        className="form-control"
        label="Add Holidays"
        onSubmit={props.onChangeHoliday}
        name="holidays"
        value={props.fence.holidays}
        error={props.errors.holidays}
        readOnly={false}
      />
      <TextInput
        id="timeZone"
        type="text"
        label="Timezone"
        onChange={props.onChange}
        name="timeZone"
        value={props.fence.timeZone}
        error={props.errors.timeZone}
        readOnly={false}
      />
      <input type="submit" value="Save" className="btn btn-primary mr-1" />
    </form>
  );
}

ManageSchoolForm.propTypes = {
  fence: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ManageSchoolForm;
