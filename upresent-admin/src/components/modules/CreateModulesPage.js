import React, { useEffect, useState } from "react";
import CreateModuleForm from "./CreateModuleForm";
import Header from "../common/Header";
import * as moduleApi from "../../api/moduleApi";
import { getUsersOfType } from "../../api/userApi";
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
    endTime: new Date(),
    startTime: new Date(),
    scheduledDays: [],
    studentUsernames: [],
    schedule: []
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    getUsersOfType("STUDENT").then((_students) => {
      let activeUsers = [];
      _students.data.forEach((element) => {
        if (element.isActive === 1) activeUsers.push(element);
      });
      setStudents(activeUsers.map((a) => a.username).sort());
    });
  }, []);

  function handleChange({ target }) {
    console.log("target value ", target);
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

  function handleDateChangeEndTime(time) {
    setModule({
      ...module,
      // eslint-disable-next-line
      ["endTime"]: time
    });
  }

  function handleDateChangeStartTime(time) {
    setModule({
      ...module,
      // eslint-disable-next-line
      ["startTime"]: time
    });
  }

  function getDates() {
    var currentDate = new Date(module.startDate);
    var stopDate = new Date(module.endDate);
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var schedule = [];
    while (currentDate <= stopDate) {
      if (module.scheduledDays.includes(days[currentDate.getDay()])) {
        var temp = {
          "createdBy": module.createdBy,
          "date": moment(currentDate).format("MM/DD/YYYY"),
          "endTime": moment(module.endTime).format("HH:mm"),
          "startTime": moment(module.startTime).format("HH:mm")
        }
        schedule.push(temp);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setModule({
      ...module,
      // eslint-disable-next-line
      [schedule]: schedule,
    });
    module.schedule = schedule;
    console.log("schedule var ",schedule);
    console.log("module schedule var ",module.schedule);
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
    getDates();
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
      <div className="main" style={{padding: '10px', width:'30%'}}>
        <h2>Add Module</h2>
        <CreateModuleForm
          errors={errors}
          module={module}
          onChange={handleChange}
          onChangeSelector={handleChangeSelector}
          onStartDateChange={handleDateChangeStartDate}
          onEndDateChange={handleDateChangeEndDate}
          onSubmit={handleSubmit}
          onStartTimeChange={handleDateChangeStartTime}
          onEndTimeChange={handleDateChangeEndTime}
          daysOfWeek={daysOfWeek}
          availableStudents={students}
        />
      </div>
    </div>
  );
};

export default CreateModulesPage;
