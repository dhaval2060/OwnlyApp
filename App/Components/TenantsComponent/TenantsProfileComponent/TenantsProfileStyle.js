import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

const window = Dimensions.get('window');

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
        height: window.width * 7,
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
    wirteReviewButtonView: {
        height: 38,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        borderRadius: 100,
        width: window.width * 0.35,
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

    userNameTextStyle: { 
        color: '#ffffff', 
        marginTop: 10, 
        fontSize: 18, 
        fontWeight: '600' 
    },
    userReviewtextStyle: { 
        color: '#ffffff', 
        marginTop: 10, 
        fontSize: 14 
    },
    buttonTextStyle: { 
        color: '#ffffff', 
        margin: 15, 
        fontSize: 14 
    },
    userInfoContainerStyle: { 
        margin: 20 
    },
    userInfoTextContainerStyle: { 
        flexDirection: 'row', 
        marginTop: 15, 
        justifyContent: 'space-between' 
    },
    labelTextStyle: { 
        color: '#ffffff', 
        fontSize: 14, 
        textAlign: 'left', 
    },
    infoTextStyle:{ 
        width:window.width*0.6,
        color: '#ffffff', 
        fontSize: 14, 
        textAlign: 'right', 
    },
    dateContainerStyle: {
        flexDirection: 'row',
         marginTop: 20,
        backgroundColor: Colors.WHITE,
    },
    dateImageStyle: {
        marginLeft: 20,
        marginRight: 10,
    },
    dateTextStyle: {
        marginRight: 15,
        color: Colors.DATE_COLOR,
        fontSize: 14,
        fontWeight: 'bold',
    },
    tenantsTitleViewStyle: {
        marginTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
        width: window.width
    },
    tenantsTitleTextStyle: {

        color: Colors.PROPERTY_TITLE_COLOR,
        fontWeight: '600',
        fontSize: 18
    },
    tenantsSubTitleViewStyle: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        width: window.width - 30
    },

    tenantsSubTitleTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14
    },
    imageListMainContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
    },
    imageListContainerStyle: {
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 20,
    },
    tenantsInfoContainerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 40,
        paddingBottom: 30
    },
    propertyBedroomViewContainer: {
        flexDirection: 'row'
    },

    propertyWashrooViewContainer: {
        flexDirection: 'row',
        paddingLeft: 20
    },

    propertyValueTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        paddingLeft: 10
    },
    userImageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    userListImageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    tabContainerStyle: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        borderTopColor: Colors.TRANSLUCENT_BLACK,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        backgroundColor: Colors.DROP_DOWN_BACKGROUND_COLOR,
        borderWidth: 0,
       
    },
    dropDownViewStyle: {
        height: 38,
        width: window.width*0.45,
        margin: 20,
        paddingLeft: 15,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        borderRadius: 4,
        backgroundColor: Colors.DROP_DOWN_BACKGROUND_COLOR,
    },
    topCoverImageContainer: {
        height: window.height * 0.37,
        backgroundColor:'#0073E6',
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