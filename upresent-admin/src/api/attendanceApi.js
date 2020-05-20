import { handleResponse, handleError } from "./apiUtils";
import { baseUrlModuleApi } from "../config/config";

const baseUrl = baseUrlModuleApi;

export function revokeAttendance(attendanceId) {
  return fetch("http://localhost:5000/api/attendance" + "/" + attendanceId, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "Username": localStorage.getItem("user")
    },
  })
    .then(handleResponse)
    .catch(handleError);
}