import {baseUrlFileApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function saveFile(file) {
  return fetch(baseUrlFileApi, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}
