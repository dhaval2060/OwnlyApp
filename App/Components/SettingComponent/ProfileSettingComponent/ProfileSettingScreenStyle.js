import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({

    settingContainerStyle: {
        width: window.width,
        height: window.height,
        flex: 1,

    },

    profileContainer: {
        padding: 20,
        alignItems: 'center',
    },
    imageContainer: {
        width: 110,
        height: 110,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 10
    },
    userImageStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editTextContainer: {
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,

        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: Colors.TRANSPARENT,
        bottom: 0,
    },

    editTextStyle: {
        fontSize: 9,
        color: Colors.WHITE,
        textAlign: 'center',
        width: 100,
        position: 'absolute',
        bottom: 0,
        padding: 5,
        backgroundColor: Colors.BLACK,
        paddingBottom: 5,
    },

    userNameContainerStyle: {
        flexDirection: 'row',
        marginTop: 10,
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
        paddingBottom: 5
    },
    editProfileTextStyle:
    {
        color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        fontSize: 12, fontWeight: '500',
        textAlign: 'center', alignSelf: 'center',
        padding: 5

    },

    editProfileOuterView:
    {
        borderColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        borderWidth: 1.5,
        borderRadius: 5


    },

    bottomViewStyle: {
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
        height: 72,
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
        marginLeft: 15,
        marginRight: 15,
        textAlign: 'center',
    },
    inputDescriptionTextStyle: {
        height: 170,
        borderWidth: 1,
        textAlign: 'left',
        textAlignVertical: 'top',
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 15,
        borderColor: Colors.FILTER_TEXT_VIEW_COLOR,
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: Colors.WHITE,
    },
    labelStyle: {
        height: 17,
        color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 17,
    },
    labelTextStyle: {
        height: 16,
        color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 16,
        marginBottom: 25,
    },
    dropDownViewStyle: {
        height: 38,
        marginTop: 10,
        paddingLeft: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        borderRadius: 4,
        backgroundColor: Colors.WHITE,
    },
    inputTextStyle: {
        height: 38,
        borderWidth: 1,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 15,
        borderColor: Colors.FILTER_TEXT_VIEW_COLOR,
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: Colors.WHITE,
    },
    scrollViewContainerStyle: {
        paddingBottom: 100
    },
    profileTopContainerStyle: {
        alignItems: 'center', marginTop: 20, padding: 20, backgroundColor: Colors.WHITE,
        borderTopColor: Colors.TRANSLUCENT_BLACK,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderLeftColor: Colors.TRANSPARENT,
        borderRightColor: Colors.TRANSPARENT,
        borderWidth: 1,
    },
    profileBottomContainerStyle: {
        justifyContent: 'center', marginTop: 20, padding: 20, backgroundColor: Colors.WHITE,
        borderTopColor: Colors.TRANSLUCENT_BLACK,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderLeftColor: Colors.TRANSPARENT,
        borderRightColor: Colors.TRANSPARENT,
        borderWidth: 1,
    },

    firstnameInputTextStyle: {
        height: 35,
        width: window.width * 0.4,
        borderWidth: 1,
        margin: 5,
        paddingLeft: 5,
        borderColor: Colors.FILTER_TEXT_VIEW_COLOR,
        borderRadius: 4,
        fontSize: 14,
        backgroundColor: Colors.WHITE,
    },
    emptyUserImageStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
    },
    sendRequestTextStyle: {
        height: 16,
        width: window.width * 0.2,
        color: Colors.WHITE,
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 16,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
    },
    roundedBlueSendButtonStyle: {
        borderRadius: 100,
        height: 30,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        justifyContent: 'center',
        marginLeft: 5,
        marginTop: 10,
    },
    sendContainerStyle: {
        width: window.width * 0.65,
    },
    sendContainerViewStyle: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 },
    editImageView: {
        height: 20,
        width: 80,
        position: 'absolute',
        // borderRadius: 15,
        // paddingLeft: 10,
        // paddingRight: 10,
        alignItems: 'center',
        backgroundColor: Colors.TRANSLUCENT_BLACK_TEXT_SHADOW,
        // right: 5,
        bottom: 0,

    },
});