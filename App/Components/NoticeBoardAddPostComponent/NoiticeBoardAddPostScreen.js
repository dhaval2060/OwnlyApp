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
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import NoticeBoardAddPostScreenStyle from './NoticeBoardAddPostScreenStyle';
import CheckBox from 'react-native-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
////import listData from  '../../../data';

import {
    AddPostSubmitRequest,
} from "../../Action/ActionCreators";

import {
    postAgendaChanged,
    postDescriptionChanged,
    postTitleChanged,
    resetState,
    showLoading
} from "./NoticeBoardAddPostAction";


let propertyType = [{
    value: 'Andy Harrison',
},
{
    value: 'Jack Williams',
}];
let contextRef;
var amenitiesSelectedArrray = [];
var selectedRolesData = [];

class NoticeBoardAddPostScreen extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {},
            listData: [],
            isThread: false,
            errorMsg: '',
            errorOnTextField: '',
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onAddPostSuccess();
    }

    componentWillUnmount() {
        amenitiesSelectedArrray = [];
        selectedRolesData = [];
    }
    componentWillMount() {
        
        
        this.setState({ listData: this.prePareAmenitiesData(this.props.assignedRoles) });
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
        Actions.pop({ refresh: { variable: true } })
    }

    callBack() {
        Actions.pop({ refresh: { variable: true } })
    }

    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NEW_POST}</Text>
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

            tempArray[index].isChecked = false;
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

    renderItem({ item, index }) {
        
        return (
            <View style={NoticeBoardAddPostScreenStyle.amenitiesListItemContainerStyle}>
                <CheckBox
                    label={item.role_id.description}
                    labelStyle={NoticeBoardAddPostScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
    }


    submitRequest() {

        this.state.listData.map((data, index) => {


            if (this.state.listData[index].isChecked) {

                var rolesObj = {
                    _id: this.state.listData[index].role_id._id
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
                this.props.onRefresh(true);
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={NoticeBoardAddPostScreenStyle.scrollViewContainerStyle}>

                    <View style={NoticeBoardAddPostScreenStyle.headerContainer}>
                        <Text style={NoticeBoardAddPostScreenStyle.labelStyle}>
                            {Strings.POST_TITLE}<Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <TextInput style={NoticeBoardAddPostScreenStyle.inputTextStyle}
                            onChangeText={this.onPostTitleChanged.bind(this)}
                            multiline={false} />
                        <View style={NoticeBoardAddPostScreenStyle.viewContainer}>
                            <Text style={NoticeBoardAddPostScreenStyle.labelStyle}>{Strings.ADD_MEMBERS}<Text style={{ color: 'red' }}>*</Text></Text>
                            <View style={NoticeBoardAddPostScreenStyle.amenitiesListViewStyle}>
                                <FlatList
                                    numColumns={1}
                                    data={this.state.listData}
                                    extraData={this.state}
                                    renderItem={this.renderItem}
                                />
                            </View>
                        </View>

                        <View style={NoticeBoardAddPostScreenStyle.viewContainer}>
                            <View style={NoticeBoardAddPostScreenStyle.addPropertyInputContainer}>

                                <Text style={NoticeBoardAddPostScreenStyle.labelStyle}>
                                    {Strings.AGENDA_AND_RESOLUTIONS}<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <TextInput style={NoticeBoardAddPostScreenStyle.inputDescriptionTextStyle}
                                    onChangeText={this.onPostAgendaChanged.bind(this)}
                                    multiline={true} />
                            </View>
                        </View>

                        <View style={NoticeBoardAddPostScreenStyle.viewContainer}>
                            <View style={NoticeBoardAddPostScreenStyle.addPropertyInputContainer}>

                                <Text style={NoticeBoardAddPostScreenStyle.labelStyle}>
                                    {Strings.POST_DETAILS_OR_DESCRIPTIONS}<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <TextInput style={NoticeBoardAddPostScreenStyle.inputDescriptionTextStyle}
                                    onChangeText={this.onPostDescriptionChanged.bind(this)}
                                    multiline={true} />
                            </View>
                        </View>

                        <View style={NoticeBoardAddPostScreenStyle.viewContainer}>
                            <View style={NoticeBoardAddPostScreenStyle.addPropertyInputContainer}>

                                <Text style={NoticeBoardAddPostScreenStyle.labelStyle}>
                                    {Strings.THREAD_ENABLE_SUGGESTION}
                                </Text>

                            </View>
                        </View>

                        <View style={NoticeBoardAddPostScreenStyle.viewContainer}>

                            <CheckBox

                                label={Strings.YES_ALLOW_THREAD}
                                labelStyle={NoticeBoardAddPostScreenStyle.amenitisListCheckboxLabelStyle}
                                checked={this.state.isThread}
                                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                uncheckedImage={ImagePath.UNCHECK}
                                onChange={this.onCheckBoxClick.bind(this)}
                            />

                        </View>

                    </View>
                </ScrollView>
                <View style={NoticeBoardAddPostScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={this.submitRequest.bind(this)}>
                        <View style={NoticeBoardAddPostScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={NoticeBoardAddPostScreenStyle.proceedButtonTextStyle}>
                                {Strings.SUBMIT_REQUEST}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        noticeBoardAddPostReducer: state.noticeBoardAddPostReducer
    }
}

export default connect(
    mapStateToProps,
    {
        resetState,
        showLoading,
        AddPostSubmitRequest,
        postAgendaChanged,
        postDescriptionChanged,
        postTitleChanged,
    }

)(NoticeBoardAddPostScreen);

