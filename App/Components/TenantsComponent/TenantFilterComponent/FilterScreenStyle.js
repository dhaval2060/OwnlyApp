import {
	StyleSheet,
	Platform,
	Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';
const window = Dimensions.get('window');
export default StyleSheet.create({


	roundedBlueProceedButtonStyle: {
		borderRadius: 100,
		height: 40,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		justifyContent: 'center',
		marginLeft: 5,

	},
	
	uploadImageButtonStyle: {
		
		width: window.width * 0.4,
		borderRadius: 100,
		height: 40,
		marginTop: 30,
		backgroundColor: Colors.UPLOAD_IMAGE_BUTTON_COLOR,
		justifyContent: 'center',
		marginLeft: 20,
		marginBottom: 30

	},

	buttonContainerStyle: {
		flexDirection: 'row',
		marginTop:20,
		backgroundColor: Colors.WHITE,
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	proceedButtonTextStyle: {
		height: 16,
		width: 164,
		color: Colors.WHITE,
		fontSize: 13,
		fontWeight: 'bold',
		lineHeight: 16,
		marginLeft:15,
		marginRight:15,
		textAlign: 'center',
	},
	uploadButtonTextStyle: {
		height: 16,
		width: window.width * 0.4,
		color: Colors.WHITE,
		fontSize: 13,
		fontWeight: 'bold',
		lineHeight: 16,
		textAlign: 'center',
	},

	labelStyle: {
		height: 17,
		color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
		fontSize: 14,
		fontWeight: '500',
		lineHeight: 17,
	},

	clearFiltersLabelStyle: {
		
		color: Colors.STAUS_RED_COLOR,
		fontSize: 14,
		fontWeight: '500',
		
	},
	labelTextStyle: {
		height: 16,
		color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		fontSize: 13,
		fontWeight: '500',
		lineHeight: 16,
		marginBottom: 25,
	},
	addOwnerLabelTextStyle: {
		height: 16,
		color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		fontSize: 13,
		fontWeight: '500',
		lineHeight: 16,
		marginBottom: 25,
		paddingLeft: 5
	},

	addPropertyInputContainer: {
		padding: 20,
		marginTop: 1,
		backgroundColor: Colors.WHITE,
	},
	centerContainer: {
		padding: 20,
		backgroundColor: Colors.TRANSPARENT,
	},
	inputViewStyle: {
		height: 38,
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 15,
		borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
		borderRadius: 4,
		backgroundColor: Colors.WHITE,
	},
	dropDownViewStyle: {
		height: 38,
		marginTop: 10,
		paddingLeft: 15,
		paddingRight: 10,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
		borderRadius: 4,
		backgroundColor: Colors.WHITE,
	},
	inputTextStyle: {
		height: 38,
		borderWidth: 1,
		marginTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		marginBottom: 15,
		borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
		borderRadius: 4,
		fontSize: 14,
		backgroundColor: Colors.WHITE,
	},
	inputDescriptionTextStyle: {
		height: 170,
		borderWidth: 1,
		textAlign: 'left',
		textAlignVertical: 'top',
		alignItems: 'center',
		marginTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		marginBottom: 15,
		borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
		borderRadius: 4,
		fontSize: 14,
		backgroundColor: Colors.WHITE,
	},
	scrollViewContainerStyle: {
		marginTop: 15,
	},
	addOwnerLabelContainer: {
		flexDirection: 'row',

	},
	successViewContainer: {
		flex: 1,
		alignItems: 'center',
		marginTop: 50,
	},
	successRoundViewStyle: {
		height: 74,
		width: 74,
		borderRadius: 100,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 1,
	},
	successTitleTextStyle: {
		height: 56,
		color: Colors.WHITE,
		fontSize: 24,
		fontWeight: 'bold',
		lineHeight: 28,
		textAlign: 'center',
		marginTop: 20,
		backgroundColor: Colors.TRANSPARENT,
	},
	successDescriptionTextStyle: {
		height: 34,
		color: Colors.WHITE,
		fontSize: 14,
		lineHeight: 17,
		textAlign: 'center',
		marginTop: 20,
		backgroundColor: Colors.TRANSPARENT,
	},
	roundedBlueAddNewPropertyButtonStyle: {
		borderRadius: 100,
		height: 40,
		width: 250,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	successListingDetailTextStyle: {
		height: 17,
		color: Colors.WHITE,
		fontSize: 14,
		lineHeight: 17,
		textAlign: 'center',
		marginTop: 15,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: Colors.TRANSPARENT,
	},
	lineViewStyle: {
		height: 1,
		marginTop: 2,
		backgroundColor: Colors.WHITE,
	},
	amenitiesListItemContainerStyle: {
		backgroundColor: Colors.WHITE,
		paddingBottom: 15
	},
	checkAllAmenitiesTextStyle: {

		color: Colors.PROPERTY_TITLE_COLOR,
		fontSize: 18,
		backgroundColor: Colors.WHITE,


	},
	maxImageTextStyle: {

		color: Colors.PROPERTY_TITLE_COLOR,
		fontSize: 14,
		backgroundColor: Colors.WHITE,
		padding: 20

	},
	amenitiesListViewStyle: {
		paddingTop: 20,
		backgroundColor: Colors.WHITE,
	},
	amenitisListCheckboxLabelStyle: {
		color: Colors.PROPERTY_TITLE_COLOR,
		fontSize: 14,
		backgroundColor: Colors.WHITE,
	},
	uploadPropertyImageStyle: {
		height: window.height * 0.4,
		width: window.width
	},
	uploadImageListItemStyle: {
		height: window.width * 0.4 - 50,
		width: window.width * 0.4,
		marginRight: 10
	},
	uploadPropertyListImageStyle: {
		height: window.width * 0.4 - 50,
		width: window.width * 0.4,
		marginRight: 10
	},
	uploadImageListContainerView: {
		backgroundColor: Colors.WHITE,
		marginTop: 1
	},
	selectedImageStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		top: 0,
		height: window.width * 0.4 - 50,
		width: window.width * 0.4,
		marginRight: 10,
		backgroundColor: Colors.TRANSLUCENT_BLACK_DARK,
		borderWidth: 4,
		borderColor: Colors.SKY_BLUE_BUTTON_BACKGROUND

	},
	featuredTextStyle: {

		width: window.width * 0.22,
		color: Colors.WHITE,
		fontSize: 9,
		fontWeight: '900',
		textAlign: 'center',

	},
	roundedBlueFeaturedButtonStyle: {
		width: window.width * 0.22,
		borderRadius: 100,
		height: 30,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 5,

	},
	dropDownTextStyle: { fontWeight: 'bold', textAlign: 'center' },
	checkBoxlabelStyle: {
		color: Colors.PROPERTY_TITLE_COLOR,
		backgroundColor: Colors.TRANSPARENT,
		fontSize: 14,
		fontWeight: '500',
		marginRight: 20,
	},

	searchViewStyle: {
		flexDirection: 'row',
		height: 38,
		borderWidth: 1,
		borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
		borderRadius: 100,
		marginTop: 10,
		paddingLeft: 15,
		paddingRight: 10,
		marginBottom: 15,
		alignItems: 'center',
	},
	searchImageStyle: {
		margin: 10
	},
	searchTextInputStyle: {
		height: 17,
		flex: 1,
		color: Colors.FILTER_TEXT_VIEW_COLOR,
		fontSize: 14,
		marginRight: 10,
	},

	stateViewStyle: {
		flexDirection: 'row',
		height: 38,
		borderWidth: 1,
		borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
		borderRadius: 4,
		marginTop: 15,
		marginBottom: 15,
		alignItems: 'center',
	},

	stateTextInputStyle: {
		height: 17,
		flex: 1,
		paddingLeft: 10,
		color: Colors.FILTER_TEXT_VIEW_COLOR,
		fontSize: 14,
		marginRight: 10,
	},
	datePickerStyle:{
		width:window.width*0.88
	}

});