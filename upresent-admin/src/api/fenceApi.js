import { handleResponse, handleError } from "./apiUtils";
import { baseUrlSchoolApi } from "../config/config";

const baseUrl = baseUrlSchoolApi;

export function getAllFences() {
  return fetch(baseUrl + "/all", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getFenceByUniversityName(universityName) {
  return fetch(baseUrl + "?schoolCode=" + universityName, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

export function saveFence(fence) {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(fence),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function updateFence(fence) {
  return fetch(baseUrl, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(fence),
  })
    .then(handleResponse)
    .catch(handleError);
}
