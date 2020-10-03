import ACTION_TYPES from '../../Action/ActionsType';

// Email Or Username TextField Value Change
export const forgotEmailChanged = (text) => {
  return {
    type: ACTION_TYPES.FORGOT_PASS_EMAIL_CHANGED,
    payload: text
  };
};

export function showLoading() {
  return {
    type: ACTION_TYPES.FORGOT_PASS_FETCHING_DATA
  }
}
export function resetState() {
  return {
    type: ACTION_TYPES.FORGOT_PASS_RESET_DATA
  }
}


 