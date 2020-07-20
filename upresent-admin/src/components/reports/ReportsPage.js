import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import Header from "../common/Header";
import ReportsForm from "./ReportsForm";
import { getModules, getModuleByModuleCode } from "../../api/moduleApi";
import { revokeAttendance } from "../../api/attendanceApi";
import { getAttendanceReport } from "../../api/reportingApi";
import { baseUrlFileApi } from "../../config/config";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function ReportsPage() {
  const [errors] = useState({});
  const [modules, setModules] = useState([]);
  const [reportData, setReportData] = useState({});
  const [attendanceInfoData, setAttendanceInfoData] = useState({});

  const [report, setReport] = useState({
    moduleCode: "",
    startDate: moment(new Date()).format("MM/DD/YYYY"),
    endDate: moment(new Date()).format("MM/DD/YYYY"),
  });
  const [attendance, setAttendance] = useState([]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    await getAttendanceReport(
      report.startDate,
      report.endDate,
      report.moduleCode
    ).then(async (_resp) => {
      if (_resp.message === "ok") {
        setReportData(_resp.data);

        var attendanceInfo = _resp.data.attendanceInfo;
        var fr = {};
        var result = {};
        for (var key in attendanceInfo) {
          result = attendanceInfo[key].reduce(function (map, obj) {
            map[key + obj.studentUsername] = {
              studentUsername: obj.studentUsername,
              attendance: obj.attendance,
              capturedImageId: obj.capturedImageId,
              recognitionConfidence: obj.recognitionConfidence,
              timestamp: obj.timestamp,
              recognitionSource: obj.recognitionSource,
              adminUsername: obj.adminUsername,
              attendanceId: obj.attendanceId,
            };
            return map;
          }, {});
          fr = {
            ...fr,
            ...result,
          };
        }
        setAttendanceInfoData(fr);

        await getModuleByModuleCode(report.moduleCode).then((_respMod) => {
          transformReportDataToAttendance(
            _resp.data,
            _respMod.data.studentUsernames
          );
        });
      } else toast.warn("Something went wrong, please try again later.");
    });
  }

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

  function transformReportDataToAttendance(data, studentNames) {
    if (!data.attendanceInfo) return;
    let studentDetails = [];
    studentNames.forEach((element) => {
      let rec = { key: element, status: [] };
      studentDetails.push(rec);
    });
    data.dates.forEach((date) => {
      Object.keys(data.attendanceInfo).forEach(function (keyIden) {
        if (date === keyIden) {
          studentDetails.forEach((student) => {
            data.attendanceInfo[keyIden].forEach((studRec) => {
              if (student.key === studRec.studentUsername) {
                student.status.push(studRec.attendance);
              }
            });
          });
        }
      });
    });
    setAttendance(studentDetails);
  }

  function revoke(attendanceInfo, key) {
    revokeAttendance(attendanceInfo[key].attendanceId).then((res) => {
      var fr = attendanceInfoData;
      fr[key].attendance = "REVOKED";
      setAttendanceInfoData(fr);
    });
  }

  const classes = useStyles();

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{ padding: "10px" }}>
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
        <Grid container spacing={Number(2)}>
          {reportData.dates ? (
            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                className="table table-bordered"
              >
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="Attendance Report"
                >
                  <TableHead>
                    <TableRow key="header">
                      {reportData.dates ? (
                        <TableCell>Student/Date</TableCell>
                      ) : (
                        <TableCell />
                      )}
                      {reportData.dates &&
                        reportData.dates.map((date) => (
                          <TableCell align="right">{date}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance &&
                      attendance.map((record) => (
                        <TableRow key={record.key}>
                          <TableCell component="th" scope="row">
                            {record.key}
                          </TableCell>
                          {reportData.dates &&
                            reportData.dates.map((date) => (
                              <TableCell align="right">
                                <div>
                                  <table className="table table-bordered">
                                    <tr>
                                      <th>Image</th>
                                      <th>Confidence</th>
                                      <th>Timestamp</th>
                                      <th>Source</th>
                                      <th>Status</th>
                                      <th>Revoke</th>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img
                                          style={{ width: "100px" }}
                                          src={
                                            baseUrlFileApi +
                                            "?filename=" +
                                            attendanceInfoData[
                                              date + record.key
                                            ].capturedImageId
                                          }
                                          alt={
                                            attendanceInfoData[
                                              date + record.key
                                            ].capturedImageId
                                          }
                                        ></img>
                                      </td>
                                      <td>
                                        {
                                          attendanceInfoData[date + record.key]
                                            .recognitionConfidence
                                        }
                                      </td>
                                      <td>
                                        {
                                          attendanceInfoData[date + record.key]
                                            .timestamp
                                        }
                                      </td>
                                      <td>
                                        {
                                          attendanceInfoData[date + record.key]
                                            .recognitionSource
                                        }
                                      </td>
                                      <td>
                                        {
                                          attendanceInfoData[date + record.key]
                                            .attendance
                                        }
                                      </td>
                                      {attendanceInfoData[date + record.key]
                                        .attendance === "REVOKED" ? (
                                        <td>
                                          Revoked by{" "}
                                          {
                                            attendanceInfoData[
                                              date + record.key
                                            ].adminUsername
                                          }
                                        </td>
                                      ) : attendanceInfoData[date + record.key]
                                          .attendance === "ABSENT" ? (
                                        <td>Student is ABSENT</td>
                                      ) : (
                                        <td>
                                          <Button
                                            type="submit"
                                            onClick={() =>
                                              revoke(
                                                attendanceInfoData,
                                                date + record.key
                                              )
                                            }
                                            variant="contained"
                                            color="primary"
                                          >
                                            Revoke
                                          </Button>
                                        </td>
                                      )}
                                    </tr>
                                  </table>
                                </div>
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            <Button />
          )}
          {reportData.dates ? (
            <Grid item xs={12}>
              <Button type="submit" />
            </Grid>
          ) : (
            <Button />
          )}
        </Grid>
      </div>
    </div>
  );
}

export default ReportsPage;
