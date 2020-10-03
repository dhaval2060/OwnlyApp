import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';
const window = Dimensions.get('window');
export default StyleSheet.create({


    managePropertyViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 15
    },

    managePropertyTextStyle: {
        color: Colors.LIGHT_GRAY_TEXT_COLOR,
        fontSize: 20,
        paddingLeft: 5,
        fontWeight: '500'
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
        height: 50,
        width: 50,
        borderRadius: 25
    },
    noticeBoardContainerViewStyle: {


        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 30,

    },
    propertyListViewContainerStyle: {


        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,

    },

    noticeBoardTitleTextStyle: {

        color: Colors.NOTICE_BOARD_TEXT_TITLE_COLOR,
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 21
    },

    noticeBoardListViewContainer: {

        marginTop: 20
    },
    noticeBoardItemContainerView: {
        paddingTop: 25,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 20
    },
    scrollViewStyle: {
        paddingBottom: window.height * 0.3
    },

    tabContainerScrollViewStyle: {
        marginRight: 20,
        paddingRight: 20,
    },
    tabContainerStyle: {
        backgroundColor: Colors.WHITE,
        flexDirection: 'row',
        height: 60,
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
        backgroundColor:'white',
        flexDirection: 'row',
        paddingTop: 10,
        // marginTop: 2,
        borderBottomWidth:1,
        borderBottomColor:'#eee'
    },
    tabTextViewStyle: {
        height: 48, justifyContent: 'center', alignItems: 'center'
    },
    tabTextViewContainerStyle: {
        height: 47,
        justifyContent: 'center'
    },

    dropDownViewStyle: {
        height: 38,
        width: 165,
        margin: 20,
        paddingLeft: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        borderRadius: 4,
        backgroundColor: Colors.DROP_DOWN_BACKGROUND_COLOR,
    },

    imageListMainContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
    },
    imageListContainerStyle: {
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 20,
    },

    userListImageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    searchViewStyle: {
        flexDirection: 'row',
        height: 38,
        borderWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        borderRadius: 100,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 25,
        marginRight: 25,

    },
    searchImageStyle: {
        margin: 10
    },

    imageContainerStyle: {
        height: 50,
        width: 50,
        marginLeft: 15,
        marginBottom: 15,
        marginLeft: 20,
        marginRight: 15,
    },
    statusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: 0,
        right: 0,
        height: 14,
        borderColor: Colors.WHITE,
        borderWidth: 1,
        width: 14,
        backgroundColor: Colors.STAUS_RED_COLOR,
    },

    onLineStatusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: 0,
        right: 0,
        height: 14,
        borderColor: Colors.WHITE,
        borderWidth: 1,
        width: 14,
        backgroundColor: Colors.STATUS_GREEN_COLOR,
    },
    detailTitleContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailTitleTextStyle: {
        // width: 160,
        flex:0.7,
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '600',
    },
    messageTimeTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        flex:0.4,
        // width: 90,
        fontSize: 12,
        textAlign: 'right',
    },
    detailTextStyle: {
        width: window.width - 100,
        color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
        fontSize: 14,
        textAlign: 'left',
        marginTop: 7,
    },
    categoryTextStyle: {
        width: 215,
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        marginTop: 6,
    },
    searchTextInputStyle: {
        flex: 1,
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 14,
        padding: 10,
        marginRight: 10,
    },
    lineViewStyle: {
        width: window.width,
        height: 0.3,
        backgroundColor: Colors.TRANSLUCENTT_BLACK,
        marginTop: 10,
    },
    emptyUserListImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.USER_BACKGROUN_COLOR
    },
    initialTextStyle: {
        fontSize: 16,
        color: Colors.WHITE
    },
    lineViewStyle: {
        width: window.width,
        height: 1,
        backgroundColor: Colors.TRANSLUCENT_BLACK,
    },
    noMessagePlaceHolerTextStyle: {
        color: Colors.BLACK,
        fontSize: 14,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: '300',
    },
});