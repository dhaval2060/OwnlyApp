import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.NOTICE_BOARD_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


// post name TextField Value Change
export const noticeNameChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_NAME_CHANGED,
    payload: text
  };
};


//post Description TextField Value Change
export const noticeDescriptionChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_DESCRIPTION_CHANGED,
    payload: text
  };
};

export const getAdminStatastics = (text) => {
  return {
    type: ACTION_TYPES.GET_ADMIN_STATASTICS,
    payload: text
  };
};
