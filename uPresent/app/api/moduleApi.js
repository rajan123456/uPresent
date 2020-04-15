import {handleResponse, handleError} from './apiUtils';
import {baseUrlModuleApi} from '../config/config';

const baseUrl = baseUrlModuleApi;

export function getModulesOfUser(username) {
  return fetch(baseUrl + '?username=' + username, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}
