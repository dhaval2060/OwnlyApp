import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	agentFirstName:'',
	agentLastName:'',
	agentEmail:'',
    agentMobile:'',
    agentPass:'',
    addAgentRes:'',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.ADD_AGENCY_AGENT_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

        case ACTION_TYPES.ADD_AGENT_BY_AGENCY_RES:
			return { ...state, addAgentRes: action.payload, isScreenLoading: false }
            
		case ACTION_TYPES.AGENCY_AGENT_FIRSTNAME_CHANGED:
			return { ...state, agentFirstName: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.AGENCY_AGENT_LASTNAME_CHANGED:
			return { ...state, agentLastName: action.payload}

		case ACTION_TYPES.AGENCY_AGENT_EMAIL_CHANGED:
			return { ...state, agentEmail: action.payload}

		case ACTION_TYPES.AGENCY_AGENT_MOBILE_CHANGED:
			return { ...state, agentMobile: action.payload}

		case ACTION_TYPES.AGENCY_AGENT_PASSWORD_CHANGED:
			return { ...state, agentPass: action.payload}

		case ACTION_TYPES.CLEAR_ADD_AGENCY_AGENT_RES:
            return { ...state, addAgentRes: action.payload}

	
		default:
			return state;
	}

};
