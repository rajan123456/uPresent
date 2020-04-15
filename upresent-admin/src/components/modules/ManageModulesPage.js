import React, { useState, useEffect } from "react";
import ManageModuleForm from "./ManageModuleForm";
import Header from "../common/Header";
import * as moduleApi from "../../api/moduleApi";
import { getUsersOfType } from "../../api/userApi";
import { toast } from "react-toastify";
import { daysOfWeek } from "../../utils/constants";
import moment from "moment";

const ManageModulesPage = (props) => {
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

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const moduleCode = props.match.params.moduleCode;
    if (moduleCode) {
      moduleApi.getModuleByModuleCode(moduleCode).then((_module) => {
        setModule(_module.data);
      });
    }
    getUsersOfType("STUDENT").then((_students) =>
      setStudents(_students.data.map((a) => a.username).sort())
    );
  }, [props.match.params.moduleCode]);

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
    moduleApi.updateModule(module).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/modules");
        toast.success("Module updated");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  function handleDelete(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    moduleApi.deleteModule(module.moduleCode).then((_resp) => {
      if (_resp.message === "ok") {
        props.history.push("/modules");
        toast.success("Module deleted");
      } else toast.warn("There was an error. Please try again later.");
    });
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Manage Module</h2>
        <ManageModuleForm
          errors={errors}
          module={module}
          daysOfWeek={daysOfWeek}
          availableStudents={students}
          onChange={handleChange}
          onChangeSelector={handleChangeSelector}
          onStartDateChange={handleDateChangeStartDate}
          onEndDateChange={handleDateChangeEndDate}
          onSubmit={handleSubmit}
          onReset={handleDelete}
        />
      </div>
    </div>
  );
};

export default ManageModulesPage;
