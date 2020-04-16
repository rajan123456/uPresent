import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import ReportsForm from "./ReportsForm";
import moment from "moment";
import { getModules } from "../../api/moduleApi";

function ReportsPage() {
  const [errors, setErrors] = useState({});
  const [modules, setModules] = useState([]);
  const [report, setReport] = useState({
    moduleCode: "",
    startDate: moment(new Date()).format("MM/DD/YYYY"),
    endDate: moment(new Date()).format("MM/DD/YYYY"),
  });

  useEffect(() => {
    getModules().then((_modules) =>
      setModules(_modules.data.map((a) => a.moduleCode))
    );
  }, []);

  function handleChange({ target }) {
    setReport({
      ...report,
      [target.name]: target.value,
    });
  }

  function handleDateChangeStartDate(date) {
    setReport({
      ...report,
      // eslint-disable-next-line
      ["startDate"]: moment(date).format("MM/DD/YYYY"),
    });
  }

  function handleDateChangeEndDate(date) {
    setReport({
      ...report,
      // eslint-disable-next-line
      ["endDate"]: moment(date).format("MM/DD/YYYY"),
    });
  }

  function formIsValid() {
    const _errors = {};

    // if (!module.moduleCode) _errors.moduleCode = "Code is required.";
    // if (module.scheduledDays.length === 0)
    //   _errors.scheduledDays = "Schedule cannot be empty.";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit() {
    formIsValid();
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Reports</h2>
        <ReportsForm
          report={report}
          errors={errors}
          modules={modules}
          onChangeSelector={handleChange}
          onStartDateChange={handleDateChangeStartDate}
          onEndDateChange={handleDateChangeEndDate}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ReportsPage;
