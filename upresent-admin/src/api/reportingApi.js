import { baseUrlReportingApi } from "../config/config";
import { handleResponse, handleError } from "./apiUtils";

const baseUrl = baseUrlReportingApi;

export function getAttendanceReport(startDate, endDate, moduleCode) {
  return fetch(
    baseUrl +
      "?startDate=" +
      startDate +
      "&endDate=" +
      endDate +
      "&moduleCode=" +
      moduleCode,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  )
    .then(handleResponse)
    .catch(handleError);
}
