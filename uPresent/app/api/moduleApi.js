import AsyncStorage from '@react-native-community/async-storage';
import {handleResponse, handleError} from './apiUtils';
import {baseUrlModuleApi, baseUrlModuleHexApi} from '../config/config';

export function getModulesOfUser(username) {
  const baseUrl = getBaseUrlModuleApi();
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
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          return baseUrlModuleHexApi;
        } else {
          return baseUrlModuleApi;
        }
      }
    }
  });
}
