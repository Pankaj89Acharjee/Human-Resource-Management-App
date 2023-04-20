export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === 'HASHCASHEMPLOYEE') {
    return action.payload;
  }
  if (action.type === 'CLEAREMPLOYEE') {
    return null;
  }
  if (action.type === 'HASHCASHADMIN') {
    return action.payload;
  }
  if (action.type === 'CLEARADMIN') {
    return null;
  }
  if (action.type === 'HASHCASHACCOUNTS') {
    return action.payload;
  }
  if (action.type === 'CLEARACCOUNTS') {
    return null;
  }
  if (action.type === 'HASHCASHFACILITYADMIN') {
    return action.payload;
  }
  if (action.type === 'CLEARFACILITYADMIN') {
    return null;
  }
  return state;
};