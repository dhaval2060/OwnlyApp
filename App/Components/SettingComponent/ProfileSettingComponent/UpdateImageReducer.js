import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	updateUserImageRes: '',
	userDetailsRes: '',
	phoneNumber: '',
	aboutUser: '',
	firstName: '',
	lastName: '',
	cityName: '',
	zipCode: '',
	stateName: '',
	agencyName: '',
	agencyList: '',
	isScreenLoading: false,
	isLoading: false,
	agencyAssociateRes: '',
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.UPDATE_USER_IMAGE_LOADER:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.UPDATE_USER_DETAIL_LOADER:
			return { ...state, isLoading: true }

		case ACTION_TYPES.RESET_UPDATE_USER_IMAGE_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.UPDATE_USER_IMAGE_RES:

			return { ...state, updateUserImageRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.CLEAR_USER_IMAGE_RES:

			return { ...state, updateUserImageRes: '' }

		case ACTION_TYPES.USER_DETAILS_RES:

			return { ...state, userDetailsRes: action.payload, isLoading: false }

		case ACTION_TYPES.PHONE_NUMBER_CHANGED:
			return { ...state, phoneNumber: action.payload }


		case ACTION_TYPES.SUBURB_OR_POSTCODE_CHANGED:
			return { ...state, suburb_postcode: action.payload }


		case ACTION_TYPES.BUSINESS_NAME_CHANGED:
			return { ...state, business_name: action.payload }


		case ACTION_TYPES.ABN_NUMBER_CHANGED:
			return { ...state, abn_number: action.payload }

		case ACTION_TYPES.LATITUDE_CHANGED:
			return { ...state, location_latitude: action.payload }

		case ACTION_TYPES.LONGITUDE_CHANGED:
			return { ...state, location_longitude: action.payload }

		case ACTION_TYPES.ABOUT_USER_CHANGED:
			return { ...state, aboutUser: action.payload }

		case ACTION_TYPES.FIRST_NAME_CHANGED:
			return { ...state, firstName: action.payload }

		case ACTION_TYPES.LAST_NAME_CHANGED:
			return { ...state, lastName: action.payload }


		case ACTION_TYPES.CITY_NAME_CHANGED:
			return { ...state, cityName: action.payload }

		case ACTION_TYPES.ZIP_CODE_CHANGED:
			return { ...state, zipCode: action.payload }

		case ACTION_TYPES.STATE_CHANGED:
			return { ...state, stateName: action.payload }


		case ACTION_TYPES.UPDATE_USER_DETAILS_RES:
			return { ...state, userDetailsRes: action.payload, isLoading: false }

		case ACTION_TYPES.CLEAR_USER_DETAILS_RES:
			return { ...state, userDetailsRes: '' }

		case ACTION_TYPES.AGENCY_CHANGED:
			return { ...state, agencyName: action.payload }

		case ACTION_TYPES.AGENCY_LIST:
			return { ...state, agencyList: action.payload }

		case ACTION_TYPES.CLEAR_AGENCY_LIST:
			return { ...state, agencyList: '' }

		case ACTION_TYPES.ASSOCIATE_WITH_AGENCY:
			return { ...state, agencyAssociateRes: action.payload, isLoading: false }

		case ACTION_TYPES.CLEAR_ASSOCIATE_WITH_AGENCY:
			return { ...state, agencyAssociateRes: '' }


		default:
			return state;
	}

};
