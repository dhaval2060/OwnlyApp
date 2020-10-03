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
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import UserRoleScreenStyle from './UserRoleScreenStyle';
//import listData from  '../../../../data';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';

import {
    saveUserMultipleRoles,
    getUserRoles,
    getUserRolesList,
} from "../../../Action/ActionCreators";
import {

    resetState,
    showLoading

} from "./SettingUserRoleAction";
var contextRef;
var selectedRolesData=[];
class UserRoleScreen extends Component {
    constructor() {
        super();
        this.state = {
            userRolesData:[],
            activeUserRoleData:{},
        };
        contextRef=this;
    }

    componentDidUpdate() {
        this.onUserRoleSuccess();
        this.onGetUserRoleSuccess();
        this.onSaveRoleSuccess();
    }

    componentWillMount() {

         this.callGetUserRoles();
    }

    onUserRoleSuccess(){

        if(this.props.settingUserRoleReducer.userRoleData!=''){
            if(this.props.settingUserRoleReducer.userRoleData.code==200){
                
                this.setState({userRolesData:this.prepareUserRoleData(this.props.settingUserRoleReducer.userRoleData.data)});              
            }
            else{

                alert(this.props.settingUserRoleReducer.userRoleData.message);
            }
            this.props.resetState();
        }
      
    }

    callGetUserRoles() {


        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);             
                this.setState({logedinUserData:userData});
                var authToken = userData.token;
                var postData = {
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getUserRoles(authToken, postData);
            }

        }).done();
    }

    onGetUserRoleSuccess(){

        if(this.props.settingUserRoleReducer.userActiveRoleData!=''){

            if(this.props.settingUserRoleReducer.userActiveRoleData.code==200){

                this.setState({activeUserRoleData:this.props.settingUserRoleReducer.userActiveRoleData.data});               
                this.props.getUserRolesList();  

            }
            else{

                alert(this.props.settingUserRoleReducer.userActiveRoleData.message);

            }
            this.props.resetState();
        }
    }

    callSaveUserRoles() {

         this.state.userRolesData.map((data, index) => {


                if(this.state.userRolesData[index].isSelected){
                     
                     selectedRolesData.push(this.state.userRolesData[index]._id); 
                                    
                }
               
        })     

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);             
                this.setState({logedinUserData:userData});
                var authToken = userData.token;
                var postData = {
                    user_id: userData.data._id,
                    roles:selectedRolesData
                   
                }
                
                this.props.showLoading();
                this.props.saveUserMultipleRoles(authToken, postData);
            }

        }).done();
    }

    onSaveRoleSuccess(){

        if(this.props.settingUserRoleReducer.saveUserRolesRes!=''){
            if(this.props.settingUserRoleReducer.saveUserRolesRes.code==200){
                 selectedRolesData=[];
                 
            }
            else{
                alert(this.props.settingUserRoleReducer.saveUserRolesRes.message);
            }
            this.props.resetState();
        }
       
    }



    renderItem({ item, index }) {

       

        return (
            <View style={UserRoleScreenStyle.amenitiesListItemContainerStyle}>

                <CheckBox

                    label={item.description}
                    labelStyle={UserRoleScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isSelected}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE }
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef,index)}
                />
            </View>
        );
    }

    onCheckBoxChangeListener(index){
        
        var tempData=this.updateCheckBoxSelection(index,this.state.userRolesData);
        this.setState({userRolesData:tempData});
    }

    updateCheckBoxSelection(selectedIndex,userRolesData){

        var tempArray = userRolesData;
        tempArray.map((data, index) => {


           if(tempArray[selectedIndex].isSelected){
                tempArray[selectedIndex].isSelected = false;
              
              
           }
           else{
                tempArray[selectedIndex].isSelected = true;     
           } 

           
        })
      
        return tempArray;      

    }

    prepareUserRoleData(rolesData){

        var tempArray =[];
        var activeRole=this.state.activeUserRoleData.finalId;
        tempArray = rolesData;
        if(tempArray.length>0){
            tempArray.map((data, index) => {
            
                if(activeRole!=null&&activeRole!=undefined){

                    if(activeRole.includes(tempArray[index]._id)){

                        tempArray[index].isSelected = true;
                    }
                    else{

                        tempArray[index].isSelected = false;
                    }
                }
                else{

                     tempArray[index].isSelected = false;
                }
               
               
               
            })
            
        }
        return tempArray;      
    }



    render() {

        return (
            <View style={UserRoleScreenStyle.settingContainerStyle}>
                <View style={UserRoleScreenStyle.viewContainer}>
                    <Text style={UserRoleScreenStyle.labelStyle}>{Strings.MODIFY_YOUR_USER_ROLE}</Text>
                    <View style={UserRoleScreenStyle.amenitiesListViewStyle}>
                        <FlatList

                            data={this.state.userRolesData}
                            extraData={this.state}
                            renderItem={this.renderItem}
                        />
                    </View>
                </View>

                <View style={UserRoleScreenStyle.bottomViewStyle} >
                    <TouchableOpacity onPress={this.callSaveUserRoles.bind(this)}>
                        <View style={UserRoleScreenStyle.roundedBlueSaveButtonStyle}>
                            <Text style={UserRoleScreenStyle.saveButtonTextStyle}>
                                {Strings.SAVE_CHANGES}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.props.settingUserRoleReducer.isScreenLoading ?
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
        settingUserRoleReducer: state.settingUserRoleReducer
    }
}

export default connect(
    mapStateToProps,
    {   
        saveUserMultipleRoles,
        getUserRolesList,
        getUserRoles,
        resetState,
        showLoading
    }

)(UserRoleScreen)

