import AsyncStorage from '@react-native-community/async-storage';
import {baseUrlAuthApi, baseUrlAuthHexApi} from '../config/config';
import {handleResponse, handleError} from './apiUtils';

export async function loginUser(user) {
  const baseUrl = await getBaseUrlAuthApi();
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
  let baseUrl = '';
  await AsyncStorage.getItem('hexagonEnvironment', (errs, result) => {
    if (!errs) {
      if (result !== null) {
        if (result === 'true') {
          baseUrl = baseUrlAuthHexApi;
        } else {
          baseUrl = baseUrlAuthApi;
        }
      }
    }
  });
  return baseUrl;
}
