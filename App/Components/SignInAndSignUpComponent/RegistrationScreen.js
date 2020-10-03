import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Button,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView
} from 'react-native';

//23 Nov
import {

    userType
} from "./CreateAccountComponent/SignUpAction";
//
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import RegistrationStyle from './RegistrationScreenStyle';
import SignInComponent from './SignInComponent/SignInScreen';
import SignUpComponent from './CreateAccountComponent/SignUpScreen';
class RegistrationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignIn: true
        };
    }

    componentWillMount() {

        if (this.props.registrationType == 'registration') {
            this.setState({ isSignIn: false });
        }

    }
    onSignInClick() {

        //23 Nov
        this.props.userType('');
        //
        this.setState({ isSignIn: true });
    }
    onCreateAccountClick() {

        this.setState({ isSignIn: false });
    }

    onBackButtonClick() {

        //23 Nov
        if (this.props.signUpReducer.userTypeVal != '') {
            this.props.userType('');
        }
        //
    }

    render() {

        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.SIGN_IN_BG} style={CommonStyles.mainContainer} />
                <View style={RegistrationStyle.backButtoncontainer}>


                    {   //23 Nov
                        this.props.signUpReducer.userTypeVal != '' ?
                            <TouchableOpacity style={RegistrationStyle.backButtonStyle} onPress={() => this.onBackButtonClick()}>
                                <Image source={ImagePath.BACK_ICON} />
                            </TouchableOpacity>
                            :
                            null
                        //
                    }

                    <View style={RegistrationStyle.registrationContainer}>
                        <TouchableOpacity onPress={() => this.onSignInClick()}>
                            <Text style={(this.state.isSignIn ? RegistrationStyle.regisrtationOptionActiveTextStyle : RegistrationStyle.regisrtationOptionInActiveTextStyle)}>{Strings.SIGNIN}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onCreateAccountClick()}>
                            <Text style={(this.state.isSignIn == false ? RegistrationStyle.regisrtationOptionActiveTextStyle : RegistrationStyle.regisrtationOptionInActiveTextStyle)}>{Strings.CREATE_ACCOUNT}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.isSignIn ?

                        <SignInComponent isBackToTrader={this.props.isBackToTrader} />
                        :
                        <SignUpComponent isBackToTrader={this.props.isBackToTrader} />
                }
            </View>
        );
    }
}
//23 Nov
function mapStateToProps(state) {

    return {
        signUpReducer: state.signUpReducer
    }
}

export default connect(
    mapStateToProps,
    {
        userType
    }

)(RegistrationScreen)
//