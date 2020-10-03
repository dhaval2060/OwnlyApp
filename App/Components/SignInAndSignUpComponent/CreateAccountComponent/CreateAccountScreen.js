import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    CheckBox
} from 'react-native';
import {
    resetState,
    userType
} from "./SignUpAction";


import {
    getUserRolesList,
} from "../../../Action/ActionCreators";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import CreateAccountStyle from './CreateAccountSreenStyle';
import { RadioGroup, RadioButton } from '../../../../App/CustomLibraries/react-native-flexi-radio-button/lib'

class CreateAccountScreen extends Component {
    constructor() {
        super();
        this.state = {
            userRolesData: []
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onUserRoleSuccess();
    }

    componentWillUnmount() {
        this.setState({ userRolesData: [] });
    }
    componentWillMount() {
        this.props.getUserRolesList();
    }

    onSelect(index, value) {
        // this.setState({
        //     text: `Selected index: ${index} , value: ${value}`
        // });
        setTimeout(() => {
            this.props.userType(value);
        }, 200);


    }

    onUserRoleSuccess() {
        if (this.props.signUpReducer.userRoleRes != '') {
            if (this.props.signUpReducer.userRoleRes.code == 200) {
                this.setState({ userRolesData: this.props.signUpReducer.userRoleRes.data });
            }
            else {
                alert(this.props.signUpReducer.userRoleRes.message);
            }
            this.props.resetState();
        }

    }
    render() {

        return (


            <View>
                <View style={CreateAccountStyle.userTypeTitleViewStyle}>
                    <Text style={CreateAccountStyle.userTypeTitleStyle}>{Strings.WHY_DO_YOU_WANT_TO_JOIN_SYNCITT}</Text>
                    
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CreateAccountStyle.scrollViewContainerStyle}>
                    {
                        this.state.userRolesData.length > 0
                            ?
                            <RadioGroup
                                size={24}
                                thickness={2}
                                // color='#9575b2'
                                // highlightColor='#ccc8b9'
                                color={'white'}
                                activeColor={Colors.RADIO_BUTTON_COLOR}
                                highlightColor={Colors.TRANSPARENT_BLACK_BUTTON_BACKGROUND}
                                onSelect={(index, value) => this.onSelect(index, value)}>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[0]._id} >
                                
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[0].title}</Text>
                                </RadioButton>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[1]._id} >
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[1].title}</Text>
                                </RadioButton>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[2]._id} >
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[2].title}</Text>
                                </RadioButton>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[3]._id} >
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[3].title}</Text>
                                </RadioButton>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[4]._id} >
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[4].title}</Text>
                                </RadioButton>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[5]._id} >
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[5].title}</Text>
                                </RadioButton>

                                <RadioButton style={CreateAccountStyle.transparentViewStyle} value={this.state.userRolesData[6]._id} >
                                    <Text style={CreateAccountStyle.userTypeTextStyle}>{this.state.userRolesData[6].title}</Text>
                                </RadioButton>

                            </RadioGroup>
                            :
                            null
                    }
                </ScrollView>
            </View>
        );
    }
}
function mapStateToProps(state) {
    
    return {
        signUpReducer: state.signUpReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getUserRolesList,
        userType,
        resetState
    }

)(CreateAccountScreen)

