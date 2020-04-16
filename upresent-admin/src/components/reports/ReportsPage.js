import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import ReportsForm from "./ReportsForm";
import moment from "moment";
import { getModules } from "../../api/moduleApi";
import { getAttendanceReport } from "../../api/reportingApi";
import { toast } from "react-toastify";

function ReportsPage() {
  const [errors] = useState({});
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

  function handleSubmit(event) {
    event.preventDefault();
    getAttendanceReport(
      report.startDate,
      report.endDate,
      report.moduleCode
    ).then((_resp) => {
      if (_resp.message === "ok") {
        toast.success("I got the data!");
      } else toast.warn("Something went wrong, please try again later.");
    });
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
