import React, { useState } from "react";
import CreateSchoolForm from "./CreateSchoolForm";
import Header from "../common/Header";
import * as fenceApi from "../../api/fenceApi";
import { toast } from "react-toastify";

const CreateSchoolPage = (props) => {
  const [errors, setErrors] = useState({});

  const [fence, setFence] = useState({
    schoolName: "",
    schoolCode: "",
    longitude: "",
    latitude: "",
    radiusInMeter: "",
    createdBy: "",
    timeZone: "",
    holidays: [new Date()]
  });

  function handleChange({ target }) {
    setFence({
      ...fence,
      [target.name]: target.value,
    });
  }

  function handleHolidayChange(dates) {
    console.log("holiday dates... "+dates);
    setFence({
      ...fence,
      ["holidays"]: dates,
    });
  }

  function formIsValid() {
    const _errors = {};
    if (!fence.schoolCode) _errors.schoolCode = "University code is required.";
    if (!fence.schoolName) _errors.schoolName = "University name is required.";
    if (!fence.longitude) _errors.longitude = "Longitude is required";
    if (!fence.latitude) _errors.latitude = "Latitude is required.";
    if (!fence.radiusInMeter) _errors.radiusInMeter = "Radius is required.";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    fence.geoFenceData = {
      "latitude": parseFloat(fence.latitude),
      "longitude": parseFloat(fence.longitude),
      "radiusInMeter": parseFloat(fence.radiusInMeter)
    }
    // var holidays = [];
    // for (var i = 0; i < fence.holidays.length; i++) {
    //   holidays.push(moment(fence.holidays[i]).format("MM/DD/YYYY"));
    // }
    // fence.holidays = holidays;
    fence.createdBy = localStorage.getItem("user");
    fenceApi.saveFence(fence).then(() => {
      props.history.push("/schools");
      toast.success("Fence saved");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{padding: '10px', width:'30%'}}>
        <h2>Add School</h2>
        <CreateSchoolForm
          errors={errors}
          fence={fence}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onChangeHoliday={handleHolidayChange}
        />
      </div>
    </div>
  );
};

export default CreateSchoolPage;
