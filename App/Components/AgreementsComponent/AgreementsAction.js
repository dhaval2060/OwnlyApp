import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.AGREEMENTS_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


export const updateAgreementList = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_AGREEMENT_LIST,
    payload: text
  };
};
