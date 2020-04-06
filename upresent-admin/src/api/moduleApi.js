import { handleResponse, handleError } from "./apiUtils";
import { baseUrlModuleApi } from "../config/config";

const baseUrl = baseUrlModuleApi;

export function getModules() {
  return fetch(baseUrl + "/all", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

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

export function saveModule(module) {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(module),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function updateModule(module) {
  return fetch(baseUrl, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(module),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function deleteModule(moduleCode) {
  return fetch(baseUrl + "?moduleCode=" + moduleCode, {
    method: "DELETE",
    headers: {
      "content-type": "application-json",
      // prettier-ignore
      "Username": localStorage.getItem("user")
    },
  })
    .then(handleResponse)
    .catch(handleError);
}
