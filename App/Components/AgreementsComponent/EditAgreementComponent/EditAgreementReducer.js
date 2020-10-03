import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	


	agencyListResponse:'',
	ownerListResponse:'',
	tenantsListResponse:'',
	updateAgreementRes:'',
	tenantSearch:'',
	uploadedImageRes:'',
	propertyName:'Select Property',
	ownerName:'Select Owner',
	isScreenLoading: false,
	isAgreementUpdate:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.ADD_AGREEMENT_SHOW_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;
		
		case ACTION_TYPES.GET_AGREEMENT_PROPERTY_LIST_RES:

			return { ...state, agencyListResponse: action.payload, isScreenLoading: false }		
		
		case ACTION_TYPES.GET_AGREEMENT_PROPERTY_WONER_LIST_RES:

			return { ...state, ownerListResponse: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.GET_PROPERTY_TENANT_LIST_RES:

			return { ...state, tenantsListResponse: action.payload, isScreenLoading: false }	

		case ACTION_TYPES.UPDATE_AGREEMENT_RES:

			return { ...state, updateAgreementRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.UPLOAD_AGREEMENT_IMAGE_RES:

			return { ...state, uploadedImageRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.AGREEMENT_PROPERTY_NAME_CHANGE:

			return { ...state, propertyName: action.payload}	

		case ACTION_TYPES.AGREEMENT_PROPERTY_OWNER_NAME_CHANGE:

			return { ...state, ownerName: action.payload}			

		case ACTION_TYPES.AGREEMENT_PROPERTY_TENANTS_SEARCH_CHANGE:

			return { ...state, tenantSearch: action.payload}	
		
		case ACTION_TYPES.CLEAR_OWNER_DATA:

			return { ...state, ownerListResponse: ''}	
		
		case ACTION_TYPES.CLEAR_TENANTS_DATA:

			return { ...state, tenantsListResponse: ''}	
		
		case ACTION_TYPES.CLEAR_AGREEMENT_UPLOAD_IMAGE_RES:

			return { ...state, uploadedImageRes: ''}			

		case ACTION_TYPES.CLEAR_AGENCY_DATA:

			return { ...state, agencyListResponse: ''}	

		case ACTION_TYPES.UPDATE_AGREEMENT_DATA:

			return { ...state, isAgreementUpdate: action.payload}	
		
		case ACTION_TYPES.CLEAR_UPDATED_AGREEMENT_DATA:

			return { ...state, updateAgreementRes: ''}	

		default:
			return state;
	}

};
