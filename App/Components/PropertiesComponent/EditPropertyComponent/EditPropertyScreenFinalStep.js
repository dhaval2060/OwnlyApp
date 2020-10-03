import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import {

    updateScene,

} from "../PropertiesScreenAction";



import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditPropertyScreenStyle from './EditPropertyScreenStyle';

class EditPropertyScreenFinalStep extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    componentWillMount() {

    }
    closeAddProperty() {
        Actions.popTo('Dashboard');
        this.props.updateScene('updateProperty')
    }
    onAddPropertyClick() {
        Actions.popTo('AddPropertyScreenStepOne');
    }

    navBar() {
        return (
            <View >
                <Image source={null} style={CommonStyles.navBarMainView} />
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
    render() {
        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.SPLASH_IMAGE} style={CommonStyles.mainContainer} />
                {this.navBar()}
                <View style={EditPropertyScreenStyle.successViewContainer}>
                    <View style={EditPropertyScreenStyle.successRoundViewStyle}>
                        <Image source={ImagePath.CHECK_BIG} />
                    </View>
                    <Text style={EditPropertyScreenStyle.successTitleTextStyle}>
                        {Strings.YOUR_PROPERTY_ADDED}
                    </Text>
                   
                    <TouchableOpacity onPress={() => this.onAddPropertyClick()}>
                        <View style={EditPropertyScreenStyle.roundedBlueAddNewPropertyButtonStyle}>
                            <Text style={EditPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.NAV_ADD_NEW_PROPERTY_TITLE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.closeAddProperty()} >

                        <Text style={EditPropertyScreenStyle.successListingDetailTextStyle}>
                            {Strings.LISTING_DETAILS}
                        </Text>
                        <View style={EditPropertyScreenStyle.lineViewStyle} />
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

}

function mapStateToProps(state) {
    
    return {
        propertiesScreenReducer: state.propertiesScreenReducer,
        filterReducer: state.filterReducer
    }
}

export default connect(
    mapStateToProps,
    {
        updateScene,
    }

)(EditPropertyScreenFinalStep);
