import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlAttendanceApi, baseUrlAttendanceHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function saveAttendance(attendance) {
  const baseUrl = getBaseUrlAttendanceApi();
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

async function getBaseUrlAttendanceApi() {
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          return baseUrlAttendanceHexApi;
        } else {
          return baseUrlAttendanceApi;
        }
      }
    }
  });
}
