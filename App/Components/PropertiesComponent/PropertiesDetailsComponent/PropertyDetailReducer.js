import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	
	propertyDetailResponse: '',
	tenanciesHistoryRes:'',
	propertyAgreementRes:'',
	maintenanceHistoryRes:'',
	userReviewRes:'',
	isScreenLoading: false,
	userAssociateStatus:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.PROPERTY_DETAIL_SHOW_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.PROPERTY_DETAIL_RES:
			return { ...state, propertyDetailResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_TENANCIES_HISTORY_RES:
			return { ...state, tenanciesHistoryRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.GET_AGREEMENT_FOR_PROPERTY_RES:
			return { ...state, propertyAgreementRes: action.payload, isScreenLoading: false }		
		
		case ACTION_TYPES.GET_MAINTENANCE_HISTORY_RES:
			return { ...state, maintenanceHistoryRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.GET_USER_REVIEW_RES:
			return { ...state, userReviewRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY_RES:
			return { ...state, userAssociateStatus: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
