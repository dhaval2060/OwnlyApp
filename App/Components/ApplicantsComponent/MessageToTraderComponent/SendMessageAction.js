import ACTION_TYPES from '../../../Action/ActionsType';

// Email Or Username TextField Value Change
export const sendMessageTextChange = (text) => {
  return {
    type: ACTION_TYPES.SEND_MESSAGE_TEXT_CHANGE,
    payload: text
  };
};

export function showLoading() {
  return {
    type: ACTION_TYPES.SEND_MESSAGE_LOADING
  }
}
export function resetState() {
  return {
    type: ACTION_TYPES.SEND_MESSAGE_RESET_DATA
  }
}


 