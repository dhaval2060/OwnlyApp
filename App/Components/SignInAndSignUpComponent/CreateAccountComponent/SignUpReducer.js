import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	firstName: '',
	lastName: '',
	email: '',
	phoneNumber: '',
	password: '',
	confirmPassword: '',
	signUpResponse: '',
	userTypeVal:'',
	userRoleRes:'',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		//23 Nov
		case ACTION_TYPES.SIGNUP_FETCHING_DATA:
			return { ...state, isScreenLoading: true }
		//	

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.FIRST_NAME_CHANGED:
			return { ...state, firstName: action.payload }

		case ACTION_TYPES.LAST_NAME_CHANGED:
			return { ...state, lastName: action.payload }

		case ACTION_TYPES.EMAIL_CHANGED:
			return { ...state, email: action.payload }

		case ACTION_TYPES.PHONE_NUMBER_CHANGED:
			return { ...state, phoneNumber: action.payload }

		case ACTION_TYPES.SIGNUP_PASSWORD_CHANGED:
			return { ...state, password: action.payload }

		case ACTION_TYPES.CONFIRM_PASSWORD_CHANGED:
			return { ...state, confirmPassword: action.payload }
		
		case ACTION_TYPES.USER_TYPE:
			return { ...state, userTypeVal: action.payload }

		case ACTION_TYPES.SIGNUP_USER_RES:
			return { ...state, signUpResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.USER_ROLE_LIST:
			return { ...state, userRoleRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.CLEAR_SIGN_UP_RESPONSE:
			return { ...state, signUpResponse: ''}

		default:
			return state;
	}

};
