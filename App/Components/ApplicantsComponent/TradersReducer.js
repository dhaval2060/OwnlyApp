import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	tradersListResponse: '',
	tradersProfileRes: '',
	userAllReviewRes: '',
	jobHistoryRes:'',
	favTraderListRes:'',
	addUserFavRes:'',
	nameChangeText: '',
	cityChangeText: '',
	stateChangeText: '',
	postalCodeChangeText: '',
	isScreenLoading: false,
	isFilterClearCall:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.TRADERS_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.TRADERS_LIST_RES:
			return { ...state, tradersListResponse: action.payload, isScreenLoading: false }


		case ACTION_TYPES.TRADERS_PROFILE_RES:
			return { ...state, tradersProfileRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_ALL_USER_REVIEW_RES:		
			return { ...state, userAllReviewRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.TRADERS_JOB_HISTORY_RES:		
			return { ...state, jobHistoryRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_FAV_TRADERS_RES:		
			return { ...state, favTraderListRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.ADD_USER_AS_FAV_RES:		
			return { ...state, addUserFavRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.TRADER_FILTER_NAME_CHANGED:
			return { ...state, nameChangeText: action.payload }

		case ACTION_TYPES.TRADER_FILTER_CITY_CHANGED:
			return { ...state, cityChangeText: action.payload }

		case ACTION_TYPES.TRADER_FILTER_STATE_CHANGED:
			return { ...state, stateChangeText: action.payload }

		case ACTION_TYPES.TRADER_FILTER_POSTAL_CODE_CHANGED:
			return { ...state, postalCodeChangeText: action.payload }
		
		case ACTION_TYPES.CLEAR_TRADER_LIST_RES:
			return { ...state, tradersListResponse: '' }
		
		case ACTION_TYPES.CALL_TRADER_LIST_API_ON_CLEAR_FILTER:
			return { ...state, isFilterClearCall: action.payload }

		default:
			return state;
	}

};
