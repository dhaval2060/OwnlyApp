import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.LOADING_ADD_POST
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


// post title Change
export const postTitleChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_TITLE_CHANGED,
    payload: text
  }
};

// post agenda Change
export const postAgendaChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_AGENDA_CHANGED,
    payload: text
  }
};

// post description Change
export const postDescriptionChanged = (text) => {
  return {
    type: ACTION_TYPES.POST_DESCRIPTION_CHANGED,
    payload: text
  }
};