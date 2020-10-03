
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
    ScrollView,
    FlatList,
    AsyncStorage
} from 'react-native';

import {
    getUserPermission,
    getUserRoles,
} from "../../Action/ActionCreators";
import {

    showLoading,
    resetState,
} from "./SwitchProfileAction";


import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import SwitchProfileScreenStyle from './SwitchProfileScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
import API from '../../Constants/APIUrls';
let ref;
var listArraydata = [];
var selectedUserRoleId= '';
var selectedUserRole= '';
class SwitchProfileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            logedinUserData: {},
            userRoleData: [],
            roleId: '',
            userInfo: {},
        };
    }

    componentDidUpdate() {
        this.onGetUserRoleSuccess();
        this.onGetUserPermissionSuccess();
    }

    componentWillMount() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                this.setState({ userInfo: userData });
            }
        }).done();
        this.callGetUserRoles();
        this.getRoleId();
    }

    closeSwitchProfile() {
        Actions.popTo('Dashboard');
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
                    role_id: selectedUserRoleId,
                }
                this.props.showLoading();
                this.props.getUserPermission(authToken, postData);
            }
        }).done();
    }

    getRoleId() {

        AsyncStorage.getItem("roleId").then((value) => {
            if (value) {
                
                this.setState({ roleId: value });
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
        }
    }

    onGetUserPermissionSuccess() {

        if (this.props.switchProfileReducer.userPermissionRes != '') {
            if (this.props.switchProfileReducer.userPermissionRes.code == 200) {

                AsyncStorage.setItem("userPermission", JSON.stringify(this.props.switchProfileReducer.userPermissionRes));
                AsyncStorage.setItem("roleId", selectedUserRoleId);
                Actions.Dashboard({ type: 'reset' });
                
                AsyncStorage.setItem(Strings.USER_ROLE_NAME, selectedUserRole);
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
                    tempArray[index].isSelected = true;
                }
                else {
                    tempArray[index].isSelected = false;
                }

            })
            
        }
        return tempArray;
    }


    navBar() {

        return (
            <View style={CommonStyles.navBarMainView}>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.SWITCH_PROFILE}</Text>
                <TouchableOpacity onPress={() => this.closeSwitchProfile()} style={CommonStyles.navRightImageView}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
                </TouchableOpacity>
            </View>
        );
    }

    renderItem({ item, index }) {
        var userImage = ref.state.userInfo.data ? (ref.state.userInfo.data.image ? API.USER_IMAGE_PATH + ref.state.userInfo.data.image : '') : '';
        return (
            <TouchableOpacity onPress={ref.selectUserProfile.bind(ref, index)}>
                <View style={ref.state.userRoleData[index].isSelected ? SwitchProfileScreenStyle.listContainerSelectedStyle : SwitchProfileScreenStyle.listContainerStyle}>

                    <View style={SwitchProfileScreenStyle.imageContainerStyle}>

                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={SwitchProfileScreenStyle.userImageStyle} />
                                :
                                <View style={SwitchProfileScreenStyle.emptyUserImageStyle}>
                                    <Text style={SwitchProfileScreenStyle.initialTextStyle}>{ref.state.logedinUserData.data.firstname.charAt(0).toUpperCase() + ' ' + ref.state.logedinUserData.data.lastname.charAt(0).toUpperCase()}</Text>
                                </View>
                        }


                    </View>

                    <View style={SwitchProfileScreenStyle.detailTitleContainerStyle}>
                        <Text style={SwitchProfileScreenStyle.detailTitleTextStyle}>{(ref.state.logedinUserData.data ? (ref.state.logedinUserData.data.firstname + ' ' + ref.state.logedinUserData.data.lastname + ' - ' + (item.description ? item.description : '')) : '')}</Text>

                        <Text style={SwitchProfileScreenStyle.detailTextStyle}>Last signed in Today 11:00</Text>
                    </View>

                </View>
            </TouchableOpacity>

        );
    }

    selectUserProfile(selectedIndex) {

        var tempArray = this.state.userRoleData;
        tempArray.map((data, index) => {

            if (selectedIndex == index) {

                tempArray[index].isSelected = true;
            }
            else {

                tempArray[index].isSelected = false;

            }

        })
        selectedUserRoleId = tempArray[selectedIndex]._id;
        selectedUserRole = tempArray[selectedIndex].description;
        this.setState({ userRoleData: tempArray });
        
        return tempArray;
    }

    onSwitchAccountClick() {
        if (this.state.userRoleData.length > 1) {
            this.callGetUserPermission();
        }
    }

    render() {
        
        return (
            <View style={SwitchProfileScreenStyle.switchProfileContainerStyle}>
                {this.navBar()}
                <View style={SwitchProfileScreenStyle.searchViewStyle} />

                {
                    this.state.userRoleData.length > 0 ?
                        <FlatList
                            data={this.state.userRoleData}
                            extraData={this.state}
                            renderItem={this.renderItem}
                        /> : null
                }

                <View style={SwitchProfileScreenStyle.bottomViewStyle} >
                    <TouchableOpacity onPress={this.onSwitchAccountClick.bind(this)}>
                        <View style={SwitchProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={SwitchProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.SWITCH}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {

                    this.props.switchProfileReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
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

)(SwitchProfileScreen);

