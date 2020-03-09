import { handleResponse, handleError } from "./apiUtils";
import { baseUrlUserApi, partnerUserRoles } from "../config/config";

const baseUrl = baseUrlUserApi;

export function getUsers() {
  return fetch(baseUrl, {
    method: "GET",
    headers: {
      "content-type": "application/json"
    }
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getUserById(user_id) {
  return fetch(baseUrl + user_id, {
    method: "GET",
    headers: {
      "content-type": "application/json"
    }
  })
    .then(handleResponse)
    .catch(handleError);
}

export default function getUserRoles() {
  return fetch(baseUrl + "roles", {
    method: "GET",
    headers: {
      "content-type": "application/json"
    }
  })
    .then(handleResponse)
    .catch(handleError);
}

export function saveUser(user) {
  if (!user.id) {
    return fetch(baseUrl + "create", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(handleResponse)
      .catch(handleError);
  } else {
    return fetch(baseUrl + user.id, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(handleResponse)
      .catch(handleError);
  }
}

export function loginUser(email, user_password) {
  if (email === "" || user_password === "") return;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, user_password })
  };

  return fetch(baseUrl + "login", requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

export function getUsersInRoles() {
  return fetch(baseUrl + "role", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ user_roles: partnerUserRoles })
  })
    .then(handleResponse)
    .catch(handleError);
}
