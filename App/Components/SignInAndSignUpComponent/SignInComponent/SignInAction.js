import ACTION_TYPES from '../../../Action/ActionsType';

// Email Or Username TextField Value Change
export const loginUserNameChanged = (text) => {
  return {
    type: ACTION_TYPES.USER_NAME_CHANGED,
    payload: text
  };
};

// Password TextField Value Change
export const loginPasswordChanged = (text) => {
  return {
    type: ACTION_TYPES.PASSWORD_CHANGED,
    payload: text
  }
};

export function showLoading() {
  return {
    type: ACTION_TYPES.FETCHING_DATA
  }
}
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export function clearResponse() {
  return {
    type: ACTION_TYPES.LOGIN_USER_RES_CLEAR
  }
}



 