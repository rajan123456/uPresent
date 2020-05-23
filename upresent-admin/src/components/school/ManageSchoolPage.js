import React, { useState, useEffect } from "react";
import ManageSchoolForm from "./ManageSchoolForm";
import Header from "../common/Header";
import * as fenceApi from "../../api/fenceApi";
import { toast } from "react-toastify";

const ManageSchoolPage = (props) => {
  const [errors, setErrors] = useState({});

  const [fence, setFence] = useState({
    schoolName: "",
    schoolCode: "",
    longitude: "",
    latitude: "",
    radiusInMeter: "",
    createdBy: "",
    timeZone: "",
    geoFenceData:"",
    holidays: [new Date()]
  });

  useEffect(() => {
    const schoolName = props.match.params.universityName;
    if (schoolName) {
      fenceApi
        .getFenceByUniversityName(schoolName)
        .then((_fence) => {
          var data = _fence.data;
          data.longitude = _fence.data.geoFenceData.longitude;
          data.latitude = _fence.data.geoFenceData.latitude;
          data.radiusInMeter = _fence.data.geoFenceData.radiusInMeter;
          console.log("imp data is ", data);
          setFence(data);
        });

    }
  }, []);

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
  // function handleChangeLong({ target }) {
  //   console.log("geoFenceData  ",fence.geoFenceData);
  //   fence.geoFenceData.longitude=target.value;
  //   setFence({
  //     ...fence,
  //     "geoFenceData": fence.geoFenceData,
  //   });
  // }
  

  function formIsValid() {
    const _errors = {};

    if (!fence.schoolName)
      _errors.schoolName = "University name is required.";
    if (!fence.longitude) _errors.longitude = "Longitude is required";
    if (!fence.latitude) _errors.latitude = "Latitude is required.";
    if (!fence.radiusInMeter) _errors.radiusInMeter = "Radius is required.";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    fence.longitude = parseFloat(fence.longitude);
    fence.latitude = parseFloat(fence.latitude);
    fence.radiusInMeter = parseFloat(fence.radiusInMeter);
    fence.username = localStorage.getItem("user");
    fence.geoFenceData = {
      "longitude":fence.longitude,
      "latitude":fence.latitude,
      "radiusInMeter":fence.radiusInMeter
    }
    fenceApi.updateFence(fence).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/schools");
        toast.success("Fence updated");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{padding: '10px'}}>
        <h2>Manage School</h2>
        <ManageSchoolForm
          errors={errors}
          fence={fence}
          onChangeHoliday={handleHolidayChange}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ManageSchoolPage;