
import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import Colors from '../../Constants/Colors';
const window = Dimensions.get('window');
export default StyleSheet.create({

    searchViewStyle: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 38,
        borderBottomWidth: 1,
        borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
        marginTop: 15,
        left: 20,
        right: 20,
        bottom: 15,
    },
    searchImageStyle: {
        margin: 1
    },
    searchTextInputStyle: {
        position: 'absolute',
        color: Colors.FILTER_TEXT_VIEW_COLOR,
        fontSize: 14,
        textAlign:'left',
        left: 30,
        right: 30,
    },
    navRightImageView: {
        position: 'absolute',
        right: 1,
        bottom: 15,
    },
    listMainContainerStyle: {
        marginTop: 20,
        marginLeft:5,
        marginBottom:20,
        backgroundColor: Colors.WHITE,

    },
    propertyTitleViewStyle: {
      
        paddingLeft: 20,
        width:window.width*0.7

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

        color: Colors.PROPERTY_TITLE_COLOR,
        fontSize: 14,
        marginTop:8
      },
      userImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25
      },
      propertyImageStyle: {
        height: 100,
        width: 100,
        borderRadius: 5
      },
      emptyUserMessageListImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
      },

      propertyImageEmptyStyle: {
        height:100,
        width: 100,
        borderRadius: 5,
        backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR
      },
      initialTextStyle: {
        fontSize: 16,
        color: Colors.WHITE
      },

      tabContainerStyle: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        borderTopColor: Colors.TRANSLUCENT_BLACK,
        borderBottomColor: Colors.TRANSLUCENT_BLACK,
        borderLeftColor:Colors.TRANSPARENT,
        borderRightColor:Colors.TRANSPARENT,
        borderWidth: 1,
        marginTop: 15,
      },
      tabTextViewStyle: {
        height: 47, justifyContent: 'center', alignItems: 'center'
      },
      tabLabelTextStyle: {

        color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
        fontSize: 18,
        fontWeight: '400',
        marginLeft: 25,
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
     
});