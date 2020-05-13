import AsyncStorage from '@react-native-community/async-storage';
import {handleResponse, handleError} from './apiUtils';
import {baseUrlModuleApi, baseUrlModuleHexApi} from '../config/config';

export async function getModulesOfUser(username) {
  const baseUrl = await getBaseUrlModuleApi();
  return fetch(baseUrl + '?username=' + username, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

async function getBaseUrlModuleApi() {
  let baseUrl = '';
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          baseUrl = baseUrlModuleHexApi;
        } else {
          baseUrl = baseUrlModuleApi;
        }
      }
    }
  });
  return baseUrl;
}
