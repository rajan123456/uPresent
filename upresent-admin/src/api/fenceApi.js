import { handleResponse, handleError } from "./apiUtils";
import { baseUrlFenceApi } from "../config/config";

const baseUrl = baseUrlFenceApi;

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
  return fetch(baseUrl + "?universityName=" + universityName, {
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
