import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	maintenanceListResponse: '',
	acceptRejectReqRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.MAINTENANCE_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.MAINTENANCE_REQUEST_LIST_RES:
			return { ...state, maintenanceListResponse: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.MAINTENANCE_ACCEPT_AND_DENIED_RES:
			return { ...state, acceptRejectReqRes: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
