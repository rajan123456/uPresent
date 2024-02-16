import React, { useState, useEffect } from "react";
import ManageModuleForm from "./ManageModuleForm";
import Header from "../common/Header";
import * as moduleApi from "../../api/moduleApi";
import { getUsersOfType } from "../../api/userApi";
import { toast } from "react-toastify";
import { daysOfWeek } from "../../utils/constants";
import moment from "moment";
import { getFenceByUniversityName } from "../../api/fenceApi";

const ManageModulesPage = (props) => {
  const [errors, setErrors] = useState({});
  const [holidayOverlap, setHolidayOverlap] = useState([]);

  const [module, setModule] = useState({
    createdBy: "",
    startDate: moment(new Date()).format("MM/DD/YYYY"),
    endDate: moment(new Date()).format("MM/DD/YYYY"),
    moduleCode: "",
    moduleName: "",
    schoolCode: "",
    endTime: new Date(),
    startTime: new Date(),
    scheduledDays: [],
    studentUsernames: [],
    schedule: [],
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const moduleCode = props.match.params.moduleCode;
    if (moduleCode) {
      moduleApi.getModuleByModuleCode(moduleCode).then((_module) => {
        setModule(_module.data);
        getFenceByUniversityName(_module.data.schoolCode).then((_fences) => {
          var overlap = [];
          if (_fences.data.holiday !== null) {
            // eslint-disable-next-line
            _fences.data.holidays.map(function (holiday) {
              // eslint-disable-next-line
              _module.data.schedule.map(function (day) {
                if (day.date === moment(holiday).format("MM/DD/YYYY")) {
                  overlap.push(day.date);
                }
              });
            });
          }
          setHolidayOverlap(overlap);
        });
      });
    }
    getUsersOfType("STUDENT").then((_students) => {
      let activeUsers = [];
      _students.data.forEach((element) => {
        if (element.isActive === 1) activeUsers.push(element);
      });
      setStudents(activeUsers.map((a) => a.username).sort());
    });
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

  function handleScheduleDate(scDays, value, index) {
    scDays[index].date = value;
    setModule({
      ...module,
      // eslint-disable-next-line
      ["scheduledDays"]: scDays,
    });
  }

  function handleScheduleStartTime(scDays, value, index) {
    scDays[index].startTime = value;
    setModule({
      ...module,
      // eslint-disable-next-line
      ["scheduledDays"]: scDays,
    });
  }

  function handleDeleteSchedule(scDays, index) {
    scDays.splice(index, 1);
    setModule({
      ...module,
      // eslint-disable-next-line
      ["scheduledDays"]: scDays,
    });
  }

  function handleScheduleEndTime(scDays, value, index) {
    scDays[index].endTime = value;
    setModule({
      ...module,
      // eslint-disable-next-line
      ["scheduledDays"]: scDays,
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
      <div className="main" style={{ padding: "10px", width: "30%" }}>
        <h2>Manage Module</h2>
        <ManageModuleForm
          errors={errors}
          module={module}
          holidayOverlap={holidayOverlap}
          daysOfWeek={daysOfWeek}
          availableStudents={students}
          onChange={handleChange}
          onChangeSelector={handleChangeSelector}
          onStartDateChange={handleDateChangeStartDate}
          onEndDateChange={handleDateChangeEndDate}
          updateDate={handleScheduleDate}
          deleteSchedule={handleDeleteSchedule}
          updateEndTime={handleScheduleEndTime}
          updateStartTime={handleScheduleStartTime}
          onSubmit={handleSubmit}
          onReset={handleDelete}
        />
      </div>
    </div>
  );
};

export default ManageModulesPage;
