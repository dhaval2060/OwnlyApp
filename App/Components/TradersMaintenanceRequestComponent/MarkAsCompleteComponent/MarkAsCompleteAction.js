import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.MARK_AS_COMPLETE_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


 