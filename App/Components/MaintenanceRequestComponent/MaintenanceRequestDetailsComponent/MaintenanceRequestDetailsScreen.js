import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Button,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    FlatList,
    AsyncStorage,
    Modal
} from 'react-native';
import Moment from 'moment';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'
import {
    cancelMaintenanceReq,
    acceptDeclineProposalRequest,
    getMaintenanceReqDetail,
    addUserToFav,
} from "../../../Action/ActionCreators";
import Geolocation from '@react-native-community/geolocation';
import { EventRegister } from 'react-native-event-listeners'
import {

    showLoading,
    resetState,

} from "./MaintenanceRequestDetailsAction";
import ActionSheet from "react-native-actionsheet";
import SocketIOClient from 'socket.io-client';

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import MaintenanceRequestDetailsScreenStyle from './MaintenanceRequestDetailsScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import ThreadScreen from './ThreadComponent/ThreadScreen';
import TrackerScreen from './TrackerScreen';
import RequestDetailScreen from './RequestDetailScreen';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';
import { Matrics } from '../../../CommonConfig';
import COLORS from '../../../Constants/Colors';
import APICaller, { GetLocation, documentUpload, GETAPICaller } from '../../../Saga/APICaller';
import IMAGEPATH from '../../../Constants/ImagesPath';
import AddAgreementScreenStyle from '../../AgreementsComponent/AddAgreementComponent/AddAgreementScreenStyle';
let ref;
var UserID = '';
var ProposalID = '';
var ProposalPrice = '';
var ProposalAccepted = true;
var lastCounterProposalCreatedBy = ''
const actionOptions = ["Upload Photo", "Take Photo", "Document", "Cancel"];
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

const CANCEL_INDEX = 3;
const DESTRUCTIVE_INDEX = 3;
class MaintenanceRequestDetails extends Component {

    constructor(props) {
        super(props);
        ref = this;

        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        this.state = {
            isTabSelected: 0,
            requestModal: false,
            selectedtrader: {},
            documentsList: [],
            applicantsList: [],
            recommendedTraders: [],
            starCount: 3.5,
            maintenanceReqData: {},
            submitRequestLoader: false,
            reqBudget: "",
            reqDate: "",
            reqCategory: "",
            reqDescription: "",
            reqSubject: "",
            isScreenLoading: false,
            isShowPopup: false,
            roleName: '',
            maintenanceParams: props.navigation.state.params.maintenanceData
        };


        this.socket.on('maintenanceUserJoined', (data) => {
            this.socket.emit('maintenanceGroupChatHistory', { maintenanceId: this.state.maintenanceReqData._id, userId: UserID });
        });
        if (this.state.maintenanceParams && this.state.maintenanceParams.mr_last_chat != null) {
            lastCounterProposalCreatedBy = this.state.maintenanceParams.mr_last_chat.from._id

            if (UserID == lastCounterProposalCreatedBy) {

            }
        }

        this.socket.on('maintenanceGroupChatResponse', (historyRes) => {
            if (historyRes.length > 0) {
                const result = historyRes.find(item => (item.proposal_id != undefined), this);
                if (result != undefined) {
                    ProposalID = result.proposal_id._id
                    ProposalPrice = result.proposal_id.proposed_price
                    ProposalAccepted = result.proposal_id.is_proposal_accept
                }
            }
        })
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetMaintenanceDetailSuccess();
        this.onCancelMaintenanceReqSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getRoleName();
        this.callGetMaintenanceDetail(this.props.reqId);

        this.listener = EventRegister.addEventListener('updateCounter', (data) => {
            setTimeout(() => {
                this.callGetMaintenanceDetail(this.props.reqId);
            }, 500);

        })
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                let latitude = '';
                let longitude = '';

                var postData = {
                    // latitude: position.coords.latitude,
                    latitude: userData.data.location_latitude ? Number(userData.data.location_latitude) : -37.7431353,
                    limit: 12,
                    location: "yes",
                    longitude: userData.data.location_longitude ? Number(userData.data.location_longitude) : 145.0081354
                }
                APICaller('tradersList', 'POST', authToken, postData).then(data => {
                    if (data.code == 200) {
                        this.setState({ recommendedTraders: data.data })
                    }
                })
                var postData1 = {
                    maintenance_id: this.state.maintenanceReqData._id
                }
                APICaller('getCounterProposals', 'POST', authToken, postData1).then(data => {
                    if (data.code == 200) {
                        this.setState({ applicantsList: data.data })
                    }
                })

            }
        }).done();
    }

    closeNotifications() {
        Actions.pop();
    }
    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                this.setState({ roleName: value });
            }
        }).done();
    }
    callAcceptorDeclineRequest(isAccept, price) {

        AsyncStorage.getItem("SyncittUserInfo").then(async (value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {
                    proposal_id: ProposalID,
                    is_proposal_accept: true,
                    due_date: this.props.maintenanceData.maintentenance_counter_proposals[0].proposed_date,
                    price: Number(ProposalPrice)
                }

                // this.props.showLoading();
                EventRegister.emit('updateCounter', postData)
                await this.props.acceptDeclineProposalRequest(authToken, postData);
                this.callGetMaintenanceDetail()
            }
        }).done();

    }
    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onRequestedByTenentTabClick() {
        global.maintenanceData = this.props.maintenanceData
        this.setState({ isTabSelected: 3 });
    }
    onApplicantClick() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    maintenance_id: this.state.maintenanceReqData._id
                }
                APICaller('getCounterProposals', 'POST', authToken, postData).then(data => {
                    if (data.code == 200) {
                        this.setState({ applicantsList: data.data })
                    }
                })

            }
        }).done();
        this.setState({ isTabSelected: 4 });

    }
    onRecommendedTabClick() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    latitude: userData.data.location_latitude ? Number(userData.data.location_latitude) : -37.7431353,
                    limit: 12,
                    location: "yes",
                    longitude: userData.data.location_longitude ? Number(userData.data.location_longitude) : 145.0081354,
                    categories_id: this.state.maintenanceParams && this.state.maintenanceParams.categories_id && this.state.maintenanceParams.categories_id[0] && this.state.maintenanceParams.categories_id[0]._id
                }
                APICaller('tradersList', 'POST', authToken, postData).then(data => {
                    if (data.code == 200) {
                        this.setState({ recommendedTraders: data.data })
                    }
                })

            }
        }).done();
        this.setState({ isTabSelected: 5 });

    }

    callGetMaintenanceDetail(id) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;

                this.props.showLoading();
                this.props.getMaintenanceReqDetail(authToken, id);
            }
        }).done();
    }
    callCancelMaintenanceReq(id) {
        this.showPopup();
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.cancelMaintenanceReq(authToken, id);
            }
        }).done();
    }

    onCancelMaintenanceReqSuccess() {
        if (this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes != '') {

            if (this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.code == 200) {

                alert(this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.message);
                Actions.pop();
                //this.setState({maintenanceReqData:this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.data});              
            }
            else {

                alert(this.props.maintenanceRequestDetailsReducer.cancelMaintenanceReqRes.message);
            }
            this.props.resetState();
        }
    }

    handlePress = (i) => {
        if (i == 0) {
            this.showImageLibrary();
        } else if (i == 1) {
            this.showCamera();
        } else if (i == 2) {
            this.openFileChooser();
        }
    }
    async openFileChooser() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            let arr = this.state.documentsList
            const file = {
                uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: res.fileName == null ? 'image.jpg' : res.fileName, // e.g. 'image123.jpg',
                type: res.type // e.g. 'image/jpg'
            };
            arr.push(file)
            this.setState({ documentsList: arr })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    showCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, response => {

            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else {
                let arr = this.state.documentsList
                const file = {
                    uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                    name: response.fileName == null ? 'image.jpg' : response.fileName, // e.g. 'image123.jpg',
                    type: response.type // e.g. 'image/jpg'
                };
                arr.push(file)
                this.setState({ documentsList: arr })
            }
        });
    }

    showImageLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, response => {

            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else {
                let arr = this.state.documentsList
                const file = {
                    uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                    name: response.fileName == null ? 'image.jpg' : response.fileName, // e.g. 'image123.jpg',
                    type: response.type // e.g. 'image/jpg'
                };
                arr.push(file)
                this.setState({ documentsList: arr })
            }
        });
    }
    onGetMaintenanceDetailSuccess() {

        if (this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes != '') {

            if (this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.code == 200) {
                this.setState({ maintenanceReqData: this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.data });
                this.setState({ isTabSelected: 1 });

                AsyncStorage.getItem('SyncittUserInfo').then((value) => {
                    //debugger
                    if (value) {
                        var userData = JSON.parse(value);
                        UserID = userData.data._id;
                        this.socket.emit('addMaintenanceUsers', {
                            id: UserID,
                            maintenanceId: this.state.maintenanceReqData._id,
                            firstName: userData.data.firstname,
                            lastName: userData.data.lastname

                        });
                    }
                }).done();



            }
            else {

                alert(this.props.maintenanceRequestDetailsReducer.maintenanceReqDetailRes.message);
            }
            this.props.resetState();
        }
    }

    showPopup() {

        if (this.state.isShowPopup == false) {

            this.setState({ isShowPopup: true });
        }
        else {

            this.setState({ isShowPopup: false });
        }
    }
    callCounterProposalScreen() {
        this.setState({ isShowPopup: false, isTabSelected: 3 });
        Actions.CounterProposalScreen({ maintenanceId: this.state.maintenanceReqData._id, onChange: () => (console.log(this.props)) });

    }
    onRequestSubmit() {
        if (this.state.reqSubject == "") {
            alert("Please enter subject.")
        } else if (this.state.reqDescription == "") {
            alert("Please enter description.")
        } else if (this.state.reqName == "") {
            alert("Please enter name.")
        } else if (this.state.reqBudget == "") {
            alert("Please enter budget.")
        } else if (this.state.reqDate == "") {
            alert("Please select due date.")
        } else {
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    let reqdata = {
                        "_id": this.state.maintenanceReqData._id,
                        "updatedAt": this.state.maintenanceReqData.updatedAt,
                        "createdAt": this.state.maintenanceReqData.createdAt,
                        "address": this.state.maintenanceReqData.address,
                        "request_id": this.state.maintenanceReqData.request_id,
                        "request_overview": this.state.reqSubject,
                        "request_detail": this.state.reqDescription,
                        "created_by": this.state.maintenanceReqData.created_by._id,
                        "budget": Number(this.state.reqBudget),
                        "due_date": this.state.reqDate,
                        "original_budget": Number(this.state.reqBudget),
                        "original_date": this.state.maintenanceReqData.original_date,
                        "agency_id": this.state.maintenanceReqData.agency_id,
                        "created_by_role": this.state.maintenanceReqData.created_by_role._id,
                        "suburb": this.state.maintenanceReqData.suburb,
                        "postcode": this.state.maintenanceReqData.postcode,
                        "latitude": this.state.maintenanceReqData.latitude,
                        "longitude": this.state.maintenanceReqData.longitude,
                        "__v": this.state.maintenanceReqData.__v,
                        "deleted": this.state.maintenanceReqData.deleted,
                        "req_status": this.state.maintenanceReqData.req_status,
                        "completed_date": this.state.reqDate,
                        "complete_images": this.state.maintenanceReqData.complete_images,
                        "request_type": this.state.maintenanceReqData.request_type,
                        "job_close_confirmation": this.state.maintenanceReqData.job_close_confirmation,
                        "is_job_completed": this.state.maintenanceReqData.is_job_completed,
                        "images": this.state.maintenanceReqData.images,
                        "watchers_list": this.state.maintenanceReqData.watchers_list,
                        "is_forward": this.state.maintenanceReqData.is_forward,
                        "maintenance_log": this.state.maintenanceReqData.maintenance_log,
                        "maintenance_counter_proposals": this.state.maintenanceReqData.maintentenance_counter_proposals,
                        "id": this.state.maintenanceReqData._id,
                        "difference": -20,
                        "trader_first_name": this.state.selectedtrader.firstname,
                        "trader_last_name": this.state.selectedtrader.lastname,
                        "trader_id": this.state.selectedtrader._id,
                        "category_id": this.state.selectedCategory._id,
                        "dt": this.state.reqDate,
                        "email": userData.data.email
                    }
                    this.setState({ submitRequestLoader: true })
                    APICaller('addMR', 'post', "", reqdata).then(data => {
                        if (data.code == 200) {

                            if (this.state.documentsList.length > 0) {
                                this.state.documentsList.forEach(element => {
                                    const body = new FormData();
                                    body.append("file", element);
                                    body.append("_id", this.state.maintenanceReqData._id);
                                    documentUpload(
                                        "uploadMaintenanceImages",
                                        "",
                                        body,
                                        ""
                                    ).then(
                                        data => {
                                            if (data.code == 200) {
                                                var arr = this.state.document_id;
                                                this.setState({ document_id: arr, isScreenLoading: false });
                                                let arr1 = []
                                                this.state.documentsList.forEach(ele => {
                                                    if (ele != element) {
                                                        arr1.push(ele)
                                                    }
                                                });
                                                this.setState({ documentsList: arr1 })
                                            }
                                        },
                                        err => {
                                            this.setState({ isScreenLoading: false });
                                        }
                                    );
                                });
                            }
                            setTimeout(() => {
                                alert("Success")
                            }, 50);


                            this.setState({ submitRequestLoader: false, requestModal: false })
                        }
                        else {
                            alert("Something went wrkong, Please try again.")
                            this.setState({ submitRequestLoader: false })
                        }
                    }, err => {
                        this.setState({ submitRequestLoader: false })
                        alert("Somethinsg went wkrong, Please try again.")
                    })
                }
            })
        }
        // if (this.state.reqSubject == "") {
        //     alert("Please enter subject.")
        // } else if (this.state.reqDescription == "") {
        //     alert("Please enter description.")
        // } else if (this.state.reqName == "") {
        //     alert("Please enter name.")
        // }
        // else {
        //     this.setState({ submitRequestLoader: true })
        //     let requestParams = {
        //         "category_id": this.state.selectedCategory._id,
        //         "budget": Number(this.state.reqBudget),
        //         "due_date": this.state.reqDate + " 00:00",        
        //         "request_overview": this.state.reqSubject,
        //         "request_detail": this.state.reqDescription,
        //         "firstname": this.state.reqName,
        //         "email": this.state.reqEmail,
        //         "mobile_no": this.state.reqPhoneNumber,
        //         "address": this.state.reqAddress,
        //         "latitude": Number(this.state.reqLatitude),
        //         "longitude": Number(this.state.reqLongitude)
        //     }
        //     if (this.state.trader_id != "") {
        //         requestParams["trader_id"] = this.state.trader_id
        //     }
        //     console.log(requestParams, "requestParams,requestParams")
        //     APICaller('addMR', 'post', "",requestParams).then(data => {
        //         console.log(data, "datadataa")
        //         if (data.code == 200) {

        //             if (this.state.documentsList.length > 0) {
        //                 this.state.documentsList.forEach(element => {
        //                     const body = new FormData();
        //                     body.append("file", element);
        //                     body.append("_id", data.data._id);
        //                     console.log(body, "bodybody")
        //                     documentUpload(
        //                         "uploadMaintenanceImages",
        //                         "",
        //                         body,
        //                         ""
        //                     ).then(
        //                         data => {
        //                             console.log(data, "datadatadatadata")
        //                             if (data.code == 200) {
        //                                 var arr = this.state.document_id;
        //                                 this.setState({ document_id: arr, isScreenLoading: false });
        //                                 let arr1 = []
        //                                 this.state.documentsList.forEach(ele => {
        //                                     if (ele != element) {
        //                                         arr1.push(ele)
        //                                     }
        //                                 });
        //                                 this.setState({ documentsList: arr1 })
        //                             }
        //                         },
        //                         err => {
        //                             this.setState({ isScreenLoading: false });
        //                         }
        //                     );
        //                 });
        //             }
        //             this.setState({
        //                 renderSlide: 1,
        //                 trader_id: 0,
        //                 reqCategory: "",
        //                 submitRequestLoader: false,
        //                 searchText: "",
        //                 reqDate: "",
        //                 reqBudget: "",
        //                 reqSubject: "",
        //                 reqDescription: "",
        //                 locationSearchText: "",
        //                 reqLatitude: "",
        //                 reqLongitude: "",
        //                 reqName: "",
        //                 reqEmail: "",
        //                 reqPhoneNumber: "",
        //                 reqAddress: "",
        //                 selectedCategory: {},
        //                 selectedItem: {}
        //             })
        //             setTimeout(() => {
        //                 alert("Request Sent Successfully.")
        //             }, 50);


        //         }
        //         else {
        //             alert("Something went wrong, Please try again.")
        //             this.setState({ submitRequestLoader: false })
        //         }
        //     }, err => {
        //         this.setState({ submitRequestLoader: false })
        //         alert("Something went wrong, Please try again.")
        //     })
        // }
        // this.setState({ renderSlide: 1 })
    }
    navBar() {

        return (
            <View style={MaintenanceRequestDetailsScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{ padding: 20, paddingLeft: 20 }}>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>
                {
                    (this.state.roleName != Strings.USER_ROLE_TENANT && this.state.maintenanceReqData.req_status !== 5) ?

                        <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 15 }}>
                            <View style={[MaintenanceRequestDetailsScreenStyle.optionViewStyle,{backgroundColor:'transparent'}]} >
                                <Image source={ImagePath.HEADER_DOTS_MENU} />
                            </View>
                        </TouchableOpacity>
                        :
                        null
                }

                {
                    (this.state.isShowPopup) ?
                        <Modal onRequestClose={() => { }} transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={MaintenanceRequestDetailsScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={MaintenanceRequestDetailsScreenStyle.modalContainerStyles}>
                                        {
                                            ((this.state.roleName == Strings.USER_ROLE_AGENT || this.state.roleName == Strings.USER_ROLE_OWNER) && (ProposalAccepted == false)) ? <TouchableOpacity style={{ marginTop: 10 }}
                                                onPress={() => {
                                                    this.callAcceptorDeclineRequest()
                                                }}>
                                                <View style={[MaintenanceRequestDetailsScreenStyle.roundedGrayButtonStyle, { backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND }]}>
                                                    <Text style={[MaintenanceRequestDetailsScreenStyle.grayButtonTextStyle, { color: Colors.WHITE }]}>
                                                        {Strings.APPROVE_REQUEST}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity> : null
                                        }
                                        {/* {
                                            (this.state.roleName == Strings.USER_ROLE_AGENT || this.state.roleName == Strings.USER_ROLE_OWNER) ?
                                                <TouchableOpacity style={{ marginBottom: 20 }} onPress={this.callCancelMaintenanceReq.bind(this, this.props.reqId)}>
                                                    <View style={MaintenanceRequestDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                        <Text style={MaintenanceRequestDetailsScreenStyle.redTextStyle}>
                                                            {Strings.CANCEL_REQ}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : null
                                        } */}
                                        {this.state.maintenanceReqData.req_status !== 5 && this.state.maintenanceReqData.req_status !== 4 &&
                                            (this.state.roleName != Strings.USER_ROLE_TENANT) ?
                                            <TouchableOpacity style={{ marginBottom: 20 }} onPress={this.callCancelMaintenanceReq.bind(this, this.props.reqId)}>
                                                <View style={MaintenanceRequestDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                    <Text style={MaintenanceRequestDetailsScreenStyle.redTextStyle}>
                                                        {Strings.CANCEL_REQ}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            : null
                                        }

                                        {/* (this.state.maintenanceReqData.created_by._id == UserID && UserID != lastCounterProposalCreatedBy && this.state.maintenanceReqData.req_status !== 1 && this.state.maintenanceReqData.req_status !== 5) ? */}
                                        {/* (this.state.maintenanceReqData.created_by._id == UserID && this.state.maintenanceReqData.req_status !== 1 && this.state.maintenanceReqData.req_status !== 5) ? */}
                                        {lastCounterProposalCreatedBy && UserID &&
                                            (this.state.maintenanceReqData.created_by._id == UserID && UserID != lastCounterProposalCreatedBy && this.state.maintenanceReqData.req_status == 1) ?

                                            <TouchableOpacity style={{ marginTop: 0, marginBottom: 20 }} onPress={this.callCounterProposalScreen.bind(this)}>

                                                <View style={MaintenanceRequestDetailsScreenStyle.roundedYellowButtonStyle}>
                                                    <Text style={MaintenanceRequestDetailsScreenStyle.yellowButtonTextStyle}>
                                                        {Strings.COUNTER_PROPOSAL}
                                                    </Text>
                                                </View>

                                            </TouchableOpacity>
                                            : null
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal> : null
                }
            </View>
        );
    }
    callAddAsFav(userId, favStatus) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    fav_by: userData.data._id,
                    fav_to: userId,
                    fav_status: favStatus
                }
                this.props.showLoading();
                this.props.addUserToFav(authToken, postData);
            }
        }).done();

    }
    renderRecommendedTrader({ item, index }) {
        return (
            <View style={style.renderTraderContainerStyle}>
                <TouchableOpacity style={{ marginTop: 25, marginLeft: 25 }} onPress={() => this.callAddAsFav(item._id, !item.is_fav)} >
                    <Image source={(item.is_fav == 2) ? ImagePath.HEART_OUTLINE : ImagePath.BLUE_HEART} />
                </TouchableOpacity>

                <View style={style.logoContainer}>
                    {item.image ?
                        <ImageBackground imageStyle={{ borderRadius: Matrics.ScaleValue(60) }} source={{ uri: API.USER_IMAGE_PATH + item.image }} style={style.profileImageStyle}>
                            {item.is_online &&
                                <View style={style.greenDotStyle}></View>
                            }
                        </ImageBackground>
                        :
                        <View style={[style.profileImageStyle, { backgroundColor: COLORS.BACKGROUND, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(25), fontWeight: '600' }}>{(item.firstname && item.firstname.charAt(0).toUpperCase()) + ' ' + (item.lastname && item.lastname.charAt(0).toUpperCase())}</Text>
                        </View>
                    }
                </View>
                <View style={style.profileDataContainer}>
                    <Text style={style.traderNameTextStyle}>{item.firstname} {item.lastname}</Text>
                    <View>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={20}
                            starStyle={{ paddingRight: Matrics.ScaleValue(5), marginTop: Matrics.ScaleValue(8) }}
                            emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                            starColor={COLORS.STAR_COLOR}
                            rating={item.averageRate}
                            selectedStar={rating => ref.onStarRatingPress(rating)}
                        />
                    </View>
                    <Text style={style.reviewsStyle}>
                        {item.totalReviewLength ? '(' + item.totalReviewLength + ')' + 'Reviews'
                            :
                            'No Reviews'}
                    </Text>
                    <View style={style.servicesContainer}>

                        <FlatList
                            data={item.categories_id && item.categories_id}
                            extraData={this.state}
                            style={[style.servicesContainer, { marginHorizontal: Matrics.ScaleValue(10) }]}
                            renderItem={(ele) => {
                                if (ele.index < 3) {
                                    return <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>{ele.item.name}</Text></View>
                                } else if (ele.index == 3) {
                                    return <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>+{item.categories_id && Number(item.categories_id.length) - 3}</Text></View>
                                } else {
                                    return null
                                }
                            }
                            }
                        />
                    </View>
                    <View style={style.footerButtonContainer}>
                        <TouchableOpacity onPress={() => {
                            //seleceted trader : item._id
                            //trader name: item.firstname + item.lastname
                            //mr address:  this.state.maintenanceReqData.address
                            //request details: this.state.maintenanceReqData.request_detail
                            //budget : this.state.maintenanceReqData.budget
                            //selected category : this.state.maintenanceReqData.categories_id[0].name
                            //selected category id : this.state.maintenanceReqData.categories_id[0]._id
                            //request subject/request_overview : this.state.maintenanceReqData.request_overview
                            if (this.props.maintenanceData && this.props.maintenanceData.images.length > 0) {
                                this.setState({ documentsList: this.props.maintenanceData.images })
                            }
                            GETAPICaller(
                                "getServiceCategory",
                                "GET",
                                ""
                            ).then(data => {
                                if (data.code == 200) {
                                    data.data.forEach(element => {
                                        if (element._id == this.state.maintenanceReqData.categories_id[0]) {
                                            this.setState({})
                                        }
                                    });
                                }
                            });
                            this.setState({
                                requestModal: true,
                                submitRequestLoader: false,
                                selectedtrader: item,
                                reqDate: '',
                                selectedCategory: this.state.maintenanceReqData && this.state.maintenanceReqData.categories_id && this.state.maintenanceReqData.categories_id[0],
                                reqBudget: Number(this.state.maintenanceReqData.budget),
                                reqSubject: this.state.maintenanceReqData.request_detail,
                                reqDescription: this.state.maintenanceReqData.request_overview,

                            })
                        }} style={style.getQuotesButtonStyle}>
                            <Text style={style.getQuotesButtonTextStyle}>INVITE TO QUOTE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    renderTrader({ item, index }) {
        return (
            <View style={style.renderTraderContainerStyle}>
                <View style={style.logoContainer}>
                    {item.users[0] && item.users[0].image ?
                        <ImageBackground imageStyle={{ borderRadius: Matrics.ScaleValue(60) }} source={{ uri: API.USER_IMAGE_PATH + item.users[0].image }} style={style.profileImageStyle}>
                            {item.users[0].is_online &&
                                <View style={style.greenDotStyle}></View>
                            }
                        </ImageBackground>
                        :
                        <View style={[style.profileImageStyle, { backgroundColor: COLORS.BACKGROUND, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(25), fontWeight: '600' }}>{(item.users[0] && item.users[0].firstname.charAt(0).toUpperCase()) + ' ' + (item.users[0] && item.users[0].lastname.charAt(0).toUpperCase())}</Text>
                        </View>
                    }
                </View>
                <View style={style.profileDataContainer}>
                    {/* <Text style={style.traderNameTextStyle}>{item.users[0].firstname} {item.users[0].lastname}</Text> */}
                    <Text style={[style.traderNameTextStyle,{fontSize:Matrics.ScaleValue(13)}]}>Business Name</Text>
                    <Text style={style.traderNameTextStyle}>{item.users[0].business_name}</Text>
                    <View>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={20}
                            starStyle={{ paddingRight: Matrics.ScaleValue(5), marginTop: Matrics.ScaleValue(8) }}
                            emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                            starColor={COLORS.STAR_COLOR}
                            rating={item.averageRate}
                            selectedStar={rating => ref.onStarRatingPress(rating)}
                        />
                    </View>
                    <Text style={style.reviewsStyle}>
                        {item.totalReviewLength != 0 ? item.averageRate + ' from ' + item.totalReviewLength + ' ' + 'reviews'
                            :
                            'No Reviews'}
                    </Text>
                    <View style={{ height: 50, width: '100%', flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={IMAGEPATH.DOLLAR_ICON} resizeMode={'contain'} style={{ height: 20, marginRight: 5 }} />
                            <Text style={{ fontSize: 15, color: Colors.GRAY_COLOR }}>{item.proposed_price}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Image source={IMAGEPATH.CALENDAR_ICON} resizeMode={'contain'} style={{ height: 20, marginRight: 5 }} />
                            <Text style={{ fontSize: 15, color: Colors.GRAY_COLOR }}>{Moment(item.proposed_date).format("MMM DD YYYY")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Image source={IMAGEPATH.CALL_IMAGE} resizeMode={'contain'} style={{ tintColor: Colors.GRAY_COLOR, marginRight: 5, width: 20, height: 20 }} />
                            <Text style={{ fontSize: 15, color: Colors.GRAY_COLOR }}>{item.users[0].mobile_no}</Text>
                        </View>
                    </View>
                    <View style={style.footerButtonContainer}>
                        <TouchableOpacity onPress={() => {
                            Actions.Chat({ receiver: item.users[0]._id, emitter: UserID, socket: this.socket, userName: item.users[0].firstname ? item.users[0].firstname + ' ' + item.users[0].lastname : '', userPic: item.users[0].image, onSend: () => { } });
                            // Actions.MessageToTraderScreen({ userFirstName: item.firstname, userLastName: item.lastname, receiverId: item._id });
                        }} style={style.getQuotesButtonStyle}>
                            <Text style={style.getQuotesButtonTextStyle}>CHAT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    renderMRequestForm() {
        return (
            <Modal onRequestClose={() => this.setState({ requestModal: false })} animationType={'slide'} visible={this.state.requestModal}>
                <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={[style.scrollViewContainer, { backgroundColor: 'transparent' }]}>
                        <View style={[style.transparentFormContainer, { flex: 1, paddingTop: Matrics.ScaleValue(100), paddingBottom: Matrics.ScaleValue(100), height: '100%' }]}>
                            {/* <View style={style.syncittLogoContainer2}>
                                <Image source={IMAGEPATH.SYNCITTLOGO} style={style.syncittLogoStyle} resizeMode={"contain"} />
                            </View> */}
                            <View style={[style.formHeaderTextContainer, { borderRadius: Matrics.ScaleValue(10) }]}>
                                <Text style={style.searchResultTextStyle}>MAINTENANCE REQUEST</Text>
                                <Text style={style.serviceRequestTextStyle}>New Request</Text>

                                {/* ======= What do you need ? Block ======= */}
                                <View style={style.textInputConatiner1}>
                                    <Text style={style.textInputContainer1Text}>Service Category<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={style.inputBoxContainer1}>
                                        <TextInput
                                            style={style.input1Style}
                                            value={this.state.selectedCategory && this.state.selectedCategory.name}
                                            onChangeText={(text) => this.setState({ reqCategory: text.trimLeft() })}
                                            placeholder={'Search Category'}
                                        />
                                        <View style={style.searchIconStyle}>
                                            <Image source={IMAGEPATH.SEARCH_ICON} />
                                        </View>
                                    </View>
                                </View>

                                {/* ======= Request Subject ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Request Subject</Text>
                                    <View style={style.inputBoxContainer2}>
                                        <TextInput
                                            style={style.input2Style}
                                            value={this.state.reqDescription}
                                            onChangeText={(text) => this.setState({ reqSubject: text.trimLeft() })}
                                            placeholder={'Enter Subject'}
                                        />
                                    </View>
                                </View>



                                {/* ======= Description ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Request detail<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={[style.inputBoxContainer2, { height: Matrics.ScaleValue(200), padding: Matrics.ScaleValue(15) }]}>
                                        <TextInput
                                            placeholder={'Enter Description'}
                                            onChangeText={(text) => this.setState({ reqDescription: text.trimLeft() })}
                                            value={this.state.reqDescription}
                                            style={[style.input2Style, { height: Matrics.ScaleValue(200) }]}
                                            multiline={true}
                                        />
                                    </View>
                                </View>

                                {/* ======= Budget ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Budget($)<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={style.inputBoxContainer2}>
                                        <TextInput
                                            style={style.input2Style}
                                            value={String(this.state.reqBudget)}
                                            keyboardType={'number-pad'}
                                            onChangeText={(text) => this.setState({ reqBudget: text.trimLeft() })}
                                            placeholder={'Enter Budget'}
                                        />
                                    </View>
                                </View>


                                {/* ======= When ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>When<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={style.inputBoxContainer2}>
                                        <DatePicker
                                            style={AddAgreementScreenStyle.datePickerStyle}
                                            date={this.state.reqDate}
                                            iconComponent={() => {
                                                return (
                                                    <View></View>
                                                )
                                            }}
                                            mode="date"
                                            placeholder="Select Date"
                                            format='MM-DD-YYYY'
                                            minDate={new Date()}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: Matrics.ScaleValue(4),
                                                    marginLeft: 0
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    position: 'absolute',
                                                    left: Matrics.ScaleValue(5),
                                                    borderBottomWidth: 0,
                                                    borderLeftWidth: 0,
                                                    borderTopWidth: 0,
                                                    borderRightWidth: 0,
                                                }
                                                // ... You can check the source to find the other keys. 
                                            }}
                                            onDateChange={(date) => { this.setState({ reqDate: date }) }}
                                        />
                                        <View style={style.calenderIconStyle}>
                                            <Image source={IMAGEPATH.CALENDAR_ICON} />
                                        </View>
                                    </View>
                                </View>


                                <View style={{ paddingBottom: 10 }}>
                                    {this.state.documentsList.map(element => {
                                        return (<View style={{ width: '100%', flexDirection: 'row', height: 40, borderBottomColor: '#eee', borderBottomWidth: 1, margin: 7 }}>
                                            <View style={{ flex: 2, justifyContent: 'center' }}>
                                                <Image source={{ uri: element._id ? API.MAINTENANCE_IMAGE_PATH + element.path : element.uri }} style={{ height: 30, width: 30, paddingRight: 10 }} />
                                            </View>
                                            <View style={{ flex: 7, justifyContent: 'center' }}>
                                                <Text>{element._id ? element.path : element.name}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                let arr = []
                                                this.state.documentsList.forEach(item => {
                                                    if (item != element) {
                                                        arr.push(item)
                                                    }
                                                })
                                                this.setState({ documentsList: arr })
                                            }} style={{ flex: 1 }}><Text>X</Text></TouchableOpacity>
                                        </View>)
                                    })}
                                </View>

                                <TouchableOpacity onPress={() => this.ActionSheet.show()} style={style.uploadFileButtonContainer}>
                                    <Text style={style.uploadFileTextStyle}>UPLOAD A FILE</Text>
                                </TouchableOpacity>

                                {this.state.submitRequestLoader ?
                                    <TouchableOpacity style={style.submitButtonContainer}>
                                        <ActivityIndicator size='small' color={COLORS.WHITE} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { this.onRequestSubmit() }} style={style.submitButtonContainer}>
                                        <Text style={style.submitTextStyle}>SUBMIT</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                            <TouchableOpacity onPress={() => this.setState({ requestModal: false })} style={style.backToHomeStyle}>
                                <Text style={style.backToHomeTextStyle}>BACK TO HOME</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </ImageBackground>
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    options={actionOptions}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />
            </Modal>
        )
    }
    render() {

        return (

            <View style={MaintenanceRequestDetailsScreenStyle.profileContainer}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={MaintenanceRequestDetailsScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.maintenanceReqData.request_overview}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3,}} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID : </Text>
                                <Text style={{ color: Colors.WHITE, fontSize: 14 }}> {this.state.maintenanceReqData.request_id}</Text>
                            </View>
                            {
                                this.state.maintenanceReqData.trader_id ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Image source={ImagePath.DRAWER_TRADERS} style={{ height: 15, width: 15, justifyContent: 'center' ,}} />
                                        <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 5 }}>{this.state.maintenanceReqData.trader_id ? this.state.maintenanceReqData.trader_id.firstname + ' ' + this.state.maintenanceReqData.trader_id.lastname : ''}</Text>
                                    </View> : null
                            }

                        </View>
                    </View>
                    {this.navBar()}

                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={MaintenanceRequestDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={MaintenanceRequestDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.TRACKER}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUEST_DETAILS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                                <View>
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.THREAD}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onApplicantClick()}>
                                <View>
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 4) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{'Applicants'}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 4) ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRecommendedTabClick()}>
                                <View>
                                    <View style={MaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 5) ? MaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : MaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{'Recommended Traders'}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 5) ? <View style={MaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={MaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                {(this.state.isTabSelected == 1) ?
                    <TrackerScreen reqDetailData={this.state.maintenanceReqData} />
                    : null}

                {(this.state.isTabSelected == 2) ?
                    <RequestDetailScreen reqDetailData={this.state.maintenanceReqData} />
                    : null}
                {(this.state.isTabSelected == 3) ?
                    <ThreadScreen reqDetailData={this.state.maintenanceReqData} socket={this.socket} />
                    : null}

                {/* <View style={style.traderTransparentContainer}> */}
                {/* </View> */}
                {(this.state.isTabSelected == 4) ?
                    <FlatList
                        data={this.state.applicantsList}
                        renderItem={this.renderTrader.bind(this)}
                    />
                    : null}

                {(this.state.isTabSelected == 5) ?
                    <FlatList
                        data={this.state.recommendedTraders}
                        renderItem={this.renderRecommendedTrader.bind(this)}
                    />
                    : null}
                {(this.state.isTabSelected == 5) ?
                    <View style={{ flexDirection: 'row', paddingHorizontal: 25, height: 80, justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.WHITE, borderTopColor: Colors.GRAY, borderTopWidth: 1, width: '100%' }}>
                        <Text style={{ fontSize: 30, fontWeight: '600' }}>{this.state.maintenanceReqData && this.state.maintenanceReqData.budget ? ('$' + this.state.maintenanceReqData.budget) : ""}</Text>
                        <Text style={{ fontSize: 20, color: Colors.GRAY_COLOR }}>{this.state.maintenanceReqData && this.state.maintenanceReqData.due_date ? Moment(this.state.maintenanceReqData.due_date).fromNow() : null}</Text>
                    </View>
                    : null}
                {this.renderMRequestForm()}
                {
                    (this.props.maintenanceRequestDetailsReducer.isScreenLoading || this.state.isScreenLoading) ? (
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail
                                color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
                            />
                        </View>
                    ) : null
                }
            </View>

        );
    }
}

function mapStateToProps(state) {

    return {
        maintenanceRequestDetailsReducer: state.maintenanceRequestDetailsReducer
    }
}

export default connect(
    mapStateToProps,
    {
        addUserToFav,
        cancelMaintenanceReq,
        getMaintenanceReqDetail,
        showLoading,
        acceptDeclineProposalRequest,
        resetState,
    }

)(MaintenanceRequestDetails);
const style = {
    renderTraderContainerStyle: {
        backgroundColor: 'white', borderRadius: Matrics.ScaleValue(6), justifyContent: 'center', elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.3, shadowRadius: Matrics.ScaleValue(5), borderRadius: Matrics.ScaleValue(5), paddingBottom: Matrics.ScaleValue(20),
    },
    logoContainer: {
        justifyContent: 'center', alignItems: 'center', margin: Matrics.ScaleValue(20)
    },
    greenDotStyle: {
        backgroundColor: COLORS.STATUS_GREEN_COLOR, width: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(20), bottom: Matrics.ScaleValue(5), right: Matrics.ScaleValue(5), position: 'absolute', height: Matrics.ScaleValue(25)
    },
    profileImageStyle: {
        height: Matrics.ScaleValue(120), width: Matrics.ScaleValue(120), borderRadius: Matrics.ScaleValue(60)
    },
    profileDataContainer: {
        justifyContent: 'center', alignItems: 'center'
    },
    traderNameTextStyle: {
        fontSize: Matrics.ScaleValue(18), color: 'gray', fontWeight: '600'
    },
    reviewsStyle: {
        fontSize: Matrics.ScaleValue(12), lineHeight: Matrics.ScaleValue(25), color: 'gray', fontWeight: '600'
    },
    servicesContainer: {
        flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    serviceTextContainer: {
        height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), paddingHorizontal: Matrics.ScaleValue(15), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue'
    },
    extServiceTextContainer: {
        height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), width: Matrics.ScaleValue(50), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue'
    },
    serviceTextStyle: {
        color: 'white', fontWeight: '600', fontSize: Matrics.ScaleValue(12)
    },
    footerButtonContainer: {
        padding: Matrics.ScaleValue(10), width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'
    },
    viewProfileButtonStyle: {
        height: Matrics.ScaleValue(30), width: Matrics.ScaleValue(120), borderRadius: Matrics.ScaleValue(30), justifyContent: 'center', alignItems: 'center', margin: Matrics.ScaleValue(5), borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: Matrics.ScaleValue(1)
    },
    viewProfileButtonTextStyle: {
        color: 'gray', fontWeight: '600', fontSize: 11
    },
    getQuotesButtonStyle: {
        height: 35, width: 250, justifyContent: 'center', alignItems: 'center', borderRadius: 30, margin: 5, backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
    },
    getQuotesButtonTextStyle: {
        color: 'white', fontWeight: '600', fontSize: 11
    },
    transparentFormContainer: {
        backgroundColor: COLORS.TRANSLUCENT, width: '100%', flex: 1
    },
    syncittLogoContainer2: {
        height: Matrics.ScaleValue(180), justifyContent: 'center', alignItems: 'center'
    },
    syncittLogoStyle: {
        height: Matrics.ScaleValue(75), bottom: Matrics.ScaleValue(-20)
    },
    formHeaderTextContainer: {
        margin: Matrics.ScaleValue(25), marginBottom: 0, borderTopLeftRadius: Matrics.ScaleValue(5), borderTopRightRadius: Matrics.ScaleValue(5), backgroundColor: 'white', padding: Matrics.ScaleValue(25)
    },
    searchResultTextStyle: {
        color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: Matrics.ScaleValue(16), fontSize: Matrics.ScaleValue(12)
    },
    serviceRequestTextStyle: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(23), fontWeight: '600'
    },
    textInputConatiner1: {
        marginTop: Matrics.ScaleValue(30)
    },
    textInputContainer1Text: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
    },
    inputBoxContainer1: {
        height: Matrics.ScaleValue(40), borderWidth: Matrics.ScaleValue(1), flexDirection: 'row', borderColor: COLORS.GRAY, borderRadius: Matrics.ScaleValue(5), justifyContent: 'space-between', paddingLeft: Matrics.ScaleValue(20), alignSelf: 'center', width: '100%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)
    },
    input1Style: {
        height: Matrics.ScaleValue(40), flex: 1
    },
    searchIconStyle: {
        justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
    },
    textInputConatiner2: {
        marginTop: Matrics.ScaleValue(10)
    },
    textInputContainer2Text: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
    },
    inputBoxContainer2: {
        height: Matrics.ScaleValue(40),
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: COLORS.GRAY,
        borderRadius: Matrics.ScaleValue(5),
        justifyContent: 'space-between',
        paddingLeft: Matrics.ScaleValue(20),
        alignSelf: 'center',
        width: '100%',
        backgroundColor: 'white',
        margin: Matrics.ScaleValue(10)
    },
    input2Style: {
        height: Matrics.ScaleValue(40), flex: 1
    },
    calenderIconStyle: {
        justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
    },
    whiteBackgroundContainer: {
        margin: Matrics.ScaleValue(25), marginTop: 0, borderRadius: Matrics.ScaleValue(5), backgroundColor: 'white', padding: Matrics.ScaleValue(25), paddingTop: 0
    },
    addressMessageStyle: {
        fontSize: Matrics.ScaleValue(10), textAlign: 'center', color: COLORS.GRAY_COLOR
    },
    uploadFileButtonContainer: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '70%', margin: Matrics.ScaleValue(20), borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: 1, borderRadius: Matrics.ScaleValue(60)
    },
    uploadFileTextStyle: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    },
    submitButtonContainer: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '95%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    submitTextStyle: {
        color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    },
    footerStepsConatiner: {
        margin: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(5)
    },
    stepsContainer: {
        height: Matrics.ScaleValue(50), justifyContent: 'center', alignSelf: 'flex-start', borderTopWidth: Matrics.ScaleValue(2), borderTopColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
    },
    stepsTextStyle: {
        color: 'gray', fontWeight: '600', fontSize: Matrics.ScaleValue(25)
    },
    stepsDescriptionTextStyle: {
        color: COLORS.GRAY_COLOR
    },
    backToHomeStyle: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '55%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    backToHomeTextStyle: {
        color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    }
}


