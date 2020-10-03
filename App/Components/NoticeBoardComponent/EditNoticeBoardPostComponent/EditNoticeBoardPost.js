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
    AsyncStorage,
    FlatList
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditNoticeBoardPostStyle from './EditNoticeBoardPostStyle';
import CheckBox from 'react-native-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
////import listData from  '../../../data';

import {
    AddPostSubmitRequest,
    getUserRolesList,
} from "../../../Action/ActionCreators";

import {
    postAgendaChanged,
    postDescriptionChanged,
    postTitleChanged,
    resetState,
    showLoading
} from "../../NoticeBoardAddPostComponent/NoticeBoardAddPostAction";
import APICaller from '../../../Saga/APICaller';


let propertyType = [{
    value: 'Andy Harrison',
},
{
    value: 'Jack Williams',
}];
let contextRef;
var amenitiesSelectedArrray = [];
var selectedRolesData = [];

class EditNoticeBoardPost extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {},
            listData: [],
            isThread: false,
            showLoader:false,
            errorMsg: '',
            errorOnTextField: '',
        };
        contextRef = this;
    }


    componentDidUpdate() {
        // this.onAddPostSuccess();
        // this.onUserRoleSuccess()
    }

    componentWillUnmount() {
        amenitiesSelectedArrray = [];
        selectedRolesData = [];
    }
    componentWillMount() {
        
        this.setState({ listData: this.prePareAmenitiesData(this.props.noticePostDetails.noticeboard_id.assign_to_roles) });
        this.setState({
            description: this.props.noticePostDetails.description,
            title: this.props.noticePostDetails.title,
            agenda_resolution: this.props.noticePostDetails.agenda_resolution,
            isThread: this.props.noticePostDetails.enable_thread_post,
            // userRoleData: this.props.noticePostDetails.noticeboard_id.assign_to_roles
        })
        // this.callUserRoleList();
    }
    onEdit() {
        let selectedRolesData = []
        this.state.listData.map((data, index) => {


            if (this.state.listData[index].isChecked) {

                var rolesObj = {
                    _id: this.state.listData[index].role_id._id
                }
                selectedRolesData.push(rolesObj);

            }

        })

        editNoticeboardPost = {
            agency_id: this.props.noticePostDetails.agency_id,
            assign_to_roles: selectedRolesData,
            created_by: this.props.noticePostDetails.createdby,
            description: this.state.description,
            enable_thread_post: this.state.isThread,
            noticeboard_id: this.props.noticePostDetails.noticeboard_id._id,
            noticeboardpost_id: this.props.noticePostDetails._id,
            title: this.state.title,
            agenda_resolution: this.state.agenda_resolution
        }
        this.setState({showLoader:true})
        
        AsyncStorage.getItem("SyncittUserInfo").then(value => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                APICaller("editNoticeboardPost", "POST", authToken, editNoticeboardPost).then(data => {
                    
                    this.props.onRefresh()
                    setTimeout(function(){
                        Actions.pop();
                    }, 1000);
                    this.setState({showLoader:false})
                    // this.prepareDataForUserRoles(data);
                });
            }
        });
    }

    onPostTitleChanged(text) {

        this.props.postTitleChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPostAgendaChanged(text) {
        this.props.postAgendaChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPostDescriptionChanged(text) {
        this.props.postDescriptionChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onCheckBoxClick() {

        if (this.state.isThread) {

            this.setState({ isThread: false });
        }
        else {

            this.setState({ isThread: true });
        }
    }

    closeAddProperty() {
        Actions.pop();
    }

    callBack() {
        Actions.pop();
    }

    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>Edit Post</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    prePareAmenitiesData(amenitiesData) {
        var tempArray = amenitiesData;
        tempArray.map((data, index) => {
            let flag = false
            this.props.noticePostDetails.assign_to_roles.forEach(element => {
                if (element.role_id._id == data.role_id._id) {
                    
                    flag = true
                }
            });
            if (flag) {
                tempArray[index].isChecked = true;
            }
            else {
                tempArray[index].isChecked = false;
            }
            
        })
        
        return tempArray;

    }

    updateCheckBoxSelection(selectedIndex, amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {

            if (selectedIndex == index) {
                if (tempArray[selectedIndex].isChecked) {

                    tempArray[selectedIndex].isChecked = false;
                }
                else {

                    tempArray[selectedIndex].isChecked = true;

                }

            }


        })

        return tempArray;

    }
    callUserRoleList() {
        this.props.getUserRolesList();
        // this.props.getAdminStatistics();
    }
    onUserRoleSuccess() {
        if (this.props.noticeBoardReducer.userRoleData != "") {
            if (this.props.noticeBoardReducer.userRoleData.code == 200) {
                
                this.setState({
                    userRolesData: this.props.noticeBoardReducer.userRoleData.data
                });
                // this.getCounterForProperty()
            } else {
                alert(this.props.noticeBoardReducer.userRoleData.message);
            }
            this.props.resetState();
        }
    }
    renderItem({ item, index }) {
        
        return (
            <View style={EditNoticeBoardPostStyle.amenitiesListItemContainerStyle}>
                <CheckBox
                    label={item.role_id.description}
                    labelStyle={EditNoticeBoardPostStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
        {/* <View style={EditNoticeBoardPostStyle.amenitiesListItemContainerStyle}>
            <CheckBox
                label={item.role_id.description + "(" + 2 + ")"}
                labelStyle={EditNoticeBoardPostStyle.amenitisListCheckboxLabelStyle}
                checked={item.role_id.isSelected}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
            />
        </View> */}
    }
    // getCounterForProperty() {

    //     AsyncStorage.getItem("SyncittUserInfo").then(value => {
    //         if (value) {
    //             var userData = JSON.parse(value);
    //             var authToken = userData.token;
    //             let propertyArr = []
    //             this.props.noticePostDetails.noticeboard_id.property_id_arr.forEach(element => {
    //                 propertyArr.push(element._id)
    //             });
    //             APICaller("getUserCountsViaProperties", "POST", authToken, {
    //                 property_arr: propertyArr
    //             }).then(data => {
    
    //                 // this.prepareDataForUserRoles(data);
    //             },
    //                 err => {
    
    //                     let arr = {
    //                         agencyCnt: 0,
    //                         agentCnt: 0,
    //                         code: 200,
    //                         data: 0,
    //                         ownerCnt: 0,
    //                         tenantCnt: 0
    //                     }
    //                     // this.prepareDataForUserRoles(arr);
    //                 });
    //         }
    //     });
    // }
    // prepareDataForUserRoles(data) {
    //     var arr = [];
    //     if (this.state.userRolesData != null && this.state.rolesData != []) {
    
    //         element = {
    //             id: "1",
    //             description: "All",
    //             count: (data.tenantCnt ? data.tenantCnt : 0) + data.agentCnt + data.ownerCnt + data.agencyCnt
    //         };
    //         arr.push(element);
    //         this.state.userRolesData.forEach(element => {
    //             if (element.description == "Agent") {
    //                 if()
    //                 element["count"] = data.agentCnt;
    //                 arr.push(element);
    //             } else if (element.description == "Tenant") {
    //                 element["count"] = data.tenantCnt;
    //                 arr.push(element);
    //             } else if (element.description == "Owner") {
    //                 element["count"] = data.ownerCnt;
    //                 arr.push(element);
    //             } else if (element.description == "Agency Owner") {
    //                 element["count"] = data.agencyCnt;
    //                 arr.push(element);
    //             }
    //         });
    
    //         this.setState({ userRoleCount: arr });
    //     }
    // }
    submitRequest() {
        
        this.state.listData.map((data, index) => {


            if (this.state.listData[index].isChecked) {

                var rolesObj = {
                    _id: this.state.listData[index]._id
                }
                selectedRolesData.push(rolesObj);

            }

        })

        if (this.props.noticeBoardAddPostReducer.postAgendaChanged != '' && selectedRolesData.length != 0 &&
            this.props.noticeBoardAddPostReducer.postDescriptionChanged != '' && this.props.noticeBoardAddPostReducer.postTitleChanged != ''
        ) {
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {

                    var userData = JSON.parse(value);
                    this.setState({ logedinUserData: userData });
                    var authToken = userData.token;
                    var postData = {
                        agency_id: userData.data.agency_id,
                        created_by: userData.data._id,
                        agenda_resolution: this.props.noticeBoardAddPostReducer.postAgendaChanged,
                        assign_to_roles: selectedRolesData,
                        description: this.props.noticeBoardAddPostReducer.postDescriptionChanged,
                        enable_thread_post: this.state.isThread,
                        noticeboard_id: this.props.noticeBoardId,
                        title: this.props.noticeBoardAddPostReducer.postTitleChanged,
                    }

                    
                    this.props.showLoading();
                    this.props.AddPostSubmitRequest(authToken, postData);
                }

            }).done();
        }
        else {
            alert('Please fill all fields');
        }


    }

    onAddPostSuccess() {

        if (this.props.noticeBoardAddPostReducer.addPostRes != '') {
            if (this.props.noticeBoardAddPostReducer.addPostRes.code == 200) {
                Actions.pop();
            }
            else {

                alert(this.props.noticeBoardAddPostReducer.addPostRes.message);
            }
            this.props.resetState();
        }
    }



    onCheckBoxChangeListener(index) {
        
        var tempData = this.updateCheckBoxSelection(index, this.state.listData);
        this.setState({ listData: tempData });
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditNoticeBoardPostStyle.scrollViewContainerStyle}>

                    <View style={EditNoticeBoardPostStyle.headerContainer}>
                        <Text style={EditNoticeBoardPostStyle.labelStyle}>
                            {Strings.POST_TITLE}<Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput style={EditNoticeBoardPostStyle.inputTextStyle}
                            // onChangeText={this.onPostTitleChanged.bind(this)}
                            value={this.state.title}
                            onChangeText={(text) => this.setState({ title: text })}
                            multiline={false} />
                        <View style={EditNoticeBoardPostStyle.viewContainer}>
                            <Text style={EditNoticeBoardPostStyle.labelStyle}>{Strings.ADD_MEMBERS}<Text style={{ color: 'red' }}>*</Text></Text>
                            <View style={EditNoticeBoardPostStyle.amenitiesListViewStyle}>
                                <FlatList
                                    numColumns={1}
                                    data={this.state.listData}
                                    extraData={this.state}
                                    renderItem={this.renderItem}
                                />
                            </View>
                        </View>

                        <View style={EditNoticeBoardPostStyle.viewContainer}>
                            <View style={EditNoticeBoardPostStyle.addPropertyInputContainer}>

                                <Text style={EditNoticeBoardPostStyle.labelStyle}>
                                    {Strings.AGENDA_AND_RESOLUTIONS}<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <TextInput style={EditNoticeBoardPostStyle.inputDescriptionTextStyle}
                                    // onChangeText={this.onPostAgendaChanged.bind(this)}
                                    value={this.state.agenda_resolution}
                                    onChangeText={(text) => this.setState({ agenda_resolution: text })}
                                    multiline={true} />
                            </View>
                        </View>

                        <View style={EditNoticeBoardPostStyle.viewContainer}>
                            <View style={EditNoticeBoardPostStyle.addPropertyInputContainer}>

                                <Text style={EditNoticeBoardPostStyle.labelStyle}>
                                    {Strings.POST_DETAILS_OR_DESCRIPTIONS}<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <TextInput style={EditNoticeBoardPostStyle.inputDescriptionTextStyle}
                                    // onChangeText={this.onPostDescriptionChanged.bind(this)}
                                    value={this.state.description}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    multiline={true} />
                            </View>
                        </View>

                        <View style={EditNoticeBoardPostStyle.viewContainer}>
                            <View style={EditNoticeBoardPostStyle.addPropertyInputContainer}>

                                <Text style={EditNoticeBoardPostStyle.labelStyle}>
                                    {Strings.THREAD_ENABLE_SUGGESTION}
                                </Text>

                            </View>
                        </View>

                        <View style={EditNoticeBoardPostStyle.viewContainer}>

                            <CheckBox

                                label={Strings.YES_ALLOW_THREAD}
                                labelStyle={EditNoticeBoardPostStyle.amenitisListCheckboxLabelStyle}
                                checked={this.state.isThread}
                                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                uncheckedImage={ImagePath.UNCHECK}
                                onChange={this.onCheckBoxClick.bind(this)}
                            />

                        </View>

                    </View>
                </ScrollView>
                <View style={EditNoticeBoardPostStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={this.onEdit.bind(this)}>
                        <View style={EditNoticeBoardPostStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditNoticeBoardPostStyle.proceedButtonTextStyle}>
                                {Strings.SUBMIT_REQUEST}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {this.state.showLoader ? (
          <View style={CommonStyles.circles}>
            <Progress.CircleSnail
              color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
            />
          </View>
        ) : null}
            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        noticeBoardReducer: state.noticeBoardReducer,
        noticeBoardAddPostReducer: state.noticeBoardAddPostReducer
    }
}

export default connect(
    mapStateToProps,
    {
        resetState,
        showLoading,
        getUserRolesList,
        AddPostSubmitRequest,
        postAgendaChanged,
        postDescriptionChanged,
        postTitleChanged,
    }

)(EditNoticeBoardPost);

