import AsyncStorage from '@react-native-community/async-storage';
import {handleResponse, handleError} from './apiUtils';
import {baseUrlSchoolApi, baseUrlSchoolHexApi} from '../config/config';

export async function getAllSchools() {
  const baseUrl = await getBaseUrlSchoolApi();
  return fetch(baseUrl + '/all', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

async function getBaseUrlSchoolApi() {
  let baseUrl = '';
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          baseUrl = baseUrlSchoolHexApi;
        } else {
          baseUrl = baseUrlSchoolApi;
        }
      }
    }
  });
  return baseUrl;
}
