import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({

  profileContainer: {
    flex: 1,
  },
  topCoverImageContainer: {
    height: window.height * 0.4,
    width: window.width,
    backgroundColor: Colors.LISTING_BG_COLOR,
  },

  profileHeaderContainer: {
    position: 'absolute',
    height: 60,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingTop: 5,
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
},

  optionViewContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    height: window.width * 0.4,
    width: 50,
    backgroundColor: Colors.TRANSPARENT,
    borderRadius: window.width * 0.35,
    top: ((window.height * 0.4) - ((window.width * 0.4) / 2)),
    right: 0,
  },

  optionViewStyle: {
    alignItems: 'center',
    height: 38,
    width: 38,
    justifyContent: 'center',
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    borderRadius: 19,
  },
  propertiesTitleContainerStyle: {
    justifyContent: 'center',
    marginTop: 2,
    padding: 25,
    backgroundColor: Colors.WHITE,
  },
  ratingViewContainerStyle: {

    marginTop: 2,
    padding: 25,
    backgroundColor: Colors.WHITE,
  },
  propertyTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 24,
    fontWeight: '600',
  },
  propertyIdTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 13,
    marginTop: 5,
  },
  propertyIdImageStyle: {
    marginTop: 5,
    marginRight: 5,
  },
  propertyInfoContainerStyle: {
    marginTop: 2,
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 25,
    paddingTop: 15,
    backgroundColor: Colors.WHITE,
  },
  propertyInfoTextstyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 16,
    marginLeft: 25,
    paddingRight: 25
  },
  propertyInfoTextLineThroughstyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    textDecorationLine:'line-through',
    fontSize: 16,
    marginLeft: 25,
    paddingRight: 25
  },
  propertyImageStyle: {
    height: 25,
    width: 25,
  },
  apartmentUserImageStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  userImageStyle: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  emptyUserListImageStyle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.USER_BACKGROUN_COLOR
},
 initialTextStyle: {
    fontSize: 16,
    color: Colors.WHITE
},
  userImageContainerStyle: {
    height: 70,
    width: 75,
  },

  userStausView: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    height: 16,
    width: 16,
    borderRadius: 8,
    borderColor: Colors.WHITE,
    borderWidth: 1,
    backgroundColor: Colors.STATUS_GREEN_COLOR,
  },

  userOfflineStausView: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    height: 16,
    width: 16,
    borderRadius: 8,
    borderColor: Colors.WHITE,
    borderWidth: 1,
    backgroundColor: Colors.STAUS_RED_COLOR,
  },
  

  dateContainerStyle: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: Colors.WHITE,
  },
  dateImageStyle: {
    marginLeft: 20,
    marginRight: 10,
  },
  dateTextStyle: {
    marginRight: 15,
    color: Colors.DATE_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tenantsTitleViewStyle: {
    marginTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width
  },
  tenantsTitleTextStyle: {

    color: Colors.PROPERTY_TITLE_COLOR,
    fontWeight: '600',
    fontSize: 18
  },
  tenantsSubTitleViewStyle: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width - 30
  },

  tenantsSubTitleTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 14
  },
  imageListMainContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,
  },
  imageListContainerStyle: {
    flexDirection: 'row',
    paddingLeft: 25,
    paddingRight: 20,
  },
  tenantsInfoContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
    paddingBottom: 20
  },
  propertyBedroomViewContainer: {
    flexDirection: 'row'
  },

  propertyWashrooViewContainer: {
    flexDirection: 'row',
    paddingLeft: 20
  },
  propertyValueTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 14,
    paddingLeft: 10
  },
  amentiesTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontWeight: '600',
    fontSize: 18,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 25,
    paddingBottom:15
  },
  aboutPropertyDetailTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 14,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 25,
    lineHeight: 17,
  },
  amenitiesTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    alignItems: 'center',
    fontSize: 14,
    justifyContent: 'center',
    marginTop: 3,
    marginLeft: 15,
  },
  amentiesListItemContainer: {
    flexDirection: 'row',
    marginLeft: 25,
    marginTop: 20,
    paddingRight: 25,
  },
  loadMoreAmenitiesTextStyle: {
    flex: 1,
    height: 17,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.REFINE_RESULT_TEXT_COLOR,
    padding: 25,
  },
  propertyInforRowContainerStyle: { flexDirection: 'row', marginTop: 10, },
  propertyIdContainerStyle: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  propertyInofoContainerStyle: { flexDirection: 'row' },
  propertyRatingContainerStyle: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  maintenanceHistoryListContainerStyle: {
    marginLeft: 20,
    marginRight: 20,

  },
  maintenanceHistoryListInfoContainerStyle: { flexDirection: 'row', marginLeft: 25, marginTop: 15, marginRight: 25, },

  maintenanceHistoryListTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontWeight: '600',
    fontSize: 18,
    paddingLeft: 25,
   
    marginRight: 50,
  },
  buttonContainerStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roundedBlueProceedButtonStyle: {
    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginTop: 10,

  },
  proceedButtonTextStyle: {
    height: 16,
    width: window.width * 0.7,
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
    marginLeft:10,
    marginRight:10,
    textAlign: 'center',
  },
  maintenanceHistoryListStyle: {
    paddingBottom: 140,
  },

  roundedBlueEditPropertyButtonStyle: {
    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginLeft:20,
    marginRight:20,
    paddingLeft:40,
    paddingRight:40,
    marginTop:10,

  },

  editPropertyButtonTextStyle: {
    height: 16,
    width: window.width * 0.4,
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',
   
  },  
  editPropertyButtonSkyBlueTextStyle: {
    height: 16,
    width: window.width * 0.4,
    color: Colors.TEXT_COLOR_SKY_BLUE,
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',
   
  },

  roundedTransparentButtonStyle: {

    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDEEF6',
    marginRight: 5,
    marginLeft:20,
    marginRight:20,
    paddingLeft:40,
    paddingRight:40,
    marginTop:10,
  },

  modalContainerStyles: {
    position: 'absolute',
    top: ((window.height * 0.55) - ((window.width * 0.4) / 2)),
    right: 10,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor:'#FFFFFF',
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: (Platform.OS === 'ios') ? 1 : 0,
    marginTop:10
  },
  modalContainer:{height:window.height,width:window.width},
  carouselItemContainer:{
    height:window.height, width:window.width, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'
  },

  carouselInnerView:{
    height:window.height, width:window.width, backgroundColor:'black', borderWidth:5, borderColor:'#ffffff'
  },

  closeButtonContainer:{
    height:40, width:70, position: 'absolute', top: 20, right: 0, justifyContent:'center', alignItems:'center'
  },

  closeText:{
    color:'#ffffff', margin:5,padding:10
},



});