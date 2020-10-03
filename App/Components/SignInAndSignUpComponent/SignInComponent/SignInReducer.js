import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	userName: '',
	password: '',
	loginRes: '',
	isScreenLoading:false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
      		return INITIAL_STATE;
		
		case ACTION_TYPES.USER_NAME_CHANGED:
			return { ...state, userName: action.payload }

		case ACTION_TYPES.PASSWORD_CHANGED:
			return { ...state, password: action.payload }
		
		case ACTION_TYPES.LOGIN_USER_RES:
			return { ...state, loginRes: action.payload,isScreenLoading:false }

		case ACTION_TYPES.LOGIN_USER_RES_CLEAR:
			return { ...state, loginRes:'' }

		default:
			return state;
	}

};
