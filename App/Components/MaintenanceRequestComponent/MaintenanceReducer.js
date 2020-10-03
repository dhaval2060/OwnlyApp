import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	
	maintenanceListResponse: '',
	maintenanceListReqByTenantResponse: '',
	isScreenLoading: false,
	refreshScene:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.MAINTENANCE_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.MAINTENANCE_REQUEST_LIST_RES:
			return { ...state, maintenanceListResponse: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.GET_MAINTENANCE_REQ_BY_TENANT_RES:
			return { ...state, maintenanceListReqByTenantResponse: action.payload, isScreenLoading: false }
					
		case ACTION_TYPES.UPDATE_MAINTENANCE_SCREEN:
			return { ...state, refreshScene: action.payload }

		default:
			return state;
	}

};
