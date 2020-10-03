import { Dimensions, Platform } from 'react-native';
import { Header } from 'react-navigation'
import { scale } from './HelperFunctions/functions';

const { width, height } = Dimensions.get('window');

let screenHeight = width < height ? height : width
let screenWidth = width < height ? width : height

const Matrics = {

  ScaleValue: (val) => {
    return scale(val)
  }
};

export default Matrics;
