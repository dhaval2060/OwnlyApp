import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	logoutResponse: '',
	statisticRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		//23 Nov
		case ACTION_TYPES.LOGOUT_FETCHING_DATA:
			return { ...state, isScreenLoading: true }
		//
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.LOGOUT_USER_RES:
			return { ...state, logoutResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_STATISTICS_RES:
			return { ...state, statisticRes: action.payload, isHomeScreenLoading: false }

		default:
			return state;
	}

};
