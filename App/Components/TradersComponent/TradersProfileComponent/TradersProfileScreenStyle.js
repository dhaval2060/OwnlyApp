import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';
import COLORS from "../../../Constants/Colors";

const window = Dimensions.get('window');
import { Matrics } from "../../../CommonConfig";

export default StyleSheet.create({

    profileContainer: {
        flex: 1,
    },

    profileHeaderContainer: {
        position: 'absolute',
        height: 60,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        paddingTop: 5,
        backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    topCoverImageContainer: {
        height: window.height * 0.37,
        width: window.width,


    },
    bottomCoverImageContainer: {
        height: Platform.OS == 'ios' ? window.height * 0.55 : window.height * 0.65,
        width: window.width,
    },
    profileDataContainer: {
        flex: 1,
        position: 'absolute',
        height: window.height * 0.7,
        width: window.width,
        backgroundColor: Colors.TRANSPARENT,

        top: ((window.height * 0.37) - ((window.width * 0.35) / 2))
    },
    renderTraderContainer: {
        flex: 1, alignItems: 'center'
    },
    syncittLogoContainer: {
        height: Matrics.ScaleValue(120), justifyContent: 'center', alignItems: 'center'
    },
    logoImageStyle: {
        height: Matrics.ScaleValue(75)
    },
    backToSearchContainer: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '55%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    backToSearchTextStyle: {
        color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    },
    traderSubContainer: {
        margin: Matrics.ScaleValue(10), marginBottom: 0, borderTopLeftRadius: Matrics.ScaleValue(5), borderTopRightRadius: Matrics.ScaleValue(5), padding: Matrics.ScaleValue(25)
    },
    profileImageContainer: {
        flex: 1,
        position: 'absolute',
        height: window.width * 0.35,
        width: window.width * 0.35,
        backgroundColor: Colors.TRANSPARENT,
        borderRadius: window.width * 0.35,
        left: ((window.width / 2) - 40),
        top: ((window.height * 0.37) - ((window.width * 0.35) / 2))
    },

    profileImageStyle: {
        alignItems: 'center',
        height: window.width * 0.36,
        width: window.width * 0.36,
        backgroundColor: Colors.TRANSPARENT,
        borderRadius: window.width * 0.18,
    },

    profileNameAndReviewContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    contactAgentView: {
        height: 38,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        borderRadius: 100,
        marginTop: 20,
        width: window.width * 0.45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: Platform.OS == 'ios' ? 5 : 10,
        right: Platform.OS == 'ios' ? 40 : 18,
        height: 21,

        width: 21,
        backgroundColor: Colors.STATUS_GREEN_COLOR,
    },

    tabContainerScrollViewStyle: {
        marginRight: 20,
        paddingRight: 20,
    },

    tabContainerStyle: {
        backgroundColor: Colors.WHITE,
        flexDirection: 'row',
        height: 60,
        paddingRight: 100,
        alignItems: 'center',
        borderTopColor: Colors.TRANSPARENT,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderLeftColor: Colors.TRANSPARENT,
        borderRightColor: Colors.TRANSPARENT,
        borderWidth: 1,
        marginTop: 0,
        marginBottom: 15,
    },
    tabTextViewContainerStyle: {
        height: 48,
        justifyContent: 'center'
    },
    tabTextViewStyle: {
        height: 47, justifyContent: 'center', alignItems: 'center'
    },
    tabLabelTextStyle: {

        color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        fontSize: 18,
        fontWeight: '400',
        marginLeft: 20,
    },
    tabLabelDiselectTextStyle: {
        color: Colors.BLACK,
        fontSize: 18,
        fontWeight: '400',
        marginLeft: 20,
    },
    tabIndicatorStyle: {
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        height: 3,
        marginLeft: 20,
        marginBottom: 0,
        marginTop: 10,
    },
    tabWhiteIndicatorStyle: {
        // backgroundColor: Colors.TRANSLUCENT,
        height: 3,
        marginLeft: 20,
        marginBottom: 0,
        marginTop: 10,
    },


    listContainerStyle: {
        marginTop: 15,
    },

    listMainContainerStyle: {
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: Colors.WHITE,

    },
    likeImageViewStyle: {
        position: 'absolute',
        top: 15,
        left: 20,
    },
    propertyImageViewStyle: {
        height: window.height * 0.4,
        width: window.width,

    },

    propertyImageStyle: {
        height: window.height * 0.4,
        width: window.width
    },
    propertyTitleViewStyle: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        width: window.width * 0.7

    },
    propertyTitleTextStyle: {

        color: Colors.PROPERTY_TITLE_COLOR,
        fontWeight: '600',
        fontSize: 18
    },
    propetySubTitleViewStyle: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,

    },

    propertySubTitleTextStyle: {
        textAlign: 'center',
        fontSize: 20,
        color: Colors.TEXT_COLOR_SKY_BLUE
    },
    dateTextStyle: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors.APPROVE_GRAY_TEXT_COLOR
    },

    imageListMainContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
    },
    userImageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    imageListContainerStyle: {
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 20,
    },
    propertyInfoContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 20,
        paddingBottom: 20
    },

    propertyInfoSubViewContainer: {
        flexDirection: 'row'
    },

    propertyBedroomViewContainer: {
        flexDirection: 'row'
    },
    userListImageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    propertyValueTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        paddingLeft: 10
    },
    propertyWashrooViewContainer: {
        flexDirection: 'row',
        paddingLeft: 20
    },
    userNameTextStyle: { color: '#ffffff', marginTop: 10, fontSize: 18, fontWeight: '600' },
    userReviewtextStyle: { color: '#ffffff', marginTop: 10, fontSize: 14 },
    buttonTextStyle: { color: '#ffffff', fontSize: 14 },
    userInfoContainerStyle: { margin: 20, marginTop: 0 },
    userInfoTextContainerStyle: { flexDirection: 'row', marginTop: 10, 
    justifyContent: 'space-between', },
    labelTextStyle: { color: '#ffffff', fontSize: 14, textAlign: 'left', },
    infoTextStyle: { color: '#ffffff', fontSize: 14, textAlign: 'right', },
    infoAddStyle: { color: '#ffffff',width:'80%', fontSize: 14,paddingLeft:10, textAlign: 'right',},

    topCoverImageContainer: {
        height: window.height * 0.37,
        backgroundColor: '#0073E6',
        width: window.width,
    },
    onLineStatusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: Platform.OS == 'ios' ? 5 : 10,
        right: Platform.OS == 'ios' ? 40 : 18,
        height: 21,
        width: 21,
        backgroundColor: Colors.STATUS_GREEN_COLOR,
    },
    statusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: Platform.OS == 'ios' ? 5 : 10,
        right: Platform.OS == 'ios' ? 40 : 18,
        height: 21,
        width: 21,
        backgroundColor: Colors.STAUS_RED_COLOR,
    },
});