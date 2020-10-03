import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	agentListResponse: '',
	agentListWithInAgencyResponse: '',
	refreshScene:'',
	isScreenLoading: false,

}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.AGENT_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.ALL_AGENT_LIST:
			return { ...state, agentListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.AGENT_LIST_WITH_IN_AGENCY:
			return { ...state, agentListWithInAgencyResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.UPDATE_AGENT_LIST:
			return { ...state, refreshScene: action.payload}
		default:
			return state;
	}

};
