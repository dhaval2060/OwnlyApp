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
    margin: 20,
    paddingLeft: 10,
    marginBottom: 15,
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

  listItemContainer: {
    width: window.width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,
  },

  listImageContainerStyle: {
    width: 120,
    height: 120,
    marginTop: 20,
  },

  listImageStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  statusViewStyle: {
    position: 'absolute',
    borderRadius: 100,
    bottom: 5,
    right: 10,
    height: 21,
    width: 21,
    backgroundColor: Colors.STATUS_GREEN_COLOR,
  },
  listTitleTextStyle: {
    height: 21,
    color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 21,
    marginTop: 10,
  },
  listReviewTextStyle: {
    color: Colors.FILTER_TEXT_VIEW_COLOR,
    fontSize: 14,
    lineHeight: 17,
    marginTop: 10,
  },
  roundedBlueMessageButtonStyle: {
    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginBottom:25,
  },
  messageButtonTextStyle: {
    height: 16,
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
    textAlign: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  listTagViewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listTagViewMainContainer: {
    marginTop: 20,
    marginBottom: 15,
  },

  tagViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.TAG_VIEW_COLOR,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5,
  },
  tagViewTextStyle: {
    color: Colors.TAG_VIEW_TEXT_COLOR,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    paddingTop:5,
    paddingBottom:5
  },
  likeImageViewStyle:{
    position:'absolute',
    top:20,
    left:20,
  },
  emptyUserListImageStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Colors.USER_BACKGROUN_COLOR
  },
  onLineStatusViewStyle: {
    position: 'absolute',
    borderRadius: 100,
    bottom: 5,
    right: 10,
    height: 21,
    width: 21,
    borderColor:Colors.WHITE,
    borderWidth:1,
    backgroundColor: Colors.STATUS_GREEN_COLOR,
  },
  
  statusViewStyle: {
    position: 'absolute',
    borderRadius: 100,
    bottom: 5,
    right: 10,
    height: 21,
    width: 21,
    borderColor:Colors.WHITE,
    borderWidth:1,
    backgroundColor: Colors.STAUS_RED_COLOR,
  },

});