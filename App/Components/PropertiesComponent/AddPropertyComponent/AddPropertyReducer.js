import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	propertyName: '',
	propertyCountry: '',
	propertyType: 'Select property type',
	propertyOwner: 'Select Owner',
	propertyOwnerId: '',
	propertyAddress: '',
	propertyDes: '',
	propertyBedroomNo: 'Select number of bedroom',
	propertyCarNo: 'Select number of car port',
	propertyBathroomNo: 'Select number of bathroom',
	propertyFloorArea: '',
	propertyLotArea: '',
	propertyDes2: '',
	amenitiesListResponse: '',
	addPropertyResponse: '',
	getPropertyOwnerResponse: '',
	uploadPropertyImageRes: '',
	savePropertyResponse: '',
	isScreenLoading: false,
	refreshScene: '',
	propertyCategory: 'Select Category'
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		case ACTION_TYPES.AMENITIES_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.AMENITIES_LIST:
			return { ...state, amenitiesListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.ADD_PRPERTY_RES:
			return { ...state, addPropertyResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.SAVE_PROPERTY_AS_DRAFT_RES:
			return { ...state, savePropertyResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.PROPERTY_OWNER_LIST:
			return { ...state, getPropertyOwnerResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.UPLOAD_PROPERTY_IMAGE:
			return { ...state, uploadPropertyImageRes: action.payload, }

		case ACTION_TYPES.UPLOAD_PROPERTY_IMAGE_BY_ID:
			return { ...state, uploadPropertyImageByIdRes: action.payload, isScreenLoading: true }

		case ACTION_TYPES.CLEAR_PROPERTY_OWNER_RES:
			return { ...state, getPropertyOwnerResponse: '' }

		case ACTION_TYPES.CLEAR_AMENITIES_RES:
			return { ...state, amenitiesListResponse: '' }

		case ACTION_TYPES.CLEAR_UPLOAD_PROPERTY_RES:
			return { ...state, uploadPropertyImageRes: '', isScreenLoading: false }

		case ACTION_TYPES.PROPERTY_NAME_CHANGED:
			return { ...state, propertyName: action.payload }

		case ACTION_TYPES.PROPERTY_COUNTRY_CHANGED:
			return { ...state, propertyCountry: action.payload }

		case ACTION_TYPES.PROPERTY_TYPE_CHANGED:
			return { ...state, propertyType: action.payload }

		case ACTION_TYPES.PROPERTY_CATEGORY_CHANGED:
			return { ...state, propertyCategory: action.payload }

		case ACTION_TYPES.PROPERTY_OWNER_CHANGED:
			return { ...state, propertyOwner: action.payload }

		case ACTION_TYPES.PROPERTY_ADDRESS_CHANGED:
			return { ...state, propertyAddress: action.payload }

		case ACTION_TYPES.PROPERTY_DESC_CHANGED:
			return { ...state, propertyDes: action.payload }

		case ACTION_TYPES.PROPERTY_BEDROOM_CHANGED:
			return { ...state, propertyBedroomNo: action.payload }

		case ACTION_TYPES.PROPERTY_CARNO_CHANGED:
			return { ...state, propertyCarNo: action.payload }

		case ACTION_TYPES.PROPERTY_BATHROOM_CHANGED:
			return { ...state, propertyBathroomNo: action.payload }

		case ACTION_TYPES.PROPERTY_FLOORAREA_CHANGED:
			return { ...state, propertyFloorArea: action.payload }

		case ACTION_TYPES.PROPERTY_LOTAREA_CHANGED:
			return { ...state, propertyLotArea: action.payload }

		case ACTION_TYPES.PROPERTY_DESC2_CHANGED:
			return { ...state, propertyDes2: action.payload }

		case ACTION_TYPES.PROPERTY_OWNER_ID:
			return { ...state, propertyOwnerId: action.payload }

		case ACTION_TYPES.UPDATE_ADD_PROPERTY_SCENE:
			return { ...state, refreshScene: action.payload }

		default:
			return state;
	}

};
