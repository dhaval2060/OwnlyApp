import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.COUNTER_PROPOSAL_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const clearCounterProposalRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_COUNTER_PROPOSAL_RES,
    payload: ''
  };
};
 