import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

const window = Dimensions.get('window');

export default StyleSheet.create({

    ratingContainerStyle: {
        padding: 20,
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
    },
    buttonContainerStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    roundedBlueReviewButtonStyle: {
        borderRadius: 100,
        width: 135,
        marginLeft: 30,
        height: 38,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewButtonTextStyle: {
        color: Colors.WHITE,
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 16,
        textAlign: 'center',
    },
    ratingCountStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 30,
        fontWeight: '300',
        textAlign: 'left',

    },
    ratingBarContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewCountTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
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
    listContainerStyle: {
        width: window.width,
        flexDirection: 'row',
    },
    listMainContainerStyle: {
        padding: 20,
        marginTop: 2,
        backgroundColor: Colors.WHITE,
    },

    imageContainerStyle: {
        height: 40,
        width: 45,
        marginBottom: 15,
        marginTop: 20,
        marginLeft: 25,
        marginRight: 15,
    },
    detailTitleContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userImageStyle: {
        height: 40,
        width: 40,
        borderRadius: 4
    },
    reviewDetailTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 14,
    },
    detailTitleTextStyle: {
        width: window.width - 150,
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '600',
    },

    reviewDateTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
    },
    wirteReviewButtonView: {
        height: 38,
        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        borderRadius: 100,
        width: window.width * 0.35,
        alignItems: 'center',
        justifyContent: 'center'
    },

    loadMoreTextStyle: {
        flex: 1,
        height: 17,
        fontSize: 14,
        textAlign: 'center',
        color: Colors.REFINE_RESULT_TEXT_COLOR,
        padding: 25,
    },
    aboutRequestDetailTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 14,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 25,
        paddingBottom: 20,
        lineHeight: 17,
    },
    titleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontWeight: '500',
        fontSize: 17,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 25,
    },
    fileTitleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontWeight: '500',
        fontSize: 17,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 25,
    },
    listImageStyle: {
        marginRight: 20,
    },
    categoryTextStyle: {
        width: 215,
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        marginTop: 6,
    },
    tileListContainerStyle: {
        marginTop: 15,
        flex: 1,
        alignItems: 'center'
    },
    priceContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceTextStyle: {
        color: Colors.TAG_VIEW_TEXT_COLOR,
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 25,
        marginBottom: 25,
    },
    daysTextStyle: {
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 16,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 25,
        marginBottom: 25,
    },

    userRatingContainer: {
        width: window.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20

    },
    ratingImageContainerStyle: {
        width: 80,
        height: 80,
    },
    ratingTitleTextStyle: {
        height: 21,
        color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR,
        fontSize: 18,
        fontWeight: '600',
    },
    ratingReviewTextStyle: {
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 14,
        lineHeight: 17,
        marginTop: 12,
    },

    ratingImageStyle: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    statusViewStyle: {
        position: 'absolute',
        borderRadius: 100,
        bottom: 5,
        right: 3,
        height: 16,
        borderColor: Colors.WHITE,
        borderWidth: 1,
        width: 16,
        backgroundColor: Colors.STATUS_GREEN_COLOR,
    },
    watcherImageStyle: {
        height: 36,
        width: 36,
        borderRadius: 18
    },
    watcherTitleTextStyle: {
        width: window.width - 120,
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 16,
        alignItems: 'center',
        textAlign: 'left',
        fontWeight: '600',
    },
    ratingStarContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    agreementsImageViewStyle: {
        height: window.height * 0.4,
        width: window.width,

    },
    topCoverImageContainer: {
        height: window.height * 0.4,
        backgroundColor: Colors.LISTING_BG_COLOR,
        width: window.width,
    },
    
    agreementsTitleViewStyle: {
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        width: window.width
    },
    agreementsTitleTextStyle: {

        color: Colors.PROPERTY_TITLE_COLOR,
        fontWeight: '600',
        fontSize: 18
    },
    agreementsSubTitleViewStyle: {
        marginTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        width: window.width - 30
    },

    agreementsSubTitleTextStyle: {
        marginTop: 5,
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14
    },
    maintenanceListHeaderContainer: {
        width: window.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 25,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: Colors.WHITE,
    },
    statusContainerStyle: {
        width: 90,
    },
    maintenanceStatusViewStyle: {
        borderRadius: 100,
        height: 24,
        backgroundColor: Colors.MAINTENANCE_COMPLETED_STATUS,
        justifyContent: 'center',
        marginRight: 5,
        marginTop: 5,
        borderColor: Colors.WHITE,
        borderWidth: 2,
    },
    statusViewTextStyle: {
        color: Colors.WHITE,
        fontSize: 9,
        fontWeight: '500',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    maintenaceUserImageStyle: {
        height: 66,
        width: 66,
        borderRadius: 33,
    },
    dollarTextStyle: {
        color: Colors.TAG_VIEW_TEXT_COLOR,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    daysTextStyle: {
        color: Colors.PROPERTY_SUB_TITLE_COLOR,
        fontSize: 14,
        textAlign: 'right',
    },
    detailContainerStyle: {
        justifyContent: 'center',
        paddingTop: 25,
        paddingBottom: 25,
        backgroundColor: Colors.WHITE,
    },
    maintenanceDetailTitleContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
    },
    maintenanceDetailTitleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    notificatioImageStyle: {
        marginLeft: 5,
        marginBottom: 5,
    },
    maintenanceDetailTextStyle: {
        color: Colors.MAINTENANCE_CATEGORY_COLOR,
        fontSize: 14,
        textAlign: 'center',
    },
    highlightViewContainer: {
        width: window.width * 0.5,
        height: null,
    },
    highlightValueViewContainer: {
        width: window.width * 0.5,
        height: null,
    },
    highlightValueTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 14,
        paddingLeft: 25,
        fontWeight: 'bold',
        paddingRight: 25,
        paddingTop: 5,
        paddingBottom: 25,
        lineHeight: 17,
    },
    highlightValueRedTextStyle: {
        color: Colors.LEASE_RZENUAL_TEXT_COLOR,
        fontSize: 14,
        paddingLeft: 25,
        fontWeight: 'bold',
        paddingRight: 25,
        paddingTop: 5,
        paddingBottom: 25,
        lineHeight: 17,
    },
    statusCompletedViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_COMPLETED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },

  statusAcceptedViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_ACCEPTED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusSentViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_SENT_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusOverDueViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_OVER_DUE_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  statusBookViewStyle: {
    borderRadius: 100,
    height: 24,
    backgroundColor: Colors.MAINTENANCE_BOOKED_STATUS,
    justifyContent: 'center',
    marginRight: 5,
    marginTop: 5
  },
  emptyUserMessageListImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
  },
  initialTextStyle: {
    fontSize: 16,
    color: Colors.WHITE
  },
});