import {
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '../../../Constants/Colors';
export default StyleSheet.create({


  textStyle: {
    color: Colors.WHITE,
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 14,
    fontWeight: '500',

  },
  passwordVisibiltyViewStyle: {
    position: 'absolute',
    right: 10,
    paddingLeft: 10,
    paddingBottom: 30,
    paddingTop: 10,
    marginTop:5,
    marginLeft:5,
    marginBottom:5,
    bottom: 20
  },

  forgotTextStyle: {
    color: Colors.FORGOT_TEXT_COLOR,
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10
  },


  scrollViewContainerStyle: {
    paddingBottom: 60
  },

  signedInCheckBoxViewStyle: {
    marginTop: 38,
    width: 150,
  },



});