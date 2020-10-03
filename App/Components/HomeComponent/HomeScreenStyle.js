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
  PropertyPlaceHolerTextStyle: {
    color: Colors.BLACK,
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '300'
  },

  propertyImageViewStyle: {
    height: window.height * 0.3,
    width: window.width - 30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden'
  },
  noticePropertyImageViewStyle: {
    height: window.height * 0.3,
    width: window.width,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden'
  },
  propertyImageStyle: {
    height: window.height * 0.3,
    width: window.width - 30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },


  noticePropertyImageStyle: {
    height: window.height * 0.3,
    width: window.width
  },

  propertyTitleViewStyle: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width - 30
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

  maintenanceThreadpropertyIdTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    marginTop: 5,
    fontSize: 14
  },

  propertyInfoContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
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
    height: 50,
    width: 50,
    borderRadius: 25
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

  propertySubTitleTextStyle: {

    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 14,
    marginTop: 12,
    lineHeight: 17

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
    //paddingBottom: window.height * 0.3
  },
  likeImageViewStyle: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  statisticsViewContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  statisticsLabelTextStyle: {
    textAlign: 'left',
    flex: 1,
    color: Colors.LIGHT_GRAY_TEXT_COLOR,
    fontSize: 20,
  },
  statisticsTextStyle: {
    textAlign: 'right',
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 20,
    flex: 1,
    fontWeight: 'bold',
  },
  listContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  msgListContainerStyle: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,

  },
  imageContainerStyle: {
    height: 50,
    width: 53,
    marginTop: 10,
    justifyContent: 'center',
  },
  unreadMsgimageContainerStyle: {
    height: 50,
    width: 53,
    justifyContent: 'center',
  },
  imageViewContainerStyle: {
    justifyContent: 'center',
    marginLeft: 50,
  },
  messageViewContainerStyle: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 50,
    marginTop: -5,
  },
  statusViewStyle: {
    position: 'absolute',
    borderRadius: 100,
    bottom: 0,
    right: 0,
    height: 18,
    borderColor: Colors.WHITE,
    borderWidth: 2,
    width: 18,
    backgroundColor: Colors.STAUS_RED_COLOR,
  },
  onLineStatusViewStyle: {
    position: 'absolute',
    borderRadius: 100,
    bottom: 0,
    right: 0,
    height: 18,
    borderColor: Colors.WHITE,
    borderWidth: 2,
    width: 18,
    backgroundColor: Colors.STATUS_GREEN_COLOR,
  },

  detailTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '600',
  },

  threadDetailTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    width: window.width * 0.7,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '600',
  },
  messageTimeTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 12,
    textAlign: 'right',
  },
  unreadMsgTimeTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 12,
    marginRight: 10,
    marginTop: 10,
    textAlign: 'right',
  },
  detailTextStyle: {
    color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
    fontSize: 14,
    marginTop: 7,
    textAlign: 'left',
  },
  maintenanceListHeaderContainer: {
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
    marginRight: 10,
  },
  maintenanceStatusViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_COMPLETED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5,
    borderColor: Colors.WHITE,
    borderWidth: 2,
  },
  statusViewTextStyle: {
    color: Colors.WHITE,
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  maintenaceUserImageStyle: {
    height: 66,
    width: 66,
    borderRadius: 33,
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
  maintenanceDetailTitleTextStyle: {
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  notificatioImageStyle: {
    marginLeft: 5,
    marginBottom: 5,
  },
  maintenanceDetailTextStyle: {
    color: Colors.MAINTENANCE_CATEGORY_COLOR,
    fontSize: 14,
    textAlign: 'center',
  },
  tabContainerStyle: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderTopColor: Colors.TRANSLUCENT_BLACK,
    borderBottomColor: Colors.TRANSLUCENT_BLACK,
    borderWidth: 0,
    marginTop: 0,
  },
  tabContainerScrollViewStyle: {
    marginRight: 20,
    paddingRight: 20,
  },
  maintenanceThreadImageViewContainerStyle: {
    marginLeft: 50,
  },

  tabLabelTextStyle: {
    color: Colors.ACTIVE_THREAD_TEXT_COLOR,
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 15,
  },
  tabLabelDiselectTextStyle: {
    color: Colors.LIGHT_GRAY_TEXT_COLOR,
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 15,
  },

  statusCompletedViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_COMPLETED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },

  statusAcceptedViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_ACCEPTED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusSentViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_SENT_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusOverDueViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_OVER_DUE_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusBookViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_BOOKED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  topCoverImageContainer: {
    height: window.height * 0.3,
    backgroundColor: Colors.LISTING_BG_COLOR,
    width: window.width,
  },

  emptyMaintenaceUserImageStyle: {
    height: 66,
    width: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
  },
  emptyUserMessageListImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
  },
  initialTextStyle: {
    fontSize: 16,
    color: Colors.WHITE
  },

  //calendar
  modalContainer: { height: window.height, width: window.width },
  modalContainerStyles: {
    width: window.width * 0.8,
    height: window.height * 0.25,
    position: 'absolute',
    top: window.height * 0.3,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 15,
    elevation: (Platform.OS === 'ios') ? 1 : 0,
    marginTop: 10
  },
  roundedGrayButtonStyle: {

    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.ADD_PROPERTY_DOT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,

  },
  grayButtonTextStyle: {

    height: 16,
    width: window.width * 0.32,
    color: Colors.APPROVE_GRAY_TEXT_COLOR,
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',

  },
  roundedTransparentButtonStyle: {

    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEEF6',
    marginRight: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  grayButtonTextStyle: {

    height: 16,
    width: window.width * 0.32,
    color: Colors.APPROVE_GRAY_TEXT_COLOR,
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',

  },

  redTextStyle: {

    height: 16,
    width: window.width * 0.32,
    color: Colors.LEASE_RZENUAL_TEXT_COLOR,
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',

  },
  noticeBoardPostCountContainer: {
    flexDirection: 'row',

    marginLeft: 20,
    marginRight: 20,
    marginTop: 20, marginBottom: 20
  },
  draftStatusViewTextStyle: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },

  draftStatusContainerStyle: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    top: 10,
    right: 10,
    height: 38,
    borderRadius: 3,
    backgroundColor: Colors.TRANSPARENT,
  },
});