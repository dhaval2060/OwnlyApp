import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.ADD_AGENCY_AGENT_LOADING
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const agencyAgentFirstNameChanged = (text) => {
  return {
    type: ACTION_TYPES.AGENCY_AGENT_FIRSTNAME_CHANGED,
    payload: text
  };
};
export const agencyAgentLastNameChanged = (text) => {
  return {
    type: ACTION_TYPES.AGENCY_AGENT_LASTNAME_CHANGED,
    payload: text
  };
};

export const agencyAgentEmailChanged = (text) => {
  return {
    type: ACTION_TYPES.AGENCY_AGENT_EMAIL_CHANGED,
    payload: text
  };
};

export const agencyAgentMobileChanged = (text) => {
  return {
    type: ACTION_TYPES.AGENCY_AGENT_MOBILE_CHANGED,
    payload: text
  };
};

export const agencyAgentPassworChanged = (text) => {
    return {
      type: ACTION_TYPES.AGENCY_AGENT_PASSWORD_CHANGED,
      payload: text
    };
  };

export const clearAddAgentRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_ADD_AGENCY_AGENT_RES,
    payload: ''
  };
};



 
 