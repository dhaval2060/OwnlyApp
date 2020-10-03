import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.DISPUTES_LIST_FETCHING_DATA,

  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

//property name changed
export const propertyNameChanged = (text) => {
  return {
    type: ACTION_TYPES.DISPUTE_PROPERTY_NAME_CHANGED,
    payload: text
  };
};

// agent name changed
export const agentNameChanged = (text) => {
  return {
    type: ACTION_TYPES.DISPUTE_AGENT_NAME_CHANGED,
    payload: text
  };
};

// tenant name changed
export const tenantNameChanged = (text) => {
  return {
    type: ACTION_TYPES.DISPUTE_TENANT_NAME_CHANGED,
    payload: text
  };
};

// owner name changed
export const ownerNameChanged = (text) => {
  return {
    type: ACTION_TYPES.DISPUTE_OWNER_NAME_CHANGED,
    payload: text
  };
};


// subject name changed
export const subjectNameChanged = (text) => {
  return {
    type: ACTION_TYPES.DISPUTE_SUBJECT_NAME_CHANGED,
    payload: text
  };
};

// message changed
export const messageChanged = (text) => {
  return {
    type: ACTION_TYPES.DISPUTE_MESSAGE_NAME_CHANGED,
    payload: text
  };
};

export function clearTenantsData() {
  return {
    type: ACTION_TYPES.CLEAR_DISPUTE_TENANT_DATA
  };
};

export const clearAddDisputesRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_ADD_DISPUTES_RES,
    payload: ''
  };
};

export const updateDisputesList = (text) => {

  return {
    type: ACTION_TYPES.UPDATE_DISPUTES_LIST,
    payload: text
  };
  
};
