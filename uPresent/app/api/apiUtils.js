export async function handleResponse(response) {
  if (response.ok && response.status === 200) {
    return response.json();
  } else if (response.status === 400 || response.status === 500) {
    console.log('Bad response: ' + response);
    return response.json();
  } else {
    console.log(response);
  }
}

export function handleError(error) {
  console.error('API call failed. ' + error);
  console.log('Something went wrong');
  throw error;
}
