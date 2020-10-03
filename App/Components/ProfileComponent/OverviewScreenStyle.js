import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({

    titleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 18, fontWeight: '600',
        marginTop: 30,
        marginLeft: 20,
    },
    detailsTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 21,
        margin: 20,
    },
    agencyReviewContainerStyle: {
        marginTop: 30,
        flexDirection: 'row',

    },
    agencyImageStyle: {
        height: 60,
        width: 60,
        marginLeft: 20,
    },
    agencyTitleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 18,
    },
    reviewContainerStyle: {
        marginLeft: 20,
    },
    reviewDetailsTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        marginLeft: 18,
    },
    overviewImageStyle: {
        height: window.height * 0.4,
        width: window.width
    },
    overviewImageListItemStyle: {
        height: window.width * 0.4 - 50,
        width: window.width * 0.4,
        marginRight: 10
    },
    overviewPropertyListImageStyle: {
        height: window.width * 0.4 - 50,
        width: window.width * 0.4,
        marginRight: 10
    },
    selectedImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        height: window.width * 0.4 - 50,
        width: window.width * 0.4,
        marginRight: 10,
        backgroundColor: Colors.TRANSLUCENT_BLACK_DARK,
        borderWidth: 0,
        borderColor: Colors.SKY_BLUE_BUTTON_BACKGROUND

    },



    listItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        backgroundColor: Colors.WHITE,
    },
    listImageContainerStyle: {
        width: 120,
        height: 120,
        marginTop: 20,
    },

    listImageStyle: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    onLineStatusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: 5,
        right: 10,
        height: 21,
        width: 21,
        borderColor: Colors.WHITE,
        borderWidth: 1,
        backgroundColor: Colors.STATUS_GREEN_COLOR,
    },

    statusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: 5,
        right: 10,
        height: 21,
        width: 21,
        borderColor: Colors.WHITE,
        borderWidth: 1,
        backgroundColor: Colors.STAUS_RED_COLOR,
    },
    listTitleTextStyle: {
        height: 21,
        color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 21,
        marginTop: 10,
    },
    listReviewTextStyle: {
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 14,
        lineHeight: 17,
        marginTop: 5,
    },
    roundedBlueMessageButtonStyle: {
        borderRadius: 100,
        height: 40,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        justifyContent: 'center',
        marginTop: 15,
    },
    messageButtonTextStyle: {
        height: 16,
        color: Colors.WHITE,
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 16,
        textAlign: 'center',
        marginLeft: 40,
        marginRight: 40,
    },
    listTagViewContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    listTagViewMainContainer: {
        marginTop: 20,
        marginBottom: 15,
    },

    tagViewStyle: {
        borderRadius: 100,
        height: 24,
        backgroundColor: Colors.TAG_VIEW_COLOR,
        justifyContent: 'center',
        marginRight: 5,
        marginTop: 5
    },
    tagViewTextStyle: {
        color: Colors.TAG_VIEW_TEXT_COLOR,
        fontSize: 9,
        fontWeight: '500',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    emptyMaintenaceUserImageStyle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
    },
    initialTextStyle: {
        fontSize: 16,
        color: Colors.WHITE
    },
    emptyLogoImageStyle: {
        height: 30,
        width: 25,
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
    },

    userInfoTextContainerStyle: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
    labelTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 18, fontWeight: '600',

        marginLeft: 20,
    },
    valueTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 18, fontWeight: '600',
        marginRight: 20,
    },
});