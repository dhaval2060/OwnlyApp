import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';
const window = Dimensions.get('window');
export default StyleSheet.create({


  managePropertyViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 15
  },

  managePropertyTextStyle: {
    color: Colors.LIGHT_GRAY_TEXT_COLOR,
    fontSize: 20,
    paddingLeft: 5,
    fontWeight: '500'
  },

  propertyImageViewStyle: {
    height: window.height * 0.4,
    width: window.width,

  },

  propertyImageStyle: {
    height: window.height * 0.4,
    width: window.width
  },

  propertyTitleViewStyle: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width
  },

  propertyTitleTextStyle: {

    color: Colors.PROPERTY_TITLE_COLOR,
    fontWeight: '600',
    fontSize: 18
  },

  propetySubTitleViewStyle: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width - 30
  },

  propertySubTitleTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 14
  },

  propertyInfoContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 20,
    paddingBottom: 20
  },

  propertyInfoSubViewContainer: {
    flexDirection: 'row'
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

  userImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  noticeBoardContainerViewStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 30,
  },
  propertyListViewContainerStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },

  noticeBoardTitleTextStyle: {
    color: Colors.NOTICE_BOARD_TEXT_TITLE_COLOR,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21
  },

  noticeBoardListViewContainer: {
    marginTop: 20
  },

  noticeBoardItemContainerView: {
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 20
  },

  scrollViewStyle: {
    paddingBottom: window.height * 0.3
  },
  tabContainerScrollViewStyle: {
    marginRight: 20,
    paddingRight: 20,
  },
  tabContainerStyle: {
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderTopColor: Colors.TRANSPARENT,
    borderBottomColor: Colors.TRANSLUCENT_BLACK,
    borderLeftColor: Colors.TRANSPARENT,
    borderRightColor: Colors.TRANSPARENT,
    borderWidth: 1,
    marginTop: 0,
    marginBottom: 15,
  },
  tabTextViewContainerStyle: {
    height: 48,
    justifyContent: 'center'
  },
  tabTextViewStyle: {
    height: 47, justifyContent: 'center', alignItems: 'center'
  },
  tabLabelTextStyle: {

    color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 20,
  },
  tabLabelDiselectTextStyle: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 20,
  },
  tabIndicatorStyle: {
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    height: 3,
    marginLeft: 20,
    marginBottom: 0,
    marginTop: 10,
  },
  tabWhiteIndicatorStyle: {
    // backgroundColor: Colors.TRANSLUCENT,
    height: 3,
    marginLeft: 20,
    marginBottom: 0,
    marginTop: 10,
  },


  listContainerStyle: {
    marginTop: 15,
  },


  refineResultContainerStyle: {
    flexDirection: 'row',
    height: 60,
    marginBottom: 15,
    alignItems: 'center'
  },
  refineResultArrowStyle: {
    marginLeft: 15,
    marginTop: 20,
  },
  refineResultArrowUpStyle: {
    marginLeft: 15,
    marginTop: 25,
    transform: [{ rotate: '180deg' }],
  },


  dropDownViewStyle: {
    height: 38,
    width: 165,
    marginTop: 15,
    marginLeft: 20,
    paddingLeft: 15,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
    borderRadius: 4,
    backgroundColor: Colors.DROP_DOWN_BACKGROUND_COLOR,
  },

  refineResultTextStyle: {
    marginTop: 20,
    marginLeft: 20,
    height: 17,
    color: Colors.REFINE_RESULT_TEXT_COLOR,
    fontSize: 14,
  },
  refineResultBottomBarStyle: {
    backgroundColor: Colors.REFINE_RESULT_TEXT_COLOR,
    marginLeft: 20,
    height: 1,
  },

  filterViewTextStyle: {
    marginTop: 20,
    marginLeft: 25,
    height: 17,
    color: Colors.FILTER_TEXT_VIEW_COLOR,
    fontSize: 14,

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

  userListImageStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  listHeaderContainer: {
    width: window.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: Colors.WHITE,
  },

  statusContainerStyle: {
    width: 90,
  },

  statusCompletedViewStyle: {
    borderRadius: 9,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_COMPLETED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },

  statusAcceptedViewStyle: {
    borderRadius: 9,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_ACCEPTED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusSentViewStyle: {
    borderRadius: 9,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_SENT_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusOverDueViewStyle: {
    borderRadius: 9,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_OVER_DUE_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusBookViewStyle: {
    borderRadius: 9,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_BOOKED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },

  statusViewTextStyle: {
    color: Colors.WHITE,
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  dollarTextStyle: {
    color: Colors.TAG_VIEW_TEXT_COLOR,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  daysTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 14,
    textAlign: 'right',
  },
  detailContainerStyle: {
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: Colors.WHITE,
  },
  detailTitleContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: Colors.WHITE,
  },
  requestByTenantDetailTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 8,
  },
  requestByTenantDetailTextStyle: {
    color: Colors.MAINTENANCE_CATEGORY_COLOR,
    fontSize: 14,
    textAlign: 'left',
    marginTop: 10,
  },
  detailTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',

    marginBottom: 8,
  },
  detailTextStyle: {
    color: Colors.MAINTENANCE_CATEGORY_COLOR,
    fontSize: 14,
    textAlign: 'center',
  },
  notificatioImageStyle: {
    marginLeft: 5,
    marginBottom: 5,
  },
  byTenantListContainerStyle: {
    flexDirection: 'row',
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 25,
  },
  maintenanceThreadImageViewContainerStyle: {
    marginLeft: 25,
  },
  imageContainerStyle: {
    height: 50,
    width: 53,
    justifyContent: 'center',
  },
  messageViewContainerStyle: {
    marginLeft: 20,
    marginRight: 50,
    marginTop: -5,
  },
  maintenanceThreadpropertyIdTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    marginTop: 10,
    fontSize: 14
  },

  roundedBlueProceedButtonStyle: {
    borderRadius: 20,
    height: 18,
    // paddingTop:3,
    // paddingBottom:3,
    // paddingLeft:5,
    margin: 8,
    // paddingRight:5,
    width: 70,
    zIndex: 9999,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

  },
  proceedButtonTextStyle: {
    // width: 164,
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: Colors.TRANSPARENT,
    // lineHeight: 16,
    textAlign: 'center',
    marginLeft: '2%',
    marginRight: '2%',
  },
  emptyUserMessageListImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.USER_BACKGROUN_COLOR
  },
  initialTextStyle: {
    fontSize: 16,
    color: Colors.WHITE
  },
});