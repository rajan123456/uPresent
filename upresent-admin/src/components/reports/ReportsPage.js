import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import ReportsForm from "./ReportsForm";
import moment from "moment";
import { getModules } from "../../api/moduleApi";
import { getAttendanceReport } from "../../api/reportingApi";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function ReportsPage() {
  const [errors] = useState({});
  const [modules, setModules] = useState([]);
  const [reportData, setReportData] = useState({});
  const [report, setReport] = useState({
    moduleCode: "",
    startDate: moment(new Date()).format("MM/DD/YYYY"),
    endDate: moment(new Date()).format("MM/DD/YYYY"),
  });

  useEffect(() => {
    getModules().then((_modules) => {
      setModules(_modules.data.map((a) => a.moduleCode));
      setReport({
        ...report,
        // eslint-disable-next-line
        ["moduleCode"]: _modules.data.map((a) => a.moduleCode)[0],
      });
    });
    // eslint-disable-next-line
  }, []);

  function handleChange({ target }) {
    setReport({
      ...report,
      // eslint-disable-next-line
      ["moduleCode"]: target.value,
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
        setReportData(_resp.data);
      } else toast.warn("Something went wrong, please try again later.");
    });
  }

  const classes = useStyles();

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
        <hr />
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="Attendance Report"
          >
            <TableHead>
              {reportData.dates &&
                reportData.dates.map((date) => (
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell align="right">{date}</TableCell>
                  </TableRow>
                ))}
            </TableHead>
            <TableBody>
              {reportData.dates &&
                reportData.dates.map((date) => (
                  <TableRow key={date}>
                    <TableCell component="th" scope="row">
                      {date}
                    </TableCell>
                    <TableCell align="right">{date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ReportsPage;
