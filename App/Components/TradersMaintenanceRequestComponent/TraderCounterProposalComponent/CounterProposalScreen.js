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
    AsyncStorage,
    Modal
} from 'react-native';

import {
    counterProposalReq
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    getCounterProposalData,
    uploadMaintenaceImage,
    clearCounterProposalRes
} from "./CounterProposalAction";

import {

    updateScene
} from "../TradersMaintenanceRequestDetailsComponent/ThreadComponent/ChatAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import API from '../../../Constants/APIUrls';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import CounterProposalStyle from './CounterProposalStyle';
import ImagePicker from 'react-native-image-picker';
import { EventRegister } from 'react-native-event-listeners'
import DatePicker from 'react-native-datepicker'
import ActionSheet from 'react-native-actionsheet'
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var options = {
    title: 'Select Property Image',
    quality: 1,
    customButtons: [
        { name: 'Ownly', title: 'Choose Photo' },
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const CANCEL_INDEX = 2
const DESTRUCTIVE_INDEX = 3
const actionOptions = ['Upload Photo', 'Take Photo', 'Cancel']

var uploadImagesArray = [];
var uploadedImagesPath = []
let contextRef;

class CounterProposalScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            budget: '',
            detail: '',
            minDate: Moment().format('MMM DD YYYY'),

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentDidUpdate() {


        //this.onUploadImageSuccess();
        this.onCounterProposalReqSuccess();
    }

    componentWillMount() {
        //this.callGetAgencyProperty();
        this.getRoleId()
    }


    callBack() {
        Actions.pop();
    }




    onBudgetChange(text) {

        this.setState({ budget: text });

    }

    onReqDetailChange(text) {

        this.setState({ detail: text });

    }


    callCounterProposalReqApi() {
        // this.props.onChange()
        
        // if (this.state.budget.trim() == '') {

        // }
        
         if (this.state.date == '' || this.state.date == undefined) {

        }
        else if (this.state.detail.trim() == '') {

        }
        else {

            
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    
                    var postData = {
                        maintenance_id: this.props.maintenanceId,
                        message: this.state.detail,
                        proposal_created_by: userData.data._id,
                        proposed_price:this.state.budget ? parseInt(this.state.budget):0,
                        proposed_date: Moment(this.state.date).format(),
                        proposal_created_role: this.state.roleId
                    };
                    // var postData = {
                    //     maintenance_id: "5d2580458330d2142f3211ee",
                    //     message: "Test counter from agency static",
                    //     proposal_created_by: "5bb309161ef59b3239a0da13",
                    //     proposal_created_role: "5a1d113016bed22901ce050b",
                    //     proposed_date: "2019-07-17T18:30:00.000Z",
                    //     proposed_price: 75
                    // }
                    
                    this.props.showLoading();
                    this.props.counterProposalReq(authToken, postData);
                }
            }).done();
        }



    }


    getRoleId() {

        AsyncStorage.getItem("roleId").then((value) => {
            if (value) {
                
                this.setState({ roleId: value });
            }
        }).done();
    }





    showCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {

            
            if (response.didCancel) {
                
            }
            else if (response.error) {
                
            }
            else if (response.customButton) {
                
            }
            else {

                response.data = '';
                let source = { uri: response.uri };
                var path = response.uri.replace("file://", "");
                let imagePath = (Platform.OS == 'ios') ? path : response.path;
                var imageItem = {
                    'url': source,
                    'path': imagePath,
                    'isSelected': 0
                }
                if (uploadImagesArray.length < 20) {
                    uploadImagesArray.push(imageItem);
                    var imagagesData = {
                        'imageArray': uploadImagesArray
                    }
                    this.setState({ uploadImagesData: imagagesData });
                }
                else {
                    alert(Strings.MAX_IMAGE_LIMIT);
                }

                if (uploadImagesArray.length == 1) {
                    this.uploadImageListSelection(0);
                }
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        //this.props.showLoading();
                        
                        this.props.showLoading();
                        this.props.uploadMaintenaceImage(authToken, response.uri.replace("file://", ""));
                    }
                }).done();

            }

        });
    }

    showImageLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {

            
            if (response.didCancel) {
                
            }
            else if (response.error) {
                
            }
            else if (response.customButton) {
                
            }
            else {

                let source = { uri: response.uri };
                let imagePath = (Platform.OS == 'ios') ? response.origURL : response.path;
                var imageItem = {
                    'url': source,
                    'path': imagePath,
                    'isSelected': 0
                }
                if (uploadImagesArray.length < 20) {
                    uploadImagesArray.push(imageItem);
                    var imagagesData = {

                        'imageArray': uploadImagesArray
                    }
                    this.setState({ uploadImagesData: imagagesData });
                }
                else {
                    alert(Strings.MAX_IMAGE_LIMIT);
                }

                if (uploadImagesArray.length == 1) {
                    this.uploadImageListSelection(0);
                }
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        //this.props.showLoading();
                        
                        this.props.showLoading();
                        this.props.uploadMaintenaceImage(authToken, response.uri.replace("file://", ""));
                    }
                }).done();

            }

        });
    }

    onUploadImageSuccess() {

        if (this.props.newMaintenanceRequestReducer.imageUploadRes != '') {
            if (this.props.newMaintenanceRequestReducer.imageUploadRes.code == 200) {
                var imagePath = {
                    path: this.props.newMaintenanceRequestReducer.imageUploadRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {
                alert(this.props.newMaintenanceRequestReducer.imageUploadRes.message);
            }
            this.props.clearUploadedImageRes();
        }
    }

    onCounterProposalReqSuccess() {

        
        if (this.props.counterProposalReducer.counterProposalRes != '') {
            if (this.props.counterProposalReducer.counterProposalRes.code == 200) {
                EventRegister.emit('updateCounter')
                // var proposalId=this.props.counterProposalReducer.counterProposalRes.proposal_data?this.props.counterProposalReducer.counterProposalRes.proposal_data._id:'';
                // AsyncStorage.setItem("counterProposalId", JSON.stringify(this.props.counterProposalReducer.counterProposalRes));
                this.props.updateScene(this.props.counterProposalReducer.counterProposalRes);
                setTimeout(() => {
                    Actions.pop();
                    Actions.pop();
                }, 2000);

            }
            else {

                alert(this.props.counterProposalReducer.counterProposalRes.message);
            }
            this.props.clearCounterProposalRes();
        }
    }

    showActionSheet() {

        this.ActionSheet.show()
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
                <Text style={CommonStyles.navBarTitleTextView}>{'Counter Proposal'}</Text>
                <TouchableOpacity onPress={() => this.callBack()} style={CommonStyles.navRightImageView}>
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    uploadImageListSelection(index) {

        
        
        this.setState({ selectedImage: this.state.uploadImagesData.imageArray[index].url });
        var tempData = this.state.uploadImagesData;
        var tempArray = this.state.uploadImagesData.imageArray;
        tempArray.map((data, position) => {

            if (index == position) {

                if (tempArray[index].isSelected == 0) {
                    tempArray[index].isSelected = 1;
                }

            }
            else {
                tempArray[position].isSelected = 0;
            }


        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });

    }

    renderItem({ item, index }) {

        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={CounterProposalStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={CounterProposalStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={CounterProposalStyle.selectedImageStyle}>
                        <View style={CounterProposalStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={CounterProposalStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }




    render() {


        return (
            <View style={CounterProposalStyle.mainContainer}>
                {this.navBar()}


                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CounterProposalStyle.scrollViewContainerStyle}>


                    <View style={CounterProposalStyle.addPropertyInputContainer}>




                        <Text style={CounterProposalStyle.labelStyle}>
                            Proposed Price(AUD)
                        </Text>
                        <View style={CounterProposalStyle.searchViewStyle}>
                            <TextInput
                                ref='refBudget'
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType='numeric'
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={CounterProposalStyle.searchTextInputStyle}
                                onChangeText={this.onBudgetChange.bind(this)}
                                value={this.state.budget}
                                onSubmitEditing={(event) => { this.refs.refReqDetail.focus(); }}
                            />
                        </View>

                        <Text style={CounterProposalStyle.labelStyle}>
                            Proposed Date
                        </Text>
                        <View style={CounterProposalStyle.searchViewStyle}>
                            <DatePicker
                                style={CounterProposalStyle.datePickerStyle}
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
                                onDateChange={(date) => { this.setState({ date: date }) }}
                            />
                        </View>
                        <Text style={CounterProposalStyle.labelStyle}>
                            Message
                        </Text>
                        <TextInput
                            ref='refReqDetail'
                            style={CounterProposalStyle.inputDescriptionTextStyle}
                            multiline={true}
                            onChangeText={this.onReqDetailChange.bind(this)}
                            value={this.state.detail}

                        />



                    </View>
{/* 
                    <View>

                        <View style={CounterProposalStyle.uploadImageListContainerView}>
                            <Text style={CounterProposalStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage != ''
                                    ?
                                    <Image source={this.state.selectedImage} style={CounterProposalStyle.uploadPropertyImageStyle} />
                                    :
                                    null
                            }
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.uploadImagesData.imageArray ?
                                        <FlatList
                                            horizontal={true}
                                            data={this.state.uploadImagesData.imageArray}
                                            renderItem={this.renderItem}
                                            extraData={this.state}
                                        /> : null
                                }

                            </View>
                            <TouchableOpacity style={CounterProposalStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={CounterProposalStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> */}



                </KeyboardAwareScrollView>



                <View style={CounterProposalStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={() => this.callCounterProposalReqApi()}>
                        <View style={CounterProposalStyle.roundedBlueProceedButtonStyle}>
                            <Text style={CounterProposalStyle.proceedButtonTextStyle}>
                                {/* {Strings.SUBMIT_REQUEST} */}
                                Submit proposal
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={actionOptions}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />

                {


                    this.props.counterProposalReducer.isScreenLoading ?
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
        counterProposalReducer: state.counterProposalReducer
    }
}

export default connect(
    mapStateToProps,
    {


        showLoading,
        resetState,
        counterProposalReq,
        getCounterProposalData,
        uploadMaintenaceImage,
        updateScene,
        clearCounterProposalRes


    }

)(CounterProposalScreen);


