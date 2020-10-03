import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	propertyByAgentRes: '',
	addTenantRes: '',
	tenantPropertyId:'',
	agreementSelectedId:'',
	tenantFirstName:'',
	tenantLastName:'',
	tenantEmailChange:'',
	tenantPhoneChange:'',
	agreementListRes:'',
	propertyValue:'Select property',
	agreementValue:'Select agreement',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHOW_ADD_TANENT_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.GET_PROPERTY_BY_AGENT_RES:
			return { ...state, propertyByAgentRes: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.ADD_TANENT_RES:
			return { ...state, addTenantRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.GET_AGREEMENT_BY_PROPERTY_RES:
			return { ...state, agreementListRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.TENANT_PROPERTY_ID:
			return { ...state, tenantPropertyId: action.payload}	

		case ACTION_TYPES.TENANT_AGREEMENT_SELECTED_ID:
			return { ...state, agreementSelectedId: action.payload}

		case ACTION_TYPES.TENANT_PROPERTY_CHANGED:
			return { ...state, propertyValue: action.payload}
		
		case ACTION_TYPES.TENANT_AGREEMENT_CHANGED:
			return { ...state, agreementValue: action.payload}

		case ACTION_TYPES.TENANT_FIRST_NAME_CHANGED:
			return { ...state, tenantFirstName: action.payload}

		case ACTION_TYPES.TENANT_LAST_NAME_CHANGED:
			return { ...state, tenantLastName: action.payload}

		case ACTION_TYPES.TENANT_EMAIL_CHANGED:
			return { ...state, tenantEmailChange: action.payload}

		case ACTION_TYPES.TENANT_PHONE_CHANGED:
			return { ...state, tenantPhoneChange: action.payload}

		case ACTION_TYPES.CLEAR_AGREEMENT_BY_PROPERTY_ID_RES:
			return { ...state, agreementListRes: ''}
		
		case ACTION_TYPES.CLEAR_ADD_TENANT_RES:
            return { ...state, addTenantRes: action.payload}

		default:
			return state;
	}

};
