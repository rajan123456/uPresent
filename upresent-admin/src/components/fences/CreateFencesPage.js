import React, { useState } from "react";
import CreateFenceForm from "./CreateFenceForm";
import Header from "../common/Header";
import * as fenceApi from "../../api/fenceApi";
import { toast } from "react-toastify";

const CreateFencesPage = (props) => {
  const [errors, setErrors] = useState({});

  const [fence, setFence] = useState({
    universityName: "",
    longitude: "",
    latitude: "",
    radius: "",
  });

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
    fenceApi.saveFence(fence).then(() => {
      props.history.push("/fences");
      toast.success("Fence saved");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Add Geo-Fence</h2>
        <CreateFenceForm
          errors={errors}
          fence={fence}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateFencesPage;
