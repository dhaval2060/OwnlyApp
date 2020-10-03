import {
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '../../../Constants/Colors';
export default StyleSheet.create({


  userTypeTitleStyle: {
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: '500',
    marginTop:55,
    marginBottom:28,
  },  

  userTypeTitleViewStyle: {
    paddingLeft: 25,
  },

  userTypeTextStyle: {
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 14,
    color: Colors.WHITE,
    paddingLeft: 15,
  },

  transparentViewStyle: {
  
    height: 55,
    borderRadius: 4,
    backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
    marginTop: 9,
    paddingLeft:25,
    alignItems:'center',
   
  },
  scrollViewContainerStyle:{
    paddingBottom:100,
  }

});