import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.AGENT_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const updateAgentList = (text) => {

  return {
    type: ACTION_TYPES.UPDATE_AGENT_LIST,
    payload: text
  };
  
};


