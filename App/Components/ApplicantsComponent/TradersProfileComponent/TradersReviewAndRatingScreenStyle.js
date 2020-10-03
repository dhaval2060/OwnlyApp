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
        flexDirection: 'row',
    },
    listMainContainerStyle: {
        padding: 20,
        marginTop: 2,
        backgroundColor: Colors.WHITE,
    },

    imageContainerStyle: {
        height: 50,
        width: 50,
        marginBottom: 15,
        marginRight: 15,
    },
    detailTitleContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    reviewDetailTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 14,
    },
    detailTitleTextStyle: {
        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 18,
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
    emptyUserMessageListImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
      },
      initialTextStyle: {
        fontSize: 16,
        color: Colors.WHITE
      },
});