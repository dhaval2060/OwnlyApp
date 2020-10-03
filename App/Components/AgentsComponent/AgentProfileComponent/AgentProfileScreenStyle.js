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
        height: window.height * 0.7,
        width: window.width,
        backgroundColor: Colors.TRANSPARENT,
       
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
        borderLeftColor: Colors.WHITE,
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
    userInfoContainerStyle: { margin: 20 },
    userInfoTextContainerStyle: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
    labelTextStyle: { color: '#ffffff', fontSize: 15, textAlign: 'left', },
    infoTextStyle:{ color: '#ffffff', fontSize: 14, textAlign: 'right', },
    topCoverImageContainer: {
        height: window.height * 0.37,
        backgroundColor:'#0073E6',
        width: window.width,   
    },
    agentcyDetailsText:{
        color:'black',fontSize:12,alignSelf:'center'
    },
    agentcyDetailsTextValue:{
        color:'#616161',fontSize:12,alignSelf:'center',marginBottom:10
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

