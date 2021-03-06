import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.USER_PROFILE_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const addResponse = (text) => {
  return {
    type: ACTION_TYPES.ADD_RESPONSE_RES,
    payload: text
  }
};