import React from 'react';
import { View, Text ,Platform,Modal,Dimensions,TouchableOpacity} from 'react-native';
const window = Dimensions.get('window');

const PopupView = (props) => {

  return (

      <TouchableOpacity >
        <Modal transparent>
          <View style={{flex:1, justifyContent: 'center',
              alignItems: 'center',}}>
              <View style={styles.containerStyles}>
                {props.children}
              </View>
          </View>
        </Modal>
      </TouchableOpacity>

  );

};

const styles = {

  containerStyles: {
    position: 'absolute',
    top: ((window.height * 0.55) - ((window.width * 0.4) / 2)),
    right: 10,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor:'#FFFFFF',
    shadowColor: '#E9E9E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: (Platform.OS === 'ios') ? 1 : 0,
    marginTop:10
  }

};

export { PopupView };
