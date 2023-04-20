const URL_STRING = process.env.REACT_APP_URL_STRING;

const headers = {
  'Content-type': 'application/json',
}

export const GET_LOGIN = async (username, password) => {
    const response = await fetch(`${URL_STRING}/api/auth/login`, {
        headers,
        method: 'POST',
        body: JSON.stringify({username, password}),
      }
    );
    const data = await response.json();
    return data;
};

// export const GET_PROFILE =  (success, error) => async (dispatch) => {
//   try {
//     const response = await  fetch(`${URL_STRING}/api/admin/profile`, {
//       method : "GET",
//       headers
//     })
  
//     const json = await response.json()
//     success(json)
//     dispatch({type : ACTIONS.GET_PROFILE, payload : json})
//   } catch (e) {
//       error(e)
//   }
// }