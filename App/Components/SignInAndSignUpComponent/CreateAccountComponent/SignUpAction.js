import ACTION_TYPES from '../../../Action/ActionsType';

// User firstname TextField Value Change
export const firstNameChanged = (text) => {
  return {
    type: ACTION_TYPES.FIRST_NAME_CHANGED,
    payload: text
  };
};

// User lastname TextField Value Change
export const lastNameChanged = (text) => {
  return {
    type: ACTION_TYPES.LAST_NAME_CHANGED,
    payload: text
  };
};


// User email TextField Value Change
export const emailChanged = (text) => {
  return {
    type: ACTION_TYPES.EMAIL_CHANGED,
    payload: text
  };
};


// User phone number TextField Value Change
export const phoneNumberChanged = (text) => {
  return {
    type: ACTION_TYPES.PHONE_NUMBER_CHANGED,
    payload: text
  };
};

// Password TextField Value Change
export const signUpPasswordChanged = (text) => {
  return {
    type: ACTION_TYPES.SIGNUP_PASSWORD_CHANGED,
    payload: text
  }
};

// Password TextField Value Change
export const confirmPasswordChanged = (text) => {
  return {
    type: ACTION_TYPES.CONFIRM_PASSWORD_CHANGED,
    payload: text
  }
};

export const userType = (text) => {
  return {
    type: ACTION_TYPES.USER_TYPE,
    payload: text
  };
};

export function showLoading() {
  return {
    type: ACTION_TYPES.SIGNUP_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export function clearResponse() {
  return {
    type: ACTION_TYPES.CLEAR_SIGN_UP_RESPONSE
  }
}


 