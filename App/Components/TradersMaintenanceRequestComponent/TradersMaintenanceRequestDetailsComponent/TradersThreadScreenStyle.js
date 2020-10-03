import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({
    viewLineStyle: {
        position: 'absolute',
        top: 15,
        justifyContent: 'center',
        backgroundColor: Colors.ADD_PROPERTY_DOT_COLOR,
        width: window.width,
        height: 3,
    },
    viewContainerStyle: {
        height: 24,
        width: window.width * 0.25,
        margin: 5,
        padding: 5,
        alignItems: 'center',

        borderRadius: 12,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND
    },
    viewtextStyle: {
        color: Colors.WHITE,
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        backgroundColor: Colors.TRANSPARENT
    }, tagViewContainer: {
        flex: 1,
        alignItems: 'center',
    },

    inputContainerStyle: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: Colors.TRANSPARENT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    searchViewStyle: {
        flexDirection: 'row',
        width: window.width * 0.75,
        height: 38,
        borderWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        borderRadius: 4,
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchImageStyle: {
        marginLeft: 5,
        marginRight:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchTextInputStyle: {
        flex: 1,
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 14,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    sendImageStyle: {
        marginLeft: 10,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});