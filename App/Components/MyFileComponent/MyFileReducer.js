import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	
	uploadedDocumentRes: '',
	uploadedFavDocumentRes: '',
	addDocumentToFavRes: '',
	uploadDocSuccessRes:'',
	isScreenLoading: false,
	deleteMyFileRes:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.MY_FILE_SHOW_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.UPLOADED_DOCUMENT_RES:
			return { ...state, uploadedDocumentRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.FAV_UPLOADED_DOCUMENT_RES:
			return { ...state, uploadedFavDocumentRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.ADD_DOCUMENT_TO_FAV_RES:
			return { ...state, addDocumentToFavRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.UPLOAD_MYFILE_RES:
			return { ...state, uploadDocSuccessRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.DELETE_MY_FILE_RES:
			return { ...state, deleteMyFileRes: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
