import {
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '../../../Constants/Colors';
export default StyleSheet.create({

  signUpTitleStyle: {
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: '500',
    marginTop:35,
    marginBottom:28,
  },

  agreementTextStyle: {
    
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 14,
    color: Colors.WHITE,
    paddingLeft: 15,
    marginTop: 22,
    lineHeight: 20,
  },

  signUpUserAgreementViewStyle: {
    flexDirection:'row',
    alignItems:'center',
     marginTop:20,
  },
  
  scrollViewContainerStyle:{
    paddingBottom:120
  },
  
  signUpContainer: {
    flex: 1,
  },

});