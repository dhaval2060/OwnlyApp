import {
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '../../Constants/Colors';
export default StyleSheet.create({

  registrationContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 30,
   
  },
  regisrtationOptionActiveTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 20,
    marginRight: 45,
    color: Colors.WHITE
  },
  regisrtationOptionInActiveTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TRANSPARENT,
    fontSize: 20,
    marginRight: 45,
    color: Colors.WHITE_INACTIVE
  },
  backButtoncontainer: {
    marginTop: 60,
    paddingLeft: 25,
    paddingRight: 25,
  },
  backButtonStyle: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 100,
  },

});