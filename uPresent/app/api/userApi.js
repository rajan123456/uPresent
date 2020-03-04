import {baseUrlUserApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function saveUser(user) {
  return fetch(baseUrlUserApi, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getUserByName(username) {
  return fetch(baseUrlUserApi, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}
