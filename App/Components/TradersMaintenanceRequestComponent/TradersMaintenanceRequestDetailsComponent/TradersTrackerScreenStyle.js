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

    scrollviewContainerStyle:{ alignItems: 'center', paddingBottom: 50 },
    mainContainerStyle:{ flexDirection: 'row' },
    leftmainViewContainer:{ width: 200, alignItems: 'flex-end', },
    leftViewContainerStyle:{ width: 50, alignItems: 'center', },
    lineViewStyle:{ height: 430, width: 2, marginTop: 40, marginBottom: 40, backgroundColor: 'grey' },
    leftFirstViewStyle:{ height:50,width:50,position: 'absolute', marginTop: 25, justifyContent: 'center',alignItems:'center', backgroundColor: '#fff', borderRadius: 25, borderWidth: 1, borderColor: 'grey', padding: 10 },
    leftFirstBlueViewStyle:{ height:50,width:50,position: 'absolute', marginTop: 25, justifyContent: 'center',alignItems:'center', backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: 25, borderWidth: 1, borderColor: 'grey', padding: 10 },
    
});