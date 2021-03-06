import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({

    settingContainerStyle: {
        width: null,
        height: null,
        flex: 1,
        backgroundColor: Colors.SETTING_SCREEN_BG_COLOR
    },
    tabContainerScrollViewStyle: {
        marginRight: 20,
        paddingRight: 20,
    },
    tabContainerStyle: {
        backgroundColor: Colors.WHITE,
        flexDirection: 'row',
        height: 50,
        paddingRight:100,
        alignItems: 'center',
        borderTopColor: Colors.TRANSPARENT,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderLeftColor: Colors.TRANSPARENT,
        borderRightColor: Colors.TRANSPARENT,
        borderWidth: 1,
        marginTop: 0,
        // marginBottom: 15,
    },
    tabTextViewContainerStyle: {
        height: 48,
        justifyContent: 'center'
    },
    tabTextViewStyle: {
        height: 50, justifyContent: 'center', alignItems: 'center',
        paddingLeft:10,paddingRight:20,
    },
    tabLabelTextStyle: {

        color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        fontSize: 15,
        fontWeight: '600',
        paddingLeft: 20,
    },
    tabLabelDiselectTextStyle: {
        color: Colors.BLACK,
        fontSize: 15,
        fontWeight: '600',
        paddingLeft: 20,
    },
    tabIndicatorStyle: {
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        height: 3,
        marginLeft: 20,
        marginBottom: 0,
        marginTop: 10,
    },
    tabWhiteIndicatorStyle: {
        backgroundColor: 'transparent',
        height: 3,
        marginLeft: 20,
        marginBottom: 0,
        marginTop: 10,
    },
    profileContainer: {
        padding: 20,
        alignItems: 'center',
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',

    },
    userImageStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editTextContainer: {
        height: 26,
        width: 120,
        backgroundColor: Colors.EDIT_PROFILE_BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        position: 'absolute',
        bottom: 0,
    },
    editTextStyle: {
        fontSize: 9,
        color: Colors.WHITE,
        textAlign: 'center',
        width: 100,
        position: 'absolute',
        bottom: 0,
        paddingTop: 10,
        paddingBottom: 5,
    },
    userNameContainerStyle: {
        flexDirection: 'row',
    },
    userNameTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    editImageStyle: {
        marginLeft: 5,
    },
    emailTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        textAlign: 'center',
    },
    bottomViewStyle: {
        height: 60,
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: Colors.TRANSLUCENT_BLACK,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderLeftColor: Colors.TRANSPARENT,
        borderRightColor: Colors.TRANSPARENT,
        borderWidth: 1,
    },
    roundedBlueSaveButtonStyle: {
        borderRadius: 100,
        height: 40,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        justifyContent: 'center',
        marginLeft: 5,
    },
    saveButtonTextStyle: {
        height: 16,
        width: window.width * 0.7,
        color: Colors.WHITE,
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 16,
        textAlign: 'center',
    },
    tabContainerScrollViewStyle: {
        marginRight: 20,
        paddingRight: 20,
    },
});