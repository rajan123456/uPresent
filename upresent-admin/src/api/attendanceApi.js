import { handleResponse, handleError } from "./apiUtils";
import { baseUrlModuleApi } from "../config/config";

const baseUrl = baseUrlModuleApi;

export function getModuleByModuleCode(moduleCode) {
  return fetch(baseUrl + "?moduleCode=" + moduleCode, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then(handleResponse)
    .catch(handleError);
}