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
    height: 40,
    width: 40,
    borderRadius: 20
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

  
  listContainerStyle: {
    marginTop: 15,
  },
  tabTextViewStyle: {
    height: 47, justifyContent: 'center', alignItems: 'center'
  },
  

  refineResultContainerStyle: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center'
  },
  refineResultArrowStyle: {
    marginLeft: 15,
    marginTop: 20,
  },

  dropDownViewStyle: {
    height: 38,
    width: 165,
    margin: 20,
    paddingLeft: 10,
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

  disputesImageViewStyle: {
    height: window.height * 0.4,
    width: window.width,

  },

  disputesTitleViewStyle: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width
  },

  disputesTitleTextStyle: {

    color: Colors.PROPERTY_TITLE_COLOR,
    fontWeight: '600',
    fontSize: 18
  },

  disputesSubTitleViewStyle: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: window.width - 30
  },

  disputesSubTitleTextStyle: {
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 14
  },

  disputesInfoContainerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 20,
    paddingBottom: 20
  },
  listMainContainerStyle: {
    marginTop: 15,
    backgroundColor: Colors.WHITE,

  },
  likeImageViewStyle: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
  dateContainerStyle: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    bottom: 22,
    right: 0,
    height: 38,
    borderRadius: 3,
    backgroundColor: Colors.WHITE,
  },
  dateImageStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 10,
  },
  dateTextStyle: {
    marginRight: 15,
    color: Colors.DATE_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  refineResultArrowUpStyle: {
    marginLeft: 15,
    marginTop: 25,
    transform: [{ rotate: '180deg' }],
  },

  PropertyPlaceHolerTextStyle: {
    color: Colors.BLACK,
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '300'
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
  statusBookViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_BOOKED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },

  statusContainerStyle: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    top: 10,
    left: 10,
    height: 38,
    borderRadius: 3,
    backgroundColor: Colors.TRANSPARENT,
  },
  statusViewTextStyle: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
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
});