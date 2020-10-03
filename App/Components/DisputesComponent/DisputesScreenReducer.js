import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	disputesListResponse: '',
	isDisputesScreenLoading: false,
	propertyListRes: '',
	addDisputesRes: '',
	propertyNameChanged: 'Select Property',
	agentNameChanged: '',
	tenantNameChanged: '',
	ownerNameChanged: '',
	subjectNameChanged: '',
	messageChanged: '',
	refreshScene:''
}

export default (state = INITIAL_STATE, action) => {
	
	switch (action.type) {

		case ACTION_TYPES.DISPUTES_LIST_FETCHING_DATA:
			return { ...state, isDisputesScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.DISPUTES_LIST_RES:
			return { ...state, disputesListResponse: action.payload, isDisputesScreenLoading: false }

		case ACTION_TYPES.GET_AGENCY_PROPERTY_LIST_RES:
			return { ...state, propertyListRes: action.payload, isDisputesScreenLoading: false }

		case ACTION_TYPES.ADD_DISPUTES_RES:
			return { ...state, addDisputesRes: action.payload, isDisputesScreenLoading: false }

		case ACTION_TYPES.DISPUTE_PROPERTY_NAME_CHANGED:
			return { ...state, propertyNameChanged: action.payload }

		case ACTION_TYPES.DISPUTE_AGENT_NAME_CHANGED:
			return { ...state, agentNameChanged: action.payload }

		case ACTION_TYPES.DISPUTE_TENANT_NAME_CHANGED:
			return { ...state, tenantNameChanged: action.payload }

		case ACTION_TYPES.DISPUTE_OWNER_NAME_CHANGED:
			return { ...state, ownerNameChanged: action.payload }

		case ACTION_TYPES.DISPUTE_SUBJECT_NAME_CHANGED:
			return { ...state, subjectNameChanged: action.payload }

		case ACTION_TYPES.DISPUTE_MESSAGE_NAME_CHANGED:
			return { ...state, messageChanged: action.payload }

		case ACTION_TYPES.CLEAR_DISPUTE_TENANT_DATA:
			return { ...state, messageChanged: action.payload }

		case ACTION_TYPES.CLEAR_ADD_DISPUTES_RES:
            return { ...state, addDisputesRes: action.payload}

		case ACTION_TYPES.UPDATE_DISPUTES_LIST:
			return { ...state, refreshScene: action.payload}


		default:
			return state;
	}

};
