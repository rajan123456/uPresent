import { handleResponse, handleError } from "./apiUtils";
import { baseUrlAttendanceApi } from "../config/config";

const baseUrl = baseUrlAttendanceApi;

export function revokeAttendance(attendanceId) {
  return fetch(baseUrl + "/" + attendanceId, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "Username": localStorage.getItem("user")
    },
  })
    .then(handleResponse)
    .catch(handleError);
}