import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlUserApi, baseUrlUserHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export async function saveUser(user) {
  const baseUrl = await getBaseUrlUserApi();
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

export async function getUserByName(username) {
  const baseUrl = await getBaseUrlUserApi();
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
  let baseUrl = '';
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          baseUrl = baseUrlUserHexApi;
        } else {
          baseUrl = baseUrlUserApi;
        }
      }
    }
  });
  return baseUrl;
}
