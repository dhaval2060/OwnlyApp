 import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	propertyOwnerFirstName:'',
	propertyOwnerLastName:'',
	propertyOwnerEmail:'',
	propertyOwnerMobile:'',
	addOwnerRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.ADD_PROPERTY_OWNER_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.ADD_PROPERTY_OWNER_RES:
			return { ...state, addOwnerRes: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.PROPERTY_OWNER_FIRSTNAME_CHANGED:
			return { ...state, propertyOwnerFirstName: action.payload}

		case ACTION_TYPES.PROPERTY_OWNER_LASTNAME_CHANGED:
			return { ...state, propertyOwnerLastName: action.payload}

		case ACTION_TYPES.PROPERTY_OWNER_EMAIL_CHANGED:
			return { ...state, propertyOwnerEmail: action.payload}

		case ACTION_TYPES.PROPERTY_OWNER_MOBILE_CHANGED:
			return { ...state, propertyOwnerMobile: action.payload}

		case ACTION_TYPES.CLEAR_ADD_OWNER_RES:
			return INITIAL_STATE;

	
		default:
			return state;
	}

};
