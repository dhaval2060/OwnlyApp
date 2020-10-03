import ACTION_TYPES from '../../Action/ActionsType';


// Logout 
export const logout = (text) => {
  return {
    type: ACTION_TYPES.USER_LOGOUT,
    payload: text
  }
};

export function showLoading() {
  return {
    type: ACTION_TYPES.LOGOUT_FETCHING_DATA
  }
}
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


