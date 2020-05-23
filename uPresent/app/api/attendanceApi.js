import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlAttendanceApi, baseUrlAttendanceHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export async function saveAttendance(attendance) {
  const baseUrl = await getBaseUrlAttendanceApi();
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(attendance),
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function getAttendanceRecordsOfUser(username) {
  const baseUrl = await getBaseUrlAttendanceApi();
  return fetch(baseUrl + '/' + username, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

async function getBaseUrlAttendanceApi() {
  let baseUrl = '';
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          baseUrl = baseUrlAttendanceHexApi;
        } else {
          baseUrl = baseUrlAttendanceApi;
        }
      }
    }
  });
  return baseUrl;
}
