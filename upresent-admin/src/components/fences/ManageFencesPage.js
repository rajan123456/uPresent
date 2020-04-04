import React, { useState, useEffect } from "react";
import ManageFenceForm from "./ManageFenceForm";
import Header from "../common/Header";
import * as fenceApi from "../../api/fenceApi";
import { toast } from "react-toastify";

const ManageFencesPage = (props) => {
  const [errors, setErrors] = useState({});

  const [fence, setFence] = useState({
    universityName: "",
    longitude: "",
    latitude: "",
    radius: "",
  });

  useEffect(() => {
    const universityName = props.match.params.universityName;
    if (universityName) {
      fenceApi
        .getFenceByUniversityName(universityName)
        .then((_fence) => setUser(_fence.data));
    }
  }, [props.match.params.universityName]);

  function handleChange({ target }) {
    setFence({
      ...fence,
      [target.name]: target.value,
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!fence.universityName)
      _errors.universityName = "University name is required.";
    if (!fence.longitude) _errors.longitude = "Longitude is required";
    if (!fence.latitude) _errors.latitude = "Latitude is required.";
    if (!fence.radius) _errors.radius = "Radius is required.";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    fenceApi.saveFence(fence).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/fences");
        toast.success("Fence updated");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Manage Geo-Fence</h2>
        <ManageFenceForm
          errors={errors}
          user={user}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ManageFencesPage;
