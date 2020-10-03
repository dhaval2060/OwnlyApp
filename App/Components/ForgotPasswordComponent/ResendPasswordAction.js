import ACTION_TYPES from '../../Action/ActionsType';

export function showLoading() {
  return {
    type: ACTION_TYPES.RESEND_PASS_FETCHING_DATA
  }
}
export function resetState() {
  return {
    type: ACTION_TYPES.RESEND_PASS_RESET_DATA
  }
}


 