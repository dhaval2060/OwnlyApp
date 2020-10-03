import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({
    mainContainer: { flex: 1, height: null, width: null },
    profileContainer: {
        flex: 1,
    },
    profileHeaderContainer: {
        position: 'absolute',
        height: 66,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        paddingTop: 5,
        backgroundColor: Colors.TRANSPARENT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roundedTransparentDraftButtonStyle: {
		borderRadius: 100,
		height: 40,
		backgroundColor: Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND,
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#EAECFF',
		marginRight: 5,
    },
    draftButtonTextStyle: {
		height: 16,
		width: window.width * 0.4,
		color: '#1ACFFF',
		fontSize: 13,
		fontWeight: 'bold',
		lineHeight: 16,
		textAlign: 'center',
		margin: 5,

	},
    buttonContainerStyle: {
		flexDirection: 'row',
		// position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 70,
		backgroundColor: Colors.WHITE,
		alignItems: 'center',
		justifyContent: 'center',
	},
    topCoverImageContainer: {
        height: window.height * 0.25,
        width: null,
        resizeMode: 'stretch'

    },
    bottomCoverImageContainer: {
        height: window.height * 0.55,
        width: null,
        resizeMode: 'stretch'

    },
    profileDataContainer: {
        flex: 1,
        position: 'absolute',
        height: window.width * 0.35,
        width: window.width,
        backgroundColor: Colors.TRANSPARENT,
        borderRadius: window.width * 0.35,
        top: ((window.height * 0.37) - ((window.width * 0.35) / 2))
    },
    profileImageContainer: {
        flex: 1,
        position: 'absolute',
        height: window.width * 0.35,
        width: window.width * 0.35,
        backgroundColor: Colors.TRANSPARENT,
        borderRadius: window.width * 0.35,
        left: ((window.width / 2)-40),
        top: ((window.height * 0.37) - ((window.width * 0.35) / 2))
    },

    profileImageStyle: {
        alignItems: 'center',
        height: window.width * 0.35,
        width: window.width * 0.35,
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
        bottom: 5,
        right: 40,
        height: 21,
        width: 21,
        backgroundColor: Colors.STATUS_GREEN_COLOR,
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
        marginBottom: -6,
        marginTop: 6,
    },
    tabContainerStyle: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderTopColor: Colors.TRANSLUCENT_BLACK,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderWidth: 0,
        marginTop: 0,
        marginBottom: 15,
    },
    tabContainerScrollViewStyle: {
        marginRight: 20,
        paddingRight: 20,
    },
    listContainerStyle: {
        marginTop: 15,
    },
    tabTextViewStyle: {
        height: 47, justifyContent: 'center', alignItems: 'center'
    },
    tabTextViewContainerStyle: {
        height: 48,
        justifyContent: 'center'
    },
    listMainContainerStyle: {
        marginTop: 15,
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
        marginTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        width: window.width
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
        width: window.width - 30
    },

    propertySubTitleTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14
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
    buttonTextStyle: { color: '#ffffff',  fontSize: 14 },
    userInfoContainerStyle: { margin: 20 },
    userInfoTextContainerStyle: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
    labelTextStyle: { color: '#ffffff', fontSize: 14, textAlign: 'left', width: window.width * 0.3 },
    infoTextStyle: { color: '#ffffff', fontSize: 14, textAlign: 'right', width: window.width * 0.6 },
    optionViewStyle: {
        alignItems: 'center',
        height: 38,
        width: 38,
        justifyContent: 'center',
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        borderRadius: 19,
    },
    
});