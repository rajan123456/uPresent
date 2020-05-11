import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlFileApi, baseUrlFileHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function saveFile(file) {
  const baseUrl = getBaseUrlFileApi();
  return fetch(baseUrl, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(handleResponse)
    .catch(handleError);
}

async function getBaseUrlFileApi() {
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          return baseUrlFileHexApi;
        } else {
          return baseUrlFileApi;
        }
      }
    }
  });
}
