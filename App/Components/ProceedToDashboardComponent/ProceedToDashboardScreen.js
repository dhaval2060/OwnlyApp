import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import {
    getUserPermission,
    getUserRoles,
} from "../../Action/ActionCreators";

import {
    showLoading,
    resetState,
} from "../SwitchProfileComponent/SwitchProfileAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import * as Progress from 'react-native-progress';
class ProceedToDashboardScreen extends Component {

    constructor() {
        super();
        this.state = {
            logedinUserData: {},
            userInfo: {},
            userRoleData: [],
            roleId: '',
        };
    }

    componentDidUpdate() {
        this.onGetUserRoleSuccess();
        this.onGetUserPermissionSuccess();
    }
    componentWillMount() {

        this.getRoleId();
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                this.setState({ userInfo: userData });
            }
        }).done();
        this.callGetUserRoles();
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    navigateDashboard() {
        Actions.Dashboard({ type: 'reset' });
    }

    getRoleId() {

        AsyncStorage.getItem("roleId").then((value) => {
            if (value) {
                
                this.setState({ roleId: value });
                this.callGetUserPermission();
            }
        }).done();
    }


    callGetUserRoles() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {


                var userData = JSON.parse(value);

                this.setState({ logedinUserData: userData });
                var authToken = userData.token;
                var postData = {
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getUserRoles(authToken, postData);
            }
        }).done();
    }


    callGetUserPermission() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                this.setState({ logedinUserData: userData });
                var authToken = userData.token;
                var postData = {

                    user_id: userData.data._id,
                    role_id: this.state.roleId,
                }
                this.props.showLoading();
                this.props.getUserPermission(authToken, postData);
            }
        }).done();
    }


    onGetUserRoleSuccess() {

        if (this.props.switchProfileReducer.switchUserProfileRes != '') {
            if (this.props.switchProfileReducer.switchUserProfileRes.code == 200) {
                this.setState({ userRoleData: this.prepareUserRoleData(this.props.switchProfileReducer.switchUserProfileRes) });
                
            }
            else {
                alert(this.props.switchProfileReducer.switchUserProfileRes.message)
            }
            this.props.resetState();
            this.callGetUserPermission();
        }
    }

    onGetUserPermissionSuccess() {

        if (this.props.switchProfileReducer.userPermissionRes != '') {
            if (this.props.switchProfileReducer.userPermissionRes.code == 200) {
                
                AsyncStorage.setItem("userPermission", JSON.stringify(this.props.switchProfileReducer.userPermissionRes));

            }
            else {

                alert(this.props.switchProfileReducer.userPermissionRes.message)
            }
            this.props.resetState();
        }
    }


    prepareUserRoleData(rolesData) {

        var tempArray = [];
        tempArray = rolesData.data ? rolesData.data.finalArr : [];
        if (tempArray.length > 0) {
            tempArray.map((data, index) => {
                
                
                if (this.state.roleId == tempArray[index]._id) {
                    // tempArray[index].isSelected = true;
                    AsyncStorage.setItem(Strings.USER_ROLE_NAME, tempArray[index].description);
                    
                }
                else {
                    // tempArray[index].isSelected = false;
                }

            })
            
        }
        return tempArray;
    }


    render() {

        
        var userName = this.state.userInfo.data ? this.state.userInfo.data.firstname : '';
        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.INTRO_BG} style={CommonStyles.mainContainer} />

                <View style={CommonStyles.container}>
                    <View style={CommonStyles.logoViewStyle}>
                        <Image source={ImagePath.LOGO} />
                    </View>
                    <Text style={CommonStyles.welcomeTitleStyle}>{'Hi ' + userName + '!\n' + Strings.WELCOME_TITLE}</Text>
                    <Text style={CommonStyles.welcomeMessageStyle}>{Strings.SIGNUP_WELCOME_MESSAGE}</Text>

                    <TouchableOpacity style={CommonStyles.roundedBlueButtonStyle} onPress={() => this.navigateDashboard()}>
                        <View >
                            <Text style={CommonStyles.buttonTextStyle}>{Strings.PROCEED_TO_DASHBOARD}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={CommonStyles.allRightReservedViewStyle}>
                        <Text style={CommonStyles.allRightReservedTextStyle}>{Strings.ALL_RIGHT_RESERVED}</Text>
                    </View>
                </View>

                {

                    this.props.switchProfileReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.WHITE, Colors.WHITE, Colors.WHITE]} />
                        </View>
                        : null

                }

            </View>
        );
    }

}


function mapStateToProps(state) {
    
    return {
        switchProfileReducer: state.switchProfileReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getUserPermission,
        getUserRoles,
        showLoading,
        resetState,
    }

)(ProceedToDashboardScreen);

