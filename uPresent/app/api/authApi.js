import {baseUrlAuthApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function loginUser(user) {
  return fetch(baseUrlAuthApi, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then(handleResponse)
    .catch(handleError);
}
