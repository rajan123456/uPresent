import {baseUrlAttendanceApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function saveAttendance(attendance) {
  return fetch(baseUrlAttendanceApi, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(attendance),
  })
    .then(handleResponse)
    .catch(handleError);
}
