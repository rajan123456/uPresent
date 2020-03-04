export async function handleResponse(response) {
  if (response.ok && response.status === 200) {
    return response.json();
  } else if (response.status === 400) {
    console.log('Resource may already exist');
  } else {
    console.log(response);
  }
}

export function handleError(error) {
  console.error('API call failed. ' + error);
  console.log('Something went wrong');
  throw error;
}
