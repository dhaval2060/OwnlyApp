import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../../Constants/Colors';

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
});