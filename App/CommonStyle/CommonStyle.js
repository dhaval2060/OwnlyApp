import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Colors from '../Constants/Colors';
const window = Dimensions.get('window');
export default StyleSheet.create({

  mainContainer: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: null,
    height: null,

  },
  container: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25,
  },

  logoViewStyle: {
    marginTop: 80,
    justifyContent: 'flex-start',
  },

  buttonViewStyle: {
    paddingTop: 20,
    alignSelf: 'stretch',
  },

  welcomeTitleStyle: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 28,
    color: '#FFFFFF'
  },
  
  welcomeMessageStyle: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 27,
  },

  buttonTextStyle: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'center',
    backgroundColor: Colors.TRANSPARENT,
  },

  roundedTransparentButtonStyle: {
    borderRadius: 100,
    height: 50,
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginTop: 50,
  },

  roundedBlueButtonStyle: {
    borderRadius: 100,
    height: 50,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginTop: 25,
  },

  transparentButtonStyle: {
    height: 55,
    borderRadius: 4,
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginTop: 9,
    alignItems: 'center',
  },

  skyBlueButtonStyle: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
    justifyContent: 'center',
    marginTop: 25,
  },

  allRightReservedTextStyle: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: Colors.TRANSPARENT,
  },
  allRightReservedViewStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: Colors.TRANSPARENT,
  },

  resetPasswordTitleStyle: {
    marginTop: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 20,
    color: '#FFFFFF'
  },

  resetPasswordMessageStyle: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 24,
  },

  blackTransparentViewStyle: {
    height: (window.width == 320) ? 40 : 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSLUCENT_BLACK

  },
  navigationBarStyle: {
    backgroundColor: Colors.TRANSPARENT,
    borderBottomColor: Colors.TRANSPARENT
  },
  navigationBarBackButtonStyle: {
    tintColor: Colors.WHITE,
  },
  navigationBarTitleStyle: {
    color: Colors.WHITE,
    fontSize: 16,
  },

  navigationBarWhiteStyle: {
    backgroundColor: Colors.WHITE,
    borderBottomColor: Colors.WHITE
  },
  navigationBarTitleBlackStyle: {
    color: Colors.BLACK,
    fontSize: 16,
  },
  navigationBarBackButtonBlackStyle: {
    tintColor: Colors.BLACK,
  },
  textInputStyle: {
    height: 21,
    color: Colors.WHITE,
    backgroundColor: Colors.TRANSPARENT,
    borderBottomColor: Colors.WHITE,
    borderColor: Colors.WHITE,
    borderBottomWidth: 0.5,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '500',
    marginTop: 10
  },

  searchTextInputStyle: {
    height: 42,
    borderColor: Colors.SEARCH_TEXT_INPUT_BORDER_COLOR,
    color: Colors.BLACK,
    paddingLeft: 20,
    paddingRight: (Platform.OS == 'android') ? 40 : 35,
    fontSize: 14,
    marginTop: 10,
    borderRadius: 2,
    borderWidth: 1
  },

  errorWhiteText: {
    color: 'white',
    fontSize: 14,
    textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 1, textShadowColor: Colors.TRANSLUCENT_BLACK_TEXT_SHADOW,
    textAlign: 'left',
    paddingTop: 5,
    backgroundColor: Colors.TRANSPARENT,

  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'left',
    paddingTop: 5,
    paddingBottom:10,
    backgroundColor: Colors.TRANSPARENT,

  },
  titleCenter: {
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    marginTop: (Platform.OS === 'ios') ? 30 : 20,
  },

  profileErrorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'left',
    paddingTop: 5,
    backgroundColor: Colors.TRANSPARENT,
    marginLeft: 10,
  },
  navigationBarRightUpdateButtonStyle: {
    color: Colors.BLACK,
    fontSize: 14,
  },
  circles: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    width: window.width,
    height: window.height
  },
  bottomTabIcons: { width: 25, height: 25 },
  bottomTabIcons1: { width: 25, height: 25 },

  backButtonStyle: {
    height: 50,
    width: 50,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 100,
  },
  navBarMainView:{
    width:null,
    height:100,
    resizeMode:'stretch'
  },
  navBarTitleTextView:{
    position:'absolute',
    left:20,
    bottom:25,
    fontSize:24,
    backgroundColor:'transparent',
    fontWeight:'600',
    color:'white'
  },

  flatListStyle: {
    paddingBottom: 70,
  },
  listMainContainerStyle: {
    width: null,
    height: null,
    flex: 1,
    backgroundColor:Colors.SETTING_SCREEN_BG_COLOR
  },
  userImageViewContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyUserImageStyle: {
    height: window.width * 0.36,
    width: window.width * 0.36,
    borderRadius: window.width * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
  },
  initialTextStyle: {
    fontSize: 28,
    color: Colors.WHITE
  },

  navRightImageView:{

    position:'absolute',
    paddingLeft:10,
    paddingRight:10,
    right:20,
    bottom:25,
    
  },
  
  navPlusImageView:{

    position:'absolute',
    paddingLeft:10,
    paddingRight:10,
    right:10,
    bottom:15,
    
  },

  navBackRightImageView:{

    position:'absolute',
    paddingLeft:10,
    paddingRight:10,
    right:70,
    bottom:25,
    
  },

});