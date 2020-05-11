import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlUserApi, baseUrlUserHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function saveUser(user) {
  const baseUrl = getBaseUrlUserApi();
  return fetch(baseUrl, {
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
  const baseUrl = getBaseUrlUserApi();
  return fetch(baseUrl + '?username=' + username, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

async function getBaseUrlUserApi() {
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          return baseUrlUserHexApi;
        } else {
          return baseUrlUserApi;
        }
      }
    }
  });
}
