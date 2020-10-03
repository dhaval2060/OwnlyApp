import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.SHOW_ADD_TANENT_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const clearAgreementByPropertyId = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_AGREEMENT_BY_PROPERTY_ID_RES,
    payload: ''
  };
};

export const selectedPropertyId = (text) => {
  return {
    type: ACTION_TYPES.TENANT_PROPERTY_ID,
    payload: text
  };
};
export const selectedAgreementId = (text) => {
  return {
    type: ACTION_TYPES.TENANT_AGREEMENT_SELECTED_ID,
    payload: text
  };
};

export const propertyChanged = (text) => {
  return {
    type: ACTION_TYPES.TENANT_PROPERTY_CHANGED,
    payload: text
  };
};
export const agreementChanged = (text) => {
  return {
    type: ACTION_TYPES.TENANT_AGREEMENT_CHANGED,
    payload: text
  };
};

export const tenantFirstNameChanged = (text) => {
  return {
    type: ACTION_TYPES.TENANT_FIRST_NAME_CHANGED,
    payload: text
  };
};

export const tenantLastNameChanged = (text) => {
  return {
    type: ACTION_TYPES.TENANT_LAST_NAME_CHANGED,
    payload: text
  };
};


export const tenantEmailChanged = (text) => {
  return {
    type: ACTION_TYPES.TENANT_EMAIL_CHANGED,
    payload: text
  };
};

export const tenantPhoneChanged = (text) => {
  return {
    type: ACTION_TYPES.TENANT_PHONE_CHANGED,
    payload: text
  };
};

export const clearAddTenantRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_ADD_TENANT_RES,
    payload: ''
  };
};