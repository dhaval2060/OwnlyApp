import React from 'react';
import { View, Text ,Platform} from 'react-native';


const CardViewWithLowMargin = (props) => {
return (
  <View style={styles.containerStyles}>
  {props.children}
  </View>
);
};

const styles = {

  containerStyles: {
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor:'#FFFFFF',
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: (Platform.OS === 'ios') ? 1 : 0,
    marginTop:0.2
  }

};

export { CardViewWithLowMargin };
