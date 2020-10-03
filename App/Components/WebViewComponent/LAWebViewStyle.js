import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';

const window = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({

  container: {
    flex: 1,
    width: null,
    height: null,    
    justifyContent: 'center',
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
    width: null,
    height: null
  },

  titleLogoCenter: {
    width: 25,
    height: 25,
  },

  titleCenter: {
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    marginTop: (Platform.OS === 'ios') ? 30 : 15,
  },

});