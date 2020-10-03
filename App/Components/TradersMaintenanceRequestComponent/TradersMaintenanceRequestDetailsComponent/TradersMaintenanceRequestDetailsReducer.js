import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {

	maintenanceReqDetailRes:'',
	isScreenLoading: false,
	
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHOW_LOADING_MAINTENANCE_DETAIL:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.GET_MAINTENANCE_DETAIL_RES:
			return { ...state, maintenanceReqDetailRes: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
