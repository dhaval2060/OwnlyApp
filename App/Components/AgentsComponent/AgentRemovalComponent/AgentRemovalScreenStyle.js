import {
	StyleSheet,
	Platform,
	Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';
const window = Dimensions.get('window');
export default StyleSheet.create({

	roundedTransparentDraftButtonStyle: {
		borderRadius: 100,
		height: 40,
		backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#EAECFF',
		marginRight: 5,
	},

	roundedBlueProceedButtonStyle: {
		borderRadius: 100,
		height: 40,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		justifyContent: 'center',
		marginLeft: 5,

	},	
	uploadImageButtonStyle: {
		width:window.width*0.4,
		borderRadius: 100,
		height: 40,
		marginTop:30,
		backgroundColor: Colors.UPLOAD_IMAGE_BUTTON_COLOR,
		justifyContent: 'center',
		marginLeft: 20,
		marginBottom:30

	},
	buttonContainerStyle: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 70,
		backgroundColor: Colors.WHITE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	draftButtonTextStyle: {
		height: 16,
		width: 164,
		color: '#1ACFFF',
		fontSize: 13,
		fontWeight: 'bold',
		lineHeight: 16,
		textAlign: 'center',
	},
	proceedButtonTextStyle: {
		height: 16,
		width: 164,
		color: Colors.WHITE,
		fontSize: 13,
		fontWeight: 'bold',
		lineHeight: 16,
		textAlign: 'center',
	},
	uploadButtonTextStyle: {
		height: 16,
		width: window.width*0.4,
		color: Colors.WHITE,
		fontSize: 13,
		fontWeight: 'bold',
		lineHeight: 16,
		textAlign: 'center',
	},
	dotContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		height: 25,
	},
	blueDotStyle: {
		height: 14,
		width: 14,
		borderRadius: 100,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5,

	},
	greyDotStyle: {
		height: 14,
		width: 14,
		borderRadius: 100,
		backgroundColor: Colors.ADD_PROPERTY_DOT_COLOR,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5,

	},
	addPropertyTitleStyle: {
		height: 23,
		color: Colors.ADD_PROPERT_TITLE_TEXT_COLOR,
		fontSize: 20,
		fontWeight: '500',
		lineHeight: 23,
		textAlign: 'center',
		backgroundColor: Colors.TRANSPARENT,
		marginTop: 30,
	},
	addPropertyInstructionTextStyle: {
		height: 51,
		color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
		fontSize: 14,
		lineHeight: 17,
		textAlign: 'center',
		marginTop: 30,
	},
	labelStyle: {
		height: 17,
		color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
		fontSize: 14,
		fontWeight: '500',
		lineHeight: 17,
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
		paddingLeft:5
	},


	headerContainer: {
		padding: 20,
		backgroundColor: '#F8F9FE',
	},
	addPropertyInputContainer: {
		padding: 20,
		marginTop:1,
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
		paddingLeft: 10,
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
		paddingBottom: 60
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
	amenitiesListItemContainerStyle:{
		backgroundColor:Colors.WHITE,
		paddingBottom:15
	},
	checkAllAmenitiesTextStyle:{
		
		color: Colors.PROPERTY_TITLE_COLOR,
		fontSize: 18,
		backgroundColor: Colors.WHITE,
		
	
	},	
	maxImageTextStyle:{
		
		color: Colors.PROPERTY_TITLE_COLOR,
		fontSize: 14,
		backgroundColor: Colors.WHITE,
		padding:20
	
	},
	amenitiesListViewStyle:{
		paddingTop:20,
		backgroundColor: Colors.WHITE,
	},
	amenitisListCheckboxLabelStyle:{
		color: Colors.PROPERTY_TITLE_COLOR,
		fontSize: 14,
		backgroundColor: Colors.WHITE,
	},
  	uploadPropertyImageStyle: {
	    height: window.height * 0.4,
	    width: window.width
  	},
  	uploadImageListItemStyle:{
  		height: window.width * 0.4-50,
	    width: window.width*0.4,
	    marginRight:10
  	},
  	uploadPropertyListImageStyle: {
	   height: window.width * 0.4-50,
	   width: window.width*0.4,
	   marginRight:10
  	},
  	uploadImageListContainerView:{
  		backgroundColor:Colors.WHITE,
  		marginTop:1
  	},
  	selectedImageStyle:{
  		justifyContent:'center',
  		alignItems:'center',
  		position:'absolute',
  		left:0,
  		top:0,
  		height: window.width * 0.4-50,
	    width: window.width*0.4,
	    marginRight:10,
  		backgroundColor: Colors.TRANSLUCENT_BLACK_DARK,	
  		borderWidth:4,
  		borderColor:Colors.SKY_BLUE_BUTTON_BACKGROUND

  	},
  	featuredTextStyle: {
	
		width: window.width*0.22,
		color: Colors.WHITE,
		fontSize: 9,
		fontWeight: '900',
		textAlign: 'center',

	},
	roundedBlueFeaturedButtonStyle: {
		width: window.width*0.22,
		borderRadius: 100,
		height: 30,
		backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
		justifyContent: 'center',
		alignItems:'center',
		marginLeft: 5,

	},	
	dropDownTextStyle:{fontWeight:'bold',textAlign:'center'}

});