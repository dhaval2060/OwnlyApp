import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.CHANGE_PASSWORD_LOADER
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_CHANGE_PASSWORD_DATA
  }
}

// current password Change
export const currentPasswordChanged = (text) => {
  return {
    type: ACTION_TYPES.CHANGE_CURRENT_PASSWORD,
    payload: text
  }
};

// new password Change
export const newPasswordChanged = (text) => {
  return {
    type: ACTION_TYPES.CHANGE_NEW_PASSWORD,
    payload: text
  }
};

export function clearResponse() {
  return {
    type: ACTION_TYPES.CHANGE_PASSWORD_CLEAR_RES
  }
}

