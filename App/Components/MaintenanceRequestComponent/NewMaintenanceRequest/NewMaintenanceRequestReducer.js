import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	

	tradersListResponse: '',
	agencyListResponse:'',
	watcherListResponse:'',
	imageUploadRes:'',
	traderName:'',
	propertyName:'Select Property',
	maintenanceRequestName:'',
	maintenanceBudget:'',
	reqDate:'',
	reqDetail:'',
	searchWatcherName:'',
	addPropertyRes:'',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.NEW_MAINTENANCE_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;
		
		case ACTION_TYPES.GET_TRADERS_OPTION_LIST_RES:

			return { ...state, tradersListResponse: action.payload, isScreenLoading: false }		
		
		case ACTION_TYPES.GET_AGENCY_PROPERTY_LIST_RES:

			return { ...state, agencyListResponse: action.payload, isScreenLoading: false }


		case ACTION_TYPES.GET_WATCHER_LIST_RES:

			return { ...state, watcherListResponse: action.payload, isScreenLoading: false }	

		case ACTION_TYPES.UPLOAD_MAINTENANCE_IMAGE_RES:

			return { ...state, imageUploadRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.ADD_MAINTENANCE_REQ_RES:

			return { ...state, addPropertyRes: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.CLEAR_MAINTENANCE_UPLOAD_IMG_RES:

			return { ...state, imageUploadRes: '' }

		case ACTION_TYPES.MAINTENANCE_TRADERS_CHANGED:

			return { ...state, traderName: action.payload}
		
		case ACTION_TYPES.SEARCH_WATCHER_NAME_CHANGE:

			return { ...state, searchWatcherName: action.payload}		

		case ACTION_TYPES.MAINTENANCE_PROPERTY_NAME_CHANGE:

			return { ...state, propertyName: action.payload}	

		case ACTION_TYPES.MAINTENANCE_BUDGET_CHANGE:

			return { ...state, maintenanceBudget: action.payload}
		
		case ACTION_TYPES.MAINTENANCE_REQ_NAME_CHANGE:

			return { ...state, maintenanceRequestName: action.payload}	

		case ACTION_TYPES.MAINTENANCE_REQ_DETAIL_CHANGE:

			return { ...state, reqDetail: action.payload}

		case ACTION_TYPES.CLEAR_ADD_MAINTENANCE_RES:
            return { ...state, addPropertyRes: action.payload}

		default:
			return state;
	}

};
