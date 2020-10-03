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
    borderRadius: 4
  },
  tileImageStyle: {
    height: 40,
    width: 40,
    borderRadius: 4
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
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 1,
    borderTopColor: Colors.TRANSLUCENT_BLACK,
    borderBottomColor: Colors.TRANSPARENT,
    borderLeftColor: Colors.TRANSPARENT,
    borderRightColor: Colors.TRANSPARENT,
    borderWidth: 1,
  },

  refineResultContainerStyle: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center'
  },

  tileViewContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },

  tileViewImageContainerStyle: {
    width: window.width * 0.65,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  refineResultArrowStyle: {
    marginLeft: 15,
    marginTop: 20,
  },

  tileImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },

  dropDownViewStyle: {
    height: 38,
    width: 165,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
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
  imageContainerStyle: {

    height: 40,
    width: 45,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 15,
  },
  detailTitleContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitleTextStyle: {
    width: window.width - 150,
    color: Colors.PROPERTY_TITLE_COLOR,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '600',
  },
  categoryTextStyle: {
    width: 215,
    color: Colors.PROPERTY_SUB_TITLE_COLOR,
    fontSize: 14,
    marginTop: 6,
  },
  listImageStyle: {
    marginRight: 20,
  },
  tileImageContainerStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: window.width * 0.45,
    marginTop: 1,
    paddingTop: 25,
    marginRight: 5,
  },
  tileImageGridStyle: {
    width: window.width * 0.40,
    height: window.width * 0.40,
    borderRadius: 8
  },
  tileTextStyle: {
    width: window.width * 0.35,
    color: Colors.BLACK,
    fontSize: 14,
    paddingTop: 15,
    paddingLeft: 5,
  },
  tileListImageStyle: {
    marginRight: 5,

  },

  tileListContainerStyle: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 15,

  },

  likeImageViewStyle: {
    position: 'absolute',
    top: 35,
    left: 20,
  },
  refineResultArrowUpStyle: {
    marginLeft: 15,
    marginTop: 25,
    transform: [{ rotate: '180deg' }],
  },

  filePlaceHolerTextStyle: {
    color: Colors.BLACK,
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop:100,
    fontWeight: '300'
  },

});