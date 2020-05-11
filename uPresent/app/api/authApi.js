import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlAuthApi, baseUrlAuthHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export function loginUser(user) {
  const baseUrl = getBaseUrlAuthApi();
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

async function getBaseUrlAuthApi() {
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          return baseUrlAuthHexApi;
        } else {
          return baseUrlAuthApi;
        }
      }
    }
  });
}
