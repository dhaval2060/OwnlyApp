import {
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '../../Constants/Colors';
export default StyleSheet.create({

  drawerContentView: {
    flex: 1,
    backgroundColor: Colors.DRAWER_BACKGROUND_COLOR,
  },
  headerViewStyle: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 25
  },
  searchViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchImageStyle: {
    marginRight: 20
  },
  userRoleTextStyle:{
    color: 'white',
    fontSize: 18,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 5,
  },
  userImageViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },
  userImageStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userNameTextStyle: {
    height: 23,
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 23,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 3,

  },
  userEmailTextStyle: {
    color: '#7F829F',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 3,
  },
  roundedBlueSwitchButtonStyle: {
    width: 166,
    borderRadius: 100,
    height: 40,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginTop: 17,
  },

  swithButtonTextStyle: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 25,
  },

  drawerMenuItemViewStyle: {
    paddingLeft: 25,
    paddingRight: 25,
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
  },

  drawerItemText:
    {
      color: Colors.WHITE, fontSize: 16, fontWeight: '500'
    },

  drawerItemViewContainer: {
    marginTop: 50
  },

  drawerItemTextViewStyle: {
    marginLeft: 30
  },
  selectedMenuItemBackgroundStyle: {
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
  },
  menuItemBackgroundStyle: {
    backgroundColor: Colors.TRANSPARENT,
  },
  noticeBoardContainerViewStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 30,
    paddingBottom: window.height * 0.3,
  },
  managePropertyTextStyle: {
    color: Colors.LIGHT_GRAY_TEXT_COLOR,
    fontSize: 20,
    paddingLeft: 5,
    fontWeight: '500'
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
  scrollViewStyle: {
    flex:1,
    paddingBottom:80,

  },
});