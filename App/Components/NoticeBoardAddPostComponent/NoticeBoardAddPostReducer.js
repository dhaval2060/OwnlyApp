import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	globalSearchRes: '',
	isScreenLoading: false,
	postTitleChanged: '',
	postAgendaChanged: '',
	postDescriptionChanged: '',
	addPostRes:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.LOADING_ADD_POST:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.ADD_POST_RES:
			return { ...state, addPostRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.POST_TITLE_CHANGED:
			return { ...state, postTitleChanged: action.payload }

		case ACTION_TYPES.POST_AGENDA_CHANGED:
			return { ...state, postAgendaChanged: action.payload }

		case ACTION_TYPES.POST_DESCRIPTION_CHANGED:
			return { ...state, postDescriptionChanged: action.payload }

		default:
			return state;
	}

};
