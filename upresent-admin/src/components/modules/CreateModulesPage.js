import React, { useState } from "react";
import CreateModuleForm from "./CreateModuleForm";
import Header from "../common/Header";
import * as moduleApi from "../../api/moduleApi";
import { toast } from "react-toastify";
import { daysOfWeek } from "../../utils/constants";
import moment from "moment";

const CreateModulesPage = (props) => {
  const [errors, setErrors] = useState({});

  const [module, setModule] = useState({
    createdBy: "",
    startDate: moment(new Date()).format("MM/DD/YYYY"),
    endDate: moment(new Date()).format("MM/DD/YYYY"),
    moduleCode: "",
    moduleName: "",
    scheduledDays: [],
    studentUsernames: [],
  });

  function handleChange({ target }) {
    setModule({
      ...module,
      [target.name]: target.value,
    });
  }

  function handleChangeSelector(event) {
    var options = event.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setModule({
      ...module,
      [event.target.name]: value,
    });
  }

  function handleDateChangeStartDate(date) {
    setModule({
      ...module,
      // eslint-disable-next-line
      ["startDate"]: moment(date).format("MM/DD/YYYY"),
    });
  }

  function handleDateChangeEndDate(date) {
    setModule({
      ...module,
      // eslint-disable-next-line
      ["endDate"]: moment(date).format("MM/DD/YYYY"),
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!module.moduleCode) _errors.moduleCode = "Code is required.";
    if (module.scheduledDays.length === 0)
      _errors.scheduledDays = "Schedule cannot be empty.";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    module.createdBy = localStorage.getItem("user");
    moduleApi.saveModule(module).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/modules");
        toast.success("Module saved");
      } else toast.warn("Something went wrong, please try again later.");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Add Module</h2>
        <CreateModuleForm
          errors={errors}
          module={module}
          onChange={handleChange}
          onChangeSelector={handleChangeSelector}
          onStartDateChange={handleDateChangeStartDate}
          onEndDateChange={handleDateChangeEndDate}
          onSubmit={handleSubmit}
          daysOfWeek={daysOfWeek}
        />
      </div>
    </div>
  );
};

export default CreateModulesPage;
