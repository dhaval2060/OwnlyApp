import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	tenantListResponse: '',
	tenantProfileRes:'',
	tenantAgreementRes:'',
	addUserFavRes:'',
	nameChangeText: '',
	cityChangeText: '',
	stateChangeText: '',
	postalCodeChangeText: '',
	isScreenLoading: false,
	isFilterClearCall:'',
	refreshScene:''


}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.TENANT_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.TENANT_LIST_RES:
			return { ...state, tenantListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_AGREEMENT_FOR_TENANT_PROFILE_RES:
			return { ...state, tenantAgreementRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.TENANT_PROFILE_RES:
			return { ...state, tenantProfileRes: action.payload, isScreenLoading: false }
	
		case ACTION_TYPES.ADD_USER_AS_FAV_RES:
			return { ...state, addUserFavRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.FILTER_NAME_CHANGED:
			return { ...state, nameChangeText: action.payload }

		case ACTION_TYPES.FILTER_CITY_CHANGED:
			return { ...state, cityChangeText: action.payload }

		case ACTION_TYPES.FILTER_STATE_CHANGED:
			return { ...state, stateChangeText: action.payload }

		case ACTION_TYPES.FILTER_POSTAL_CODE_CHANGED:
			return { ...state, postalCodeChangeText: action.payload }
		
		case ACTION_TYPES.CLEAR_TENANT_LIST_RES:
			return { ...state, tenantListResponse: '' }
		
		case ACTION_TYPES.CALL_TENANT_LIST_API_ON_CLEAR_FILTER:
			return { ...state, isFilterClearCall: action.payload }
		
		case ACTION_TYPES.UPDATE_TENANT_LIST:
			return { ...state, refreshScene: action.payload }
			
		default:
			return state;
	}

};
