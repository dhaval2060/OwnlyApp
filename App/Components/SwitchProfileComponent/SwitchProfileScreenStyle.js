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
        height: 70,
        width: 70,
        borderRadius: 35
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

    tabLabelTextStyle: {

        color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 20,
    },
    tabLabelDiselectTextStyle: {

        color: Colors.BLACK,
        fontSize: 16,
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
        borderWidth: 1,
        marginTop: 15,
    },
    listContainerStyle: {
        flexDirection: 'row',
        marginTop: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.WHITE
    },
    listContainerSelectedStyle: {
        flexDirection: 'row',
        marginTop: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.SELECTED_USER_LIST_ITEM_COLOR
    },
    tabTextViewStyle: {
        height: 47, justifyContent: 'center', alignItems: 'center'
    },
    tabTextViewContainerStyle: {
        height: 48,
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
        height: 38,
        borderWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        alignItems: 'center',
    },
    searchImageStyle: {
        margin: 10
    },
    searchTextInputStyle: {
        height: 17,
        flex: 1,
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 14,
        marginRight: 10,
    },

    imageContainerStyle: {

        justifyContent: 'center',
        marginBottom: 15,
        marginLeft: 20,
        marginRight: 15,
        marginTop:5
    },

    detailTitleContainerStyle: {
        marginTop: 15,
    },
    detailTitleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '600',
    },

    detailTextStyle: {
        width: window.width - 150,
        color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
        fontSize: 14,
        textAlign: 'left',
        marginTop: 7,
    },

    bottomViewStyle: {
        height: 60,
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchProfileContainerStyle: {
        width: null,
        height: null,
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    roundedBlueProceedButtonStyle: {
        borderRadius: 100,
        height: 40,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        justifyContent: 'center',
        marginLeft: 5,
    },


    proceedButtonTextStyle: {
        height: 16,
        width: window.width * 0.7,
        color: Colors.WHITE,
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 16,
        textAlign: 'center',
        marginLeft: 25,
        marginRight: 25,
    },

    emptyUserImageStyle: {
        height: 70,
        width: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
    },

    initialTextStyle: {
        fontSize: 22,
        color: Colors.WHITE
    },
});