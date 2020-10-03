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
    FlatList,
    Modal
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditNoticeBoardScreenStyle from './EditNoticeBoardScreenStyle';
import CheckBox from 'react-native-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';

var selectedRolesData=[];
var selectedPropertyData=[];
let propertyType = [{
    value: '1002944 : Apartment 901, Building 4, R',
}, {
    value: 'Rental',
}];
let contextRef;
var amenitiesSelectedArrray = [];


import {
    getUserRolesList,
    getMaintenancePropertyList,
    editNotice,
    getPropertyListForCreateNotice
} from "../../../Action/ActionCreators";

import {
    noticeDescriptionChanged,
    noticeNameChanged,
    resetState,
    showLoading
} from "../NoticeBoardAction";

class EditNoticeBoardScreen extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {},
            userRolesData: [],
      isLoading:true,
            propertyListData: [],
            errorMsg: '',
            errorOnTextField: '',
            isPropertyModal:false
        };
        contextRef = this;
    }

    componentDidUpdate() {

        
        this.onUserRoleSuccess();
        this.onPropertyListSuccess();
        this.onUpdateNoticeboardSuccess();
    }

    componentWillUnmount() {
    
        
        amenitiesSelectedArrray = [];
        selectedRolesData=[];
        selectedPropertyData=[];
    }

    componentWillMount() {
        
        this.callPropertyList();
        this.callUserRoleList();
    }

    onPostNameChange(text) {

        this.props.noticeNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPostDescriptionChange(text) {

        this.props.noticeDescriptionChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    prepareRolesData(userRoles){

        var selectedRoles=this.props.noticeDetails[0].assign_to_roles;
        if(selectedRoles!=undefined){
           
            var tempArray=userRoles;
            tempArray.map((data, index) => {
    
                selectedRoles.map((data, innerIndex) => {
                    if(tempArray[index]._id==selectedRoles[innerIndex].role_id._id){
                        tempArray[index].isSelected = true;
                    }
                   
                })
               
            })
            
            return tempArray;
        }
      

    }


    submitRequest() {

        this.state.userRolesData.map((data, index) => {

            if (this.state.userRolesData[index].isSelected) {
                var roleObj={
                    _id:this.state.userRolesData[index]._id
                }
                selectedRolesData.push(roleObj);

            }

        })
        let selectedProperty=[]
        const arr = this.state.propertyListData.filter((val) => {
          if(val.isSelected == true)
          {
            
             selectedProperty.push(val.id)
          }
        });
        
   
        if(selectedPropertyData.length==0){
            alert('Please select property');
        }
        else if(selectedRolesData.length==0){
            alert('Please select roles');
        }
        else{
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
    
                    var userData = JSON.parse(value);
                    this.setState({ logedinUserData: userData });
                    var authToken = userData.token;
                    var postData = {
                        _id:this.props.noticeDetails[0]._id,
                        agency_id: userData.data.agency_id,
                        assign_to_roles: selectedRolesData,
                        created_by: userData.data._id,
                        //description: this.props.postDescriptionChanged,
                        propertiesArr: selectedProperty,
                        //title: this.props.postNameChanged,
                    }
    
                    
                    this.props.showLoading();
                    this.props.editNotice(authToken, postData);
                }
    
            }).done();
        }

   
    }


    callUserRoleList() {
        this.props.getUserRolesList();
    }

    onUserRoleSuccess() {

        if (this.props.noticeBoardReducer.userRoleData != '') {
            if (this.props.noticeBoardReducer.userRoleData.code == 200) {
                
                this.setState({ userRolesData: this.prepareRolesData(this.props.noticeBoardReducer.userRoleData.data) });
            }
            else {
                
                alert(this.props.noticeBoardReducer.userRoleData.message);
            }
            this.props.resetState();
        }
    }


    callPropertyList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                // var postData = {
                //     agency_id: userData.data.agency_id,
                //     request_by_role: userData.data.role_id,
                //     request_by_id: userData.data._id,
                // }
                //this.props.showLoading();
        
                this.props.getPropertyListForCreateNotice(authToken);
            }
        }).done();
    }

    onUpdateNoticeboardSuccess() {
        
       
        if (this.props.noticeBoardReducer.noticeBoardUpdateRes != '') {
            if (this.props.noticeBoardReducer.noticeBoardUpdateRes.code == 200) {
                Actions.pop();
        this.props.onRefresh();
                //this.setState({ propertyListData: this.preparePropertyListDropdownData(this.props.noticeBoardReducer.propertyListData.data) });
            }
            else {
                alert(this.props.noticeBoardReducer.noticeBoardUpdateRes.message);
            }
            this.props.resetState();
        }
    }


    onPropertyListSuccess() {

        if (this.props.noticeBoardReducer.propertyListData != '') {
            if (this.props.noticeBoardReducer.propertyListData.code == 200) {
                          this.setState({isLoading:false, propertyListData: this.prepareSelectedPropertyData(this.preparePropertyListDropdownData(this.props.noticeBoardReducer.propertyListData.data) )});
            }
            else {
                alert(this.props.noticeBoardReducer.propertyListData.message);
            }
            this.props.resetState();
        }
    }


    preparePropertyListDropdownData(propertyListData) {
      
        var tempArray = propertyListData;
        tempArray.map((data, index) => {
 
            tempArray[index].value = tempArray[index].address;
            tempArray[index].id = tempArray[index]._id;
            tempArray[index].isSelected = false;

        })
        
        return tempArray;
    }

    prepareSelectedPropertyData(propertyListData){

        var selectedProperty=this.props.noticeDetails[0].property_id_arr;
        if(selectedProperty!=undefined){
           
            var tempArray=propertyListData;
            tempArray.map((data, index) => {
                selectedProperty.map((data, innerIndex) => {
                    if(tempArray[index]._id==selectedProperty[innerIndex]._id){
                        if(tempArray[index].isSelected==false){
                            tempArray[index].isSelected = true;
                            selectedPropertyData.push(tempArray[index]._id);
                        }
                        else{
                            tempArray[index].isSelected = false;
                        }
                       
                    }
                   
                })
               
            })
            
            return tempArray;
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
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.EDIT_NOTICE_BOARD}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
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

    userRoleRenderItem({ item, index }) {
        return (
            <View style={EditNoticeBoardScreenStyle.amenitiesListItemContainerStyle}>

                <CheckBox
                    label={item.description}
                    labelStyle={EditNoticeBoardScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isSelected}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
    }

    propertyListItem({ item, index }) {
        return (
            <View style={EditNoticeBoardScreenStyle.propertyRenderListStyle}>

                <CheckBox
                    label={item.address}
                    labelStyle={EditNoticeBoardScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isSelected}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onPropertyCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
    }

    selectedPropertyRenderItem({ item, index }){
        
        if(item.isSelected){
            return (

                <View style={EditNoticeBoardScreenStyle.selectedPropertyRenderListStyle}>
                        
                        {
                            item.isSelected?<Text>
                                {item.address}
                             </Text>:null
                        }
                    
                </View>
            );
        }
        else{
            return null
        }
      
    }
    onCheckBoxChangeListener(index) {
        
        var tempData = this.updateCheckBoxSelection(index, this.state.userRolesData);
        this.setState({ userRolesData: tempData });
    }

    onPropertyCheckBoxChangeListener(index) {
        
        var tempData = this.updatePropertyCheckBoxSelection(index, this.state.propertyListData);
        this.setState({ propertyListData: tempData });
    }

    showPropertyModal(){
        if(this.state.isPropertyModal){
            this.setState({isPropertyModal:false});
        }
        else{
            this.setState({isPropertyModal:true});
        }
    }

    updatePropertyCheckBoxSelection(selectedIndex, propertyListData) {

        var tempArray = propertyListData;
        
        tempArray.map((data, index) => {
          
            if(selectedIndex==index){
                if (tempArray[selectedIndex].isSelected) {
                    tempArray[selectedIndex].isSelected = false;
                    
                }
                else {
                    tempArray[selectedIndex].isSelected = true;
                    
                }
            }
           
        })

        return tempArray;

    }

    updateCheckBoxSelection(selectedIndex, userRolesData) {

        var tempArray = userRolesData;
        tempArray.map((data, index) => {

            if(selectedIndex==index){
                if (tempArray[selectedIndex].isSelected) {
                    tempArray[selectedIndex].isSelected = false;
                }
                else {
                    
                    tempArray[selectedIndex].isSelected = true;
                }
            }
        
        })

        return tempArray;

    }
    onCancel(){
        this.showPropertyModal();
    }
    onDone(){
       
        this.state.propertyListData.map((data, index) => {

            if (this.state.propertyListData[index].isSelected) {
                if(!selectedPropertyData.includes(this.state.propertyListData[index]._id)){
                    selectedPropertyData.push(this.state.propertyListData[index]._id);
                }
                else{
                
                    selectedPropertyData.splice(index, 1);
                   
                }
               

            }

        })
        this.showPropertyModal();
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditNoticeBoardScreenStyle.scrollViewContainerStyle}>

                    {/* <View style={EditNoticeBoardScreenStyle.viewContainer}>
                        <View style={EditNoticeBoardScreenStyle.addPropertyInputContainer}>

                            <Text style={EditNoticeBoardScreenStyle.labelStyle}>
                                {Strings.POST_TITLE}
                            </Text>
                            <TextInput style={EditNoticeBoardScreenStyle.inputTextStyle}
                                multiline={false}
                                onChangeText={this.onPostNameChange.bind(this)} />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                    </View> */}

                    {/* <View style={EditNoticeBoardScreenStyle.viewContainer}>
                        <View style={EditNoticeBoardScreenStyle.addPropertyInputContainer}>

                            <Text style={EditNoticeBoardScreenStyle.labelStyle}>
                                {Strings.POST_DETAILS_OR_DESCRIPTIONS}
                            </Text>
                            <TextInput style={EditNoticeBoardScreenStyle.inputDescriptionTextStyle}
                                multiline={true}
                                onChangeText={this.onPostDescriptionChange.bind(this)} />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                    </View> */}

                    <View style={EditNoticeBoardScreenStyle.headerContainer}>
                     
                        <TouchableOpacity onPress={this.showPropertyModal.bind(this)} style={EditNoticeBoardScreenStyle.selectPropertyTextStyle}>
                             <Text >Select Property</Text>
                        </TouchableOpacity>

                        {selectedPropertyData.length>0?<View style={EditNoticeBoardScreenStyle.selectedPropertyListContainer}>
                          
                            <View style={EditNoticeBoardScreenStyle.selectedPropertyListViewStyle}>
                                <FlatList
                                    data={this.state.propertyListData}
                                    extraData={this.state}
                                    renderItem={this.selectedPropertyRenderItem}
                                />
                            </View>
                        </View>:null}
                        
                        {/* <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={EditNoticeBoardScreenStyle.dropDownViewStyle}
                            data={this.state.propertyListData}
                            value={this.state.propertyListData ? (this.state.propertyListData.length > 0 ? this.state.propertyListData[0].value : '') : ''}
                        /> */}
                    </View>

                  
                    <View style={EditNoticeBoardScreenStyle.addPropertyInputContainer}>
                        <Text style={EditNoticeBoardScreenStyle.labelStyle}>{Strings.ADD_MEMBERS}</Text>
                        <View style={EditNoticeBoardScreenStyle.amenitiesListViewStyle}>
                            <FlatList
                                data={this.state.userRolesData}
                                extraData={this.state}
                                renderItem={this.userRoleRenderItem}
                            />
                        </View>
                    </View>

                 


                </ScrollView>

                <View style={EditNoticeBoardScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={this.submitRequest.bind(this)}>
                        <View style={EditNoticeBoardScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditNoticeBoardScreenStyle.proceedButtonTextStyle}>
                                {Strings.UPDATE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

               {
                   this.state.isPropertyModal?
                   <Modal onRequestClose={() => { }} transparent >
                        <View style={{width:window.width, height:window.height, backgroundColor:Colors.TRANSLUCENT_BLACK_DARK}}>
                            <View style={EditNoticeBoardScreenStyle.propertyListSelction}>
                                <FlatList
                                   
                                    data={this.state.propertyListData}
                                    extraData={this.state}
                                    renderItem={this.propertyListItem}
                                />

                                <View style={EditNoticeBoardScreenStyle.modalButtonContainerStyle}>

                                    <TouchableOpacity onPress={this.onCancel.bind(this)}>
                                        <View style={EditNoticeBoardScreenStyle.roundedBlueProceedButtonStyle}>
                                            <Text style={EditNoticeBoardScreenStyle.modalButtonTextStyle}>
                                                {Strings.CANCEL}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onDone.bind(this)}>
                                        <View style={EditNoticeBoardScreenStyle.roundedBlueProceedButtonStyle}>
                                            <Text style={EditNoticeBoardScreenStyle.modalButtonTextStyle}>
                                                {Strings.DONE}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                         
                        </View>

                  

                </Modal>:null
               } 
 {this.state.isLoading ? (
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
        noticeBoardReducer: state.noticeBoardReducer
    }
}

export default connect(
    mapStateToProps,
    {
        resetState,
        showLoading,
        getUserRolesList,
        getMaintenancePropertyList,
        noticeDescriptionChanged,
        noticeNameChanged,
        editNotice,
        getPropertyListForCreateNotice
    }

)(EditNoticeBoardScreen);

