import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	email: '',
	resData: '',
	isScreenLoading:false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.FORGOT_PASS_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.FORGOT_PASS_RESET_DATA:
      		return INITIAL_STATE;
		
		case ACTION_TYPES.FORGOT_PASS_EMAIL_CHANGED:
			return { ...state, email: action.payload }
		
		case ACTION_TYPES.FORGOT_PASS_RES:
			return { ...state, resData: action.payload,isScreenLoading:false }

		default:
			return state;
	}

};
