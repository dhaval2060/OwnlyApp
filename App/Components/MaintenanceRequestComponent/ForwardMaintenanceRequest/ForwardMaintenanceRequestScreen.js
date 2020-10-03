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
    Picker,
    FlatList,
    AsyncStorage
} from 'react-native';

import {
    forwardMaintenanceReq,
    getWatherList,
    getMaintenancePropertyList,
    getTradersOptionList,
} from "../../../Action/ActionCreators";

import {
    maintenanceReqDetailChanged,
    maintenanceReqNameChanged,
    propertyNameChanged,
    maintenanceBudgetChanged,
    searchWatcherChanged,
    tradersChanged,
    showLoading,
    resetState,
} from "./ForwardMaintenanceReqAction";


import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import ForwardMaintenanceRequestScreenStyle from './ForwardMaintenanceRequestScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../../Constants/APIUrls';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
let contextRef;
var watcherIdsArray=[];
class ForwardMaintenanceRequestScreen extends Component {
    constructor() {
        super();
        this.state = {
        
            tradersData:[],
            watcherData:[],
            tradersSearchedData:[],
            watcherSearchedData:[],
            selectedWatcherData:[],
            agencyData:[],
            isTraderListShow:false,
            isSearchWatcherListShow:false,
            selectedPropertyId:'',
            selectedTraderId:'',
            minDate: Moment().format('MMM DD YYYY'),
            reqData:'',

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }


    componentDidUpdate() {

        this.onGetAgencySuccess();
        this.onTradersOptionSuccess();
        this.onGetWatcherSuccess();
        this.onForwardMaintenanceReqSuccess();
    }


    componentWillMount() {
       this.setState({reqData:this.props.maintenanceReqData});
       
       this.callGetAgencyProperty();
    }

     setMaintenanceReqData(){
            
            var PropertyData={};
            var tradersData={};
            {
                this.state.reqData!=''
                ?
                PropertyData=this.state.reqData.property_id
                :{}
            }
            {
                this.state.reqData!=''
                ?
                tradersData=this.state.reqData.trader_id?this.state.reqData.trader_id:{}
                :{}
            }

            
            this.props.propertyNameChanged(PropertyData.address);
            this.setState({selectedPropertyId:PropertyData._id});
            if(JSON.stringify(tradersData)!='{}'){
                
                this.props.tradersChanged(tradersData.firstname+' '+tradersData.lastname);
            }
            this.setState({selectedTraderId:tradersData._id});
            this.props.maintenanceReqNameChanged(this.state.reqData.request_overview);
            this.props.maintenanceBudgetChanged(this.state.reqData.budget.toString());
            this.setState({date:Moment(this.state.date).format(Strings.DATE_FORMATE)});
            this.props.maintenanceReqDetailChanged(this.state.reqData.request_detail);
            this.pushWatcherData(this.state.reqData.watchers_list);
            
           


    }

    pushWatcherData(watcherData){
        
           
        
        watcherData.map((data, index) => {

            
            this.state.selectedWatcherData.push(watcherData[index].users_id);
            var tempData={
                _id:watcherData[index].users_id._id
            }
            watcherIdsArray.push(tempData);
        
        })


    }

    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }

  

    onPropertySelectChange(text) {

         this.props.propertyNameChanged(text);
         this.setState({selectedPropertyId:this.state.agencyData[this.refs.ref_property.selectedIndex()].id});

    }
    onBudgetChange(text) {

          this.props.maintenanceBudgetChanged(text);

    }
    onRequestNameChange(text) {

          this.props.maintenanceReqNameChanged(text);

    }
    onReqDetailChange(text) {

         this.props.maintenanceReqDetailChanged(text);

    }


    callGetTradersOptionRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getTradersOptionList(authToken, postData);
            }
        }).done();
    }    

    onTradersOptionSuccess(){

       
        if(this.props.forwardMaintenanceReqReducer.tradersListResponse!=''){
            
            if(this.props.forwardMaintenanceReqReducer.tradersListResponse.code==200){

                this.setState({tradersData:this.props.forwardMaintenanceReqReducer.tradersListResponse.data,tradersSearchedData:this.props.forwardMaintenanceReqReducer.tradersListResponse.data});
                this.callGetWatcherList();
            }   
            else{
                alert(this.props.forwardMaintenanceReqReducer.tradersListResponse.message);
            }
            this.props.resetState();
        }
      
    }

    callGetAgencyProperty() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    request_by_id: userData.data._id,
                    request_by_role: userData.data.role_id,
                }
                
                this.props.showLoading();
                this.props.getMaintenancePropertyList(authToken, postData);
            }
        }).done();
    }

    onGetAgencySuccess(){

          if(this.props.forwardMaintenanceReqReducer.agencyListResponse!=''){

            if(this.props.forwardMaintenanceReqReducer.agencyListResponse.code==200){

                this.setState({agencyData:this.preparePropertyData(this.props.forwardMaintenanceReqReducer.agencyListResponse.data)});
               
                this.callGetTradersOptionRequest();
            }   
            else{
                alert(this.props.forwardMaintenanceReqReducer.agencyListResponse.message);
            }
            this.props.resetState();
        }
    }


    callGetWatcherList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getWatherList(authToken, userData.data.agency_id);
            }
        }).done();
    }

    onGetWatcherSuccess(){

          if(this.props.forwardMaintenanceReqReducer.watcherListResponse!=''){

            if(this.props.forwardMaintenanceReqReducer.watcherListResponse.code==200){

                this.setState({watcherData:this.props.forwardMaintenanceReqReducer.watcherListResponse.data,watcherSearchedData:this.props.forwardMaintenanceReqReducer.watcherListResponse.data});              
               
            }   
            else{
                
                alert(this.props.forwardMaintenanceReqReducer.watcherListResponse.message);
            }
            this.props.resetState();
            this.setMaintenanceReqData();
        }
    }

    callForwardMaintenanceReqApi(){
        
         AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken=userData.token;
                   
                    var postData = {

                        maintenance_id:this.state.reqData._id,
                        created_by_role:userData.data.role_id,
                        agency_id:userData.data.agency_id,
                        trader_id:this.state.selectedTraderId,
                        property_id:this.state.selectedPropertyId,
                        request_overview: this.props.forwardMaintenanceReqReducer.maintenanceRequestName,
                        created_by: userData.data._id,
                        request_detail:this.props.forwardMaintenanceReqReducer.reqDetail,
                        budget: parseInt(this.props.forwardMaintenanceReqReducer.maintenanceBudget),
                        due_date: Moment(this.state.date).format(),
                        watchersList:watcherIdsArray

                    };       
                    
                    this.props.showLoading();
                    this.props.forwardMaintenanceReq(authToken,postData);
                }
            }).done();    
        
    }

    preparePropertyData(propertyList){
        var tempArray = [];
        propertyList.map((data, index) => {

           var tempData={

                value   : propertyList[index].address,
                id      : propertyList[index]._id
           }
           tempArray.push(tempData); 
        
        })
        
        return tempArray;      
    }

    onTraderNameChange(text){

        this.props.tradersChanged(text);
        this.setState({isTraderListShow:true});
        this.SearchFilterFunction(text);
    }  
    onWatcherNameChange(text){

        this.props.searchWatcherChanged(text);
        this.setState({isSearchWatcherListShow:true});
        this.SearchWatcherFunction(text);
    }

    showTraderList(){

        if(this.state.isTraderListShow==false){
            this.setState({isTraderListShow:true});
        }
        else{
             this.setState({isTraderListShow:false});
        }
    }   

    showSearchWatcherList(){

        if(this.state.isSearchWatcherListShow==false){
            
            this.setState({isSearchWatcherListShow:true});
        }
        else{

            this.setState({isSearchWatcherListShow:false});
        }
    } 





    onForwardMaintenanceReqSuccess() {

        if (this.props.forwardMaintenanceReqReducer.addPropertyRes != '') {
            if (this.props.forwardMaintenanceReqReducer.addPropertyRes.code == 200) {
                Actions.pop();
                watcherIdsArray=[];
            }
            else {
                alert(this.props.forwardMaintenanceReqReducer.addPropertyRes.message);
            }
            this.props.resetState();
        }
    }

  

    handlePress(i) {
        if (i == 0) {
            this.showImageLibrary();
        }
        else if (i == 1) {
            this.showCamera();
        }
    }

    navBar() {
        return (
            <View >

                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NEW_REQUEST}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }




    searchRenderItem({ item, index }) {
        
        return (

            <View style={ForwardMaintenanceRequestScreenStyle.serachListItemContainer} >
                <Image source={{ uri: API.USER_IMAGE_PATH+item.image }} style={ForwardMaintenanceRequestScreenStyle.searchListItemImageStyle} />
                <Text style={ForwardMaintenanceRequestScreenStyle.searchListItemTextStyle}>{item.firstname+' '+item.lastname}</Text>
                <Image source={ImagePath.DRAWER_CROSS_ICON} style={ForwardMaintenanceRequestScreenStyle.searchListItemCloseImageStyle} />
            </View>
        );
    }

    onTraderSelect(item){

        this.showTraderList();
        this.props.tradersChanged(item.name);
        this.setState({selectedTraderId:item._id});

    }
    onWatcherSelect(item){

        this.showSearchWatcherList();
        this.props.searchWatcherChanged('');
        this.state.selectedWatcherData.push(item);
        var tempData={
            _id:item._id
        }
        watcherIdsArray.push(tempData);
    }

    searchTradersItem({ item, index }) {

        return (

            <TouchableOpacity onPress={ contextRef.onTraderSelect.bind(contextRef,item)}>         
                <Text style={ForwardMaintenanceRequestScreenStyle.searchTraderListItemTextStyle}>{item.name}</Text>      
            </TouchableOpacity>
        );
    }   

    renderSearchWatcherItem({ item, index }) {

        return (

            <TouchableOpacity onPress={ contextRef.onWatcherSelect.bind(contextRef,item)}>         
                <Text style={ForwardMaintenanceRequestScreenStyle.searchTraderListItemTextStyle}>{item.firstname+' '+item.lastname}</Text>      
            </TouchableOpacity>
        );
    }

    renderItem({ item, index }) {

        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={ForwardMaintenanceRequestScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={ForwardMaintenanceRequestScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={ForwardMaintenanceRequestScreenStyle.selectedImageStyle}>
                        <View style={ForwardMaintenanceRequestScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={ForwardMaintenanceRequestScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    SearchFilterFunction(text){
     
         const newData = this.state.tradersData.filter(function(item){
             const itemData = item.name.toUpperCase()
             const textData = text.toUpperCase()
             return itemData.indexOf(textData) > -1
         })
         this.setState({
             tradersSearchedData: newData,
         })
    }   

    SearchWatcherFunction(text){
     
        
         const newData = this.state.watcherData.filter(function(item){
             
             const itemData = item.firstname.toUpperCase()
             const textData = text.toUpperCase()
             return itemData.indexOf(textData) > -1
         })
         this.setState({
             watcherSearchedData: newData,
         })
    }

    render() {

       
        return (
            <View style={ForwardMaintenanceRequestScreenStyle.mainContainer}>
                {this.navBar()}


                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ForwardMaintenanceRequestScreenStyle.scrollViewContainerStyle}>


                    <View style={ForwardMaintenanceRequestScreenStyle.addPropertyInputContainer}>

                        <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>
                        <Dropdown
                            ref='ref_property'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={ForwardMaintenanceRequestScreenStyle.dropDownTextStyle}
                            containerStyle={ForwardMaintenanceRequestScreenStyle.dropDownViewStyle}
                            data={this.state.agencyData}
                            onChangeText={this.onPropertySelectChange.bind(this)}
                            value={this.props.forwardMaintenanceReqReducer.propertyName}
                        />
                        <View style={ForwardMaintenanceRequestScreenStyle.labelContainerStyle}>
                            <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                                {Strings.SEARCH_TRADERS}
                            </Text>

                            <Text style={ForwardMaintenanceRequestScreenStyle.pickSavedTradersLabelStyle}>
                                {Strings.PICK_FROM_SAVED_TRADERS}
                            </Text>
                        </View>

                        <View style={ForwardMaintenanceRequestScreenStyle.searchViewStyle}>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}                      
                                placeholder={Strings.SEARCH_TRADERS}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ForwardMaintenanceRequestScreenStyle.searchTextInputStyle} 
                                onChangeText={this.onTraderNameChange.bind(this)}
                                value={this.props.forwardMaintenanceReqReducer.traderName}
                                 onSubmitEditing={(event)=>{this.refs.refReqName.focus();}}
                                />
                            <Image source={ImagePath.SEARCH_ICON} style={ForwardMaintenanceRequestScreenStyle.searchImageStyle} />
                        </View>
                        {   
                            (this.state.isTraderListShow==true)?
                                
                                    
                                        <FlatList
                                            style={ForwardMaintenanceRequestScreenStyle.modalContainerStyles}
                                            horizontal={false}
                                            data={this.state.tradersSearchedData}
                                            renderItem={this.searchTradersItem}
                                            extraData={this.state}
                                        />
                                        :null
                        }
                        

                        <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.REQUEST_NAME}
                        </Text>
                          <View style={ForwardMaintenanceRequestScreenStyle.searchViewStyle}>
                                <TextInput
                                    ref='refReqName'
                                    autoCapitalize='none'
                                    autoCorrect={false}                      
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={ForwardMaintenanceRequestScreenStyle.searchTextInputStyle} 
                                    onChangeText={this.onRequestNameChange.bind(this)}
                                    value={this.props.forwardMaintenanceReqReducer.maintenanceRequestName}
                                    onSubmitEditing={(event)=>{this.refs.refBudget.focus();}}
                                    />
                            </View>
                        <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.BUDGET_LABEL}
                        </Text>
                            <View style={ForwardMaintenanceRequestScreenStyle.searchViewStyle}>
                                <TextInput
                                    ref='refBudget'
                                    autoCapitalize='none'
                                    autoCorrect={false}                      
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={ForwardMaintenanceRequestScreenStyle.searchTextInputStyle} 
                                    onChangeText={this.onBudgetChange.bind(this)}
                                    value={this.props.forwardMaintenanceReqReducer.maintenanceBudget}
                                    onSubmitEditing={(event)=>{this.refs.refReqDetail.focus();}}
                                    />
                            </View>

                        <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.DUE_DATE}
                        </Text>
                         <View style={ForwardMaintenanceRequestScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={ForwardMaintenanceRequestScreenStyle.datePickerStyle}
                                date={this.state.date}
                                mode="date"
                                placeholder="select date"
                                format='MMM DD YYYY'
                                minDate={this.state.minDate}                         
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    top: 4,
                                    marginLeft: 0
                                  },
                                  dateInput: {
                                    marginLeft: 0,
                                    position: 'absolute',
                                    left: 5,
                                    borderBottomWidth: 0,
                                    borderLeftWidth: 0,
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                  }
                                  // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => {this.setState({date: date})}}
                              />
                        </View>
                        <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.REQUEST_DETAILS}
                        </Text>
                        <TextInput 
                            ref='refReqDetail'
                            style={ForwardMaintenanceRequestScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            onChangeText={this.onReqDetailChange.bind(this)}
                            value={this.props.forwardMaintenanceReqReducer.reqDetail}
                            onSubmitEditing={(event)=>{this.refs.refWatcher.focus();}}
                        />

                        <Text style={ForwardMaintenanceRequestScreenStyle.labelStyle}>
                            {Strings.TAG_WATCHER_FOR_REQUEST}
                        </Text>

                        <View style={ForwardMaintenanceRequestScreenStyle.searchViewStyle}>
                            <TextInput
                                ref='refWatcher'
                                placeholder={Strings.SEARCH}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ForwardMaintenanceRequestScreenStyle.searchTextInputStyle}
                                onChangeText={this.onWatcherNameChange.bind(this)}
                                value={this.props.forwardMaintenanceReqReducer.searchWatcherName}
                                 />
                            <Image source={ImagePath.SEARCH_ICON} style={ForwardMaintenanceRequestScreenStyle.searchImageStyle} />
                        </View>

                        {   
                            (this.state.isSearchWatcherListShow==true)?
                                
                                    
                                        <FlatList
                                            style={ForwardMaintenanceRequestScreenStyle.watcherListContainerStyles}
                                            horizontal={false}
                                            data={this.state.watcherSearchedData}
                                            renderItem={this.renderSearchWatcherItem}
                                            extraData={this.state}
                                        />
                                        :null
                        }
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={this.state.selectedWatcherData}
                            renderItem={this.searchRenderItem}
                            extraData={this.state}
                        />
                    </View>

                


                </KeyboardAwareScrollView>
              

              
                <View style={ForwardMaintenanceRequestScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={() => this.callForwardMaintenanceReqApi()}>
                        <View style={ForwardMaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ForwardMaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                                {Strings.SUBMIT_REQUEST}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            
                {


                        this.props.forwardMaintenanceReqReducer.isScreenLoading ?
                            <View style={CommonStyles.circles}>
                                <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                            </View>
                            : null

                }
            </View >
        );
    }
}
function mapStateToProps(state) {
    
    return {
        forwardMaintenanceReqReducer: state.forwardMaintenanceReqReducer
    }
}

export default connect(
    mapStateToProps,
    {   

 
        forwardMaintenanceReq,
        maintenanceReqDetailChanged,
        maintenanceReqNameChanged,
        propertyNameChanged,
        maintenanceBudgetChanged,
        searchWatcherChanged,
        getWatherList,
        tradersChanged,
        getMaintenancePropertyList,
        getTradersOptionList,
        showLoading,
        resetState,
    }

)(ForwardMaintenanceRequestScreen);


