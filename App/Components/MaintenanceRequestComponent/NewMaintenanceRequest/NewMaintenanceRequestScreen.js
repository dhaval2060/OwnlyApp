import React, { Component } from "react";
import { connect } from "react-redux";
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
} from "react-native";

import {
  addMaintenanceReq,
  uploadMaintenaceImage,
  getWatherList,
  getPropertyList,
  getMaintenancePropertyList,
  getTradersOptionList
} from "../../../Action/ActionCreators";
import {
  clearUploadedImageRes,
  maintenanceReqDetailChanged,
  maintenanceReqNameChanged,
  propertyNameChanged,
  maintenanceBudgetChanged,
  searchWatcherChanged,
  tradersChanged,
  showLoading,
  resetState,
  clearAddMaintenanceRes
} from "./NewMaintenanceRequestAction";

import { updateScene } from "../MaintenanceAction";

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import API from "../../../Constants/APIUrls";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import NewMaintenanceRequestScreenStyle from "./NewMaintenanceRequestScreenStyle";
import { Dropdown } from "react-native-material-dropdown";

import ImagePicker from 'react-native-image-picker';
// var ImagePicker = require("react-native-image-picker");
import DatePicker from "react-native-datepicker";
import ActionSheet from "react-native-actionsheet";
import * as Progress from "react-native-progress";
import Moment from "moment";
import SocketIOClient from 'socket.io-client';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import APICaller, { documentUpload, GETAPICaller, GetLatLong, GetLocation } from "../../../Saga/APICaller";
var options = {
  title: "Select Property Image",
  quality: 1,
  customButtons: [{ name: "Ownly", title: "Choose Photo" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 3;
const actionOptions = ["Upload Photo", "Take Photo", "Cancel"];

var uploadImagesArray = [];
var uploadedImagesPath = [];
let contextRef;

class NewMaintenanceRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      savedTraders: [],
      uploadImagesData: {},
      searchTraderList: [],
      searchTraderListBackUp: [],
      previosTraderList:[],
      previosTraderListBackUp: [],
      selectedProperty: {},
      isScreenLoading: false,
      showPickedTraders: false,
      showSavedTraders: true,
      reqAddress: "",
      selectedImage: "",
      mrType: 0,
      serviceCategoryId:'',
      isServiceCategoryShow: false,
      tradersData: [],
      watcherData: [],
      propertySearchedData: [],
      tradersSearchedData: [],
      watcherSearchedData: [],
      selectedWatcherData: [],
      agencyData: [],
      tenantList: [],
      isTraderListShow: false,
      isSearchWatcherListShow: false,
      selectedPropertyId: "",
      selectedTraderId: "",
      minDate: Moment().format("MMM DD YYYY"),
      roleName: "",
      due_date: [],
      servicesList: [],
      budget: ""
    };
    this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
    this.handlePress = this.handlePress.bind(this);
    contextRef = this;
  }

  componentWillReceiveProps(nextProps) { }

  componentDidUpdate() {
    this.onGetAgencySuccess();
    this.onTradersOptionSuccess();
    this.onGetWatcherSuccess();
    this.onUploadImageSuccess();
    this.onAddMaintenanceReqSuccess();
    this.onPropertyListSuccess();
  }

  componentWillUnmount() { }

  componentWillMount() {
    uploadImagesArray = [];
    uploadedImagesPath = [];
    this.getRoleName();
    this.callGetAgencyProperty();
    this.getServiceCategory()
    this.getAllSavedTraders()
  }
  getServiceCategory() {
    GETAPICaller(
      "getServiceCategory",
      "GET",
      ""
    ).then(data => {
      if (data.code == 200) {
        this.setState({ servicesList: data.data, servicesListBackUp: data.data })

      }
    });
  }
  getAllSavedTraders() {
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        let requestParams = {
          "user_id": userData.data._id
        }
        console.log('requestParams',requestParams);
        APICaller('tradersList', 'POST', "", requestParams).then(data => {
          if (data.code == 200) {
            console.log('tradersList',data);
            if (data.data.length > 0) {
              this.setState({ savedTraders: data.data })
            }
            else {
            }
          }
        }, err => {
          alert("Something went wrong, Please try again.")
        })
      }
    })
  }

  getTraderList(id, item) {

    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        APICaller("getAgreementForPropertyDetail/" + id, "GET", authToken).then(
          data => {

            if (data.data != null) {
              this.setState({ tenantList: data.data.tenants });

              if (this.state.roleName == Strings.USER_ROLE_OWNER) {
                let arr = this.state.selectedWatcherData;
                data.data.tenants.forEach(element => {
                  arr.push(element.users_id);
                });
                arr.push(item.created_by);
                this.setState({ selectedWatcherData: arr });
              }
            } else {
              let arr = [];
              arr.push(item.created_by);
              this.setState({ selectedWatcherData: arr });
            }
          },
          err => {

          }
        );
      }
    });
  }
  closeAddProperty() {
    Actions.popTo("Dashboard");
  }

  callBack() {
    Actions.pop();
  }

  getRoleName() {
    AsyncStorage.getItem(Strings.USER_ROLE_NAME)
      .then(value => {
        if (value) {

          this.setState({ roleName: value });
        }
      })
      .done();
  }
  getPropertyList() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;

          AsyncStorage.getItem("roleId").then((role) => {
            if (role) {
              var postData = {
                agency_id: userData.data.agency_id,
                request_by_role: role,
                user_id: userData.data._id
              };
              this.props.showLoading();
              this.props.getPropertyList(authToken, postData);
            }
        }).done();
          
        }
      })
      .done();
  }
  onPropertyListSuccess() {
    if (this.props.homeScreenReducer.propertyListResponse != "") {
      if (this.props.homeScreenReducer.propertyListResponse.code == 200) {

        this.setState({
          propertyListData: this.props.homeScreenReducer.propertyListResponse
            .data
        });

        this.state.roleName != Strings.USER_ROLE_TRADER
          ? this.callGetNoticeBoardList()
          : this.callGetMaintenanceRequest();
      } else {
        // alert(this.props.homeScreenReducer.propertyListResponse.message);
      }
      this.props.resetState();
    }
    if (
      this.props.newMaintenanceRequestReducer.propertyName == "Select Property"
    ) {
      this.props.propertyNameChanged("");
    }
  }
  onPropertySelectChange(text) {

    this.props.propertyNameChanged(text);
    this.setState({ isPropertyListShow: true });
    // this.setState({ selectedPropertyId: this.state.agencyData[this.refs.ref_property.selectedIndex()].id });
    this.SearchPropertyFunction(text);
  }
  onLocationChangeText(val, reqAddress) {
    this.setState({ isPropertyListShow: true });
    this.props.propertyNameChanged(val);
    if (reqAddress == 'reqAddress') {
      this.setState({ reqAddress: val.trimLeft() })
    }
    GetLocation(val).then(data => {
      if (data.predictions.length > 0) {
        // alert(JSON.stringify(data.predictions), "data.predictions")
        this.setState({ predictions: data.predictions })
      }
      else if (data.status == 'ZERO_RESULTS') {
        this.setState({ predictions: [] })
      }
    })
  }
  SearchPropertyFunction(text) {
    const newData = this.state.agencyData.filter(function (item) {
      const itemData = item.value.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      propertySearchedData: newData
    });
  }
  onBudgetChange(text) {
    this.props.maintenanceBudgetChanged(text.replace(/[^0-9]/g, ''));
  }
  onRequestNameChange(text) {
    this.props.maintenanceReqNameChanged(text);
  }
  onReqDetailChange(text) {
    this.props.maintenanceReqDetailChanged(text);
  }

  callGetTradersOptionRequest() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          var postData = {
            user_id: userData.data._id
          };
          this.props.showLoading();
          this.props.getTradersOptionList(authToken, postData);
        }
      })
      .done();
  }

  onTradersOptionSuccess() {
    if (this.props.newMaintenanceRequestReducer.tradersListResponse != "") {

      if (
        this.props.newMaintenanceRequestReducer.tradersListResponse.code == 200
      ) {
        this.setState({
          tradersData: this.props.newMaintenanceRequestReducer
            .tradersListResponse.data,
          tradersDataBackUp: this.props.newMaintenanceRequestReducer
            .tradersListResponse.data,
          tradersSearchedData: this.props.newMaintenanceRequestReducer
            .tradersListResponse.data
        });
        this.callGetWatcherList();
      } else {
        alert(
          this.props.newMaintenanceRequestReducer.tradersListResponse.message
        );
      }
      this.props.resetState();
    }
  }

  callGetAgencyProperty() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          AsyncStorage.getItem("roleId").then((role) => {
            if (role) {
              var postData = {
                request_by_id: userData.data._id,
                request_by_role: role
              };
    
              this.props.showLoading();
              this.props.getMaintenancePropertyList(authToken, postData);
            }
        }).done();
        }
      })
      .done();
  }

  onGetAgencySuccess() {
    if (this.props.newMaintenanceRequestReducer.agencyListResponse != "") {
      if (
        this.props.newMaintenanceRequestReducer.agencyListResponse.code == 200
      ) {




        if (
          this.props.newMaintenanceRequestReducer.agencyListResponse.data
            .length == 0
        ) {
          // alert(Strings.ERROR_CREATE_MAINTENANCE_MESSAGE);
          // Actions.pop();
        } else {
          this.setState({
            agencyData: this.preparePropertyData(
              this.props.newMaintenanceRequestReducer.agencyListResponse.data
            )
          });
          this.callGetTradersOptionRequest();
        }
      } else {
        alert(
          this.props.newMaintenanceRequestReducer.agencyListResponse.message
        );
      }
      this.props.resetState();
    }
  }

  callGetWatcherList() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;

          if (
            userData.data.agency_id != undefined &&
            userData.data.agency_id != "" &&
            userData.data.agency_id != null
          ) {
            this.props.showLoading();
            this.props.getWatherList(authToken, userData.data.agency_id);
          }
        }
      })
      .done();
  }

  onGetWatcherSuccess() {
    if (this.props.newMaintenanceRequestReducer.watcherListResponse != "") {
      if (
        this.props.newMaintenanceRequestReducer.watcherListResponse.code == 200
      ) {



        this.setState({
          watcherData: this.props.newMaintenanceRequestReducer
            .watcherListResponse.data,
          watcherSearchedData: this.props.newMaintenanceRequestReducer
            .watcherListResponse.data
        });
      } else {
        alert(
          this.props.newMaintenanceRequestReducer.watcherListResponse.message
        );
      }
      this.props.resetState();
    }
  }

  callAddMaintenanceReqApi() {

    console.log(this.state, uploadedImagesPath)
    if (!this.state.reqAddress || this.state.reqAddress == '') {
      alert("Please select address")
      return
    } else if (!this.state.selectedCategory) {
      alert("Please select trader category")
      return
    }
    else if ((this.state.mrType == 0) && (!this.state.selectedTraderId || this.state.selectedTraderId == '')) {
      alert("Please select trader")
      return
    }
    else if (!this.props.newMaintenanceRequestReducer.maintenanceRequestName || this.props.newMaintenanceRequestReducer.maintenanceRequestName == '') {
      alert("Please enter request subject")
      return
      // }
      // else if (!this.props.newMaintenanceRequestReducer.maintenanceBudget || this.props.newMaintenanceRequestReducer.maintenanceBudget == '') {
      //   alert("Please enter Budget")
      //   return
    } else if (!this.state.date || this.state.date == '') {
      alert("Please select due date")
      return
    } else if (!this.props.newMaintenanceRequestReducer.reqDetail || this.props.newMaintenanceRequestReducer.reqDetail == '') {
      alert("Please enter request detail")
      return
    }
    else {
      AsyncStorage.getItem("SyncittUserInfo")
        .then(value => {
          if (value) {
            var userData = JSON.parse(value);
            var authToken = userData.token;
            AsyncStorage.getItem("roleId").then(role => {
              if (role) {
                if (this.state.selectedWatcherData) {
                  let arr = this.state.selectedWatcherData;
                  arr.push({ user_id: userData.data._id, firstname: userData.data.firstname, lastname: userData.data.lastname })
                  this.setState({ selectedWatcherData: arr })
                } else {
                  this.setState({ selectedWatcherData: [{ user_id: userData.data._id, firstname: userData.data.firstname, lastname: userData.data.lastname }] })
                }
                let watcherList = this.state.selectedWatcherData.filter(function (element) {
                  return element !== undefined;
                });
                var postData = {
                  "address": this.props.newMaintenanceRequestReducer.propertyName,
                  "email": userData.data.email,
                  "latitude": this.state.reqLatitude,
                  "longitude": this.state.reqLongitude,
                  "dt": this.state.date,
                  created_by_role: role,
                  request_type: this.state.mrType,
                  agency_id: userData.data.agency_id,
                  request_overview: this.props.newMaintenanceRequestReducer.maintenanceRequestName,
                  created_by: userData.data._id,
                  "category_id": this.state.selectedCategory._id,
                  request_detail: this.props.newMaintenanceRequestReducer.reqDetail,
                  budget: this.props.newMaintenanceRequestReducer.maintenanceBudget
                    ? parseInt(
                      this.props.newMaintenanceRequestReducer.maintenanceBudget
                    )
                    : 0,
                  due_date: this.state.date,
                  images: uploadedImagesPath,
                  watchers_list: watcherList
                };

                if (
                  (this.state.roleName == Strings.USER_ROLE_AGENT ||
                    this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                    this.state.roleName == Strings.USER_ROLE_OWNER) && this.state.selectedTraderId && this.state.selectedTraderId != ''
                ) {
                  postData.trader_id = this.state.selectedTraderId;
                }
                console.log('postDatapostData',postData);
                APICaller('addMR', 'POST', authToken, postData).then(data => {
                  if (data.code == 200) {
                    console.log('ResponseData',data.data);
                    let MRid = data.data._id
                    AsyncStorage.getItem("SyncittUserInfo")
                      .then(value => {
                        if (value) {
                          var userData = JSON.parse(value);
                          this.socket.emit('addMaintenanceUsers', {
                            id: userData.data._id,
                            maintenanceId: MRid,
                            firstName: userData.data.firstname,
                            lastName: userData.data.lastname
                          });
                          var objMessage = {
                            from: userData.data._id,
                            to: MRid,
                            textMsg: 'Sent',
                            is_status: true,
                            time: new Date(),
                            maintenanceId: MRid
                          }
                          this.socket.emit('maintenanceGroupMessageSent', objMessage)
                        }
                        this.props.updateScene("updateMaintenanceList");
                        Actions.pop();
                      })
                  } else {
                    alert(this.props.newMaintenanceRequestReducer.addPropertyRes.message);
                  }
                  console.log(data, "datadata")
                }, err => {
                  console.log(err, "errerrerr")
                })
                this.props.showLoading();
              }
            });
          }
        })
        .done();
    }
  }

  preparePropertyData(propertyList) {
    var tempArray = [];

    propertyList.map((data, index) => {
      var tempData = {
        value: propertyList[index].address,
        created_by: propertyList[index].created_by,
        id: propertyList[index]._id
      };
      tempArray.push(tempData);
    });

    return tempArray;
  }

  onTraderNameChange(text) {
    this.props.tradersChanged(text);
    this.setState({ isTraderListShow: true, selectedTraderId: '' });
    this.SearchFilterFunction(text);
    this.SearchPreviosFilterFunction(text);
  }
  onServiceChange(text) {
    this.setState({ serviceCategory: text, isServiceCategoryShow: true })
    let arr = this.state.servicesListBackUp.filter(item => {
      if ((item.name.toLowerCase()).match(text.toLowerCase())) {
        return item
      }
    })
    this.setState({ servicesList: arr })
  }
  onWatcherNameChange(text) {
    this.props.searchWatcherChanged(text);
    this.setState({ isSearchWatcherListShow: true });
    this.SearchWatcherFunction(text);
  }

  showTraderList() {
    if (this.state.isTraderListShow == false) {
      this.setState({ isTraderListShow: true });
    } else {
      this.setState({ isTraderListShow: false });
    }
  }
  showPropertyList() {
    if (this.state.isPropertyListShow == false) {
      this.setState({ isPropertyListShow: true });
    } else {
      this.setState({ isPropertyListShow: false });
    }
  }

  showSearchWatcherList() {
    if (this.state.isSearchWatcherListShow == false) {
      this.setState({ isSearchWatcherListShow: true });
    } else {
      this.setState({ isSearchWatcherListShow: false });
    }
  }

  showCamera() {
    // Launch Camera:
    ImagePicker.launchCamera(options, response => {

      if (response.didCancel) {

      } else if (response.error) {

      } else if (response.customButton) {

      } else {
        this.setState({ isScreenLoading: true })
        let source = { uri: response.uri };
        let imagePath = Platform.OS == "ios" ? response.origURL : response.path;
        var imageItem = {
          url: source,
          path: imagePath,
          isSelected: 0
        };
        if (uploadImagesArray.length < 20) {
          uploadImagesArray.push(imageItem);
          var imagagesData = {
            imageArray: uploadImagesArray
          };
          this.setState({ uploadImagesData: imagagesData });
        } else {
          alert(Strings.MAX_IMAGE_LIMIT);
        }

        if (uploadImagesArray.length == 1) {
          this.uploadImageListSelection(0);
        }
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              //this.props.showLoading();

              const body = new FormData();
              const file = {
                uri: response.uri.replace("file://", ""), // e.g. 'file:///path/to/file/image123.jpg'
                name: "user_portfolio.png",// e.g. 'image123.jpg',
                type: 'image/jpeg' // e.g. 'image/jpg'
              };
              body.append("file", file);
              documentUpload(
                "uploadMobileMaintenanceImage",
                authToken,
                body
              ).then(
                data => {
                  this.setState({ isScreenLoading: false });
                  var imagePath = {
                    path: data.data
                  };
                  uploadedImagesPath.push(imagePath);
                  console.log(data, "response data")
                },
                err => {
                  console.log(err, "err")
                  alert("Something went wrong")
                  this.setState({ isScreenLoading: false });
                })
              // this.props.showLoading();
              // this.props.uploadMaintenaceImage(
              //   authToken,
              //   response.uri.replace("file://", "")
              // );
            }
          })
          .done();
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
        this.setState({ isScreenLoading: true })
        let source = { uri: response.uri };
        let imagePath = Platform.OS == "ios" ? response.origURL : response.path;
        var imageItem = {
          url: source,
          path: imagePath,
          isSelected: 0
        };
        if (uploadImagesArray.length < 20) {
          uploadImagesArray.push(imageItem);
          var imagagesData = {
            imageArray: uploadImagesArray
          };
          this.setState({ uploadImagesData: imagagesData });
        } else {
          alert(Strings.MAX_IMAGE_LIMIT);
        }

        if (uploadImagesArray.length == 1) {
          this.uploadImageListSelection(0);
        }
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              //this.props.showLoading();
              const body = new FormData();
              const file = {
                uri: response.uri.replace("file://", ""), // e.g. 'file:///path/to/file/image123.jpg'
                name: "user_portfolio.png",// e.g. 'image123.jpg',
                type: 'image/jpeg' // e.g. 'image/jpg'
              };
              body.append("file", file);
              documentUpload(
                "uploadMobileMaintenanceImage",
                authToken,
                body
              ).then(
                data => {
                  this.setState({ isScreenLoading: false });
                  var imagePath = {
                    path: data.data
                  };
                  uploadedImagesPath.push(imagePath);
                  console.log(data, "response data")
                },
                err => {
                  console.log(err, "err")
                  alert("Something went wrong")
                  this.setState({ isScreenLoading: false });
                })
              // this.props.showLoading();
              // this.props.uploadMaintenaceImage(
              //   authToken,
              //   response.uri.replace("file://", "")
              // );
            }
          })
          .done();
      }
    });
  }

  onUploadImageSuccess() {
    if (this.props.newMaintenanceRequestReducer.imageUploadRes != "") {
      if (this.props.newMaintenanceRequestReducer.imageUploadRes.code == 200) {
        var imagePath = {
          path: this.props.newMaintenanceRequestReducer.imageUploadRes.data
        };
        uploadedImagesPath.push(imagePath);
      } else {
        alert(this.props.newMaintenanceRequestReducer.imageUploadRes.message);
      }
      this.props.clearUploadedImageRes();
    }
  }

  onAddMaintenanceReqSuccess() {
    console.log("MAIN RESPONSE " + this.props.newMaintenanceRequestReducer)
    if (this.props.newMaintenanceRequestReducer.addPropertyRes != "") {
      console.log("MAIN RESPONSE " + this.props.newMaintenanceRequestReducer.addPropertyRes)
      if (this.props.newMaintenanceRequestReducer.addPropertyRes.code == 200) {
        MRid = this.props.newMaintenanceRequestReducer.addPropertyRes.data._id
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);

              this.socket.emit('addMaintenanceUsers', {
                id: userData.data._id,
                maintenanceId: MRid,
                firstName: userData.data.firstname,
                lastName: userData.data.lastname

              });
              var objMessage = {
                from: userData.data._id,
                to: MRid,
                textMsg: 'Sent',
                is_status: true,
                time: new Date(),
                maintenanceId: MRid
              }

              this.socket.emit('maintenanceGroupMessageSent', objMessage)
            }
            this.props.updateScene("updateMaintenanceList");
            Actions.pop();
          })
      } else {
        alert(this.props.newMaintenanceRequestReducer.addPropertyRes.message);
      }
      this.props.clearAddMaintenanceRes();
    }
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  handlePress(i) {
    if (i == 0) {
      this.showImageLibrary();
    } else if (i == 1) {
      this.showCamera();
    }
  }

  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>
          {Strings.NEW_REQUEST}
        </Text>
        <TouchableOpacity
          onPress={() => this.closeAddProperty()}
          style={CommonStyles.navRightImageView}
        >
          <View>
            <Image source={ImagePath.DRAWER_CROSS_ICON} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  uploadImageListSelection(index) {


    this.setState({
      selectedImage: this.state.uploadImagesData.imageArray[index].url
    });
    var tempData = this.state.uploadImagesData;
    var tempArray = this.state.uploadImagesData.imageArray;
    tempArray.map((data, position) => {
      if (index == position) {
        if (tempArray[index].isSelected == 0) {
          tempArray[index].isSelected = 1;
        }
      } else {
        tempArray[position].isSelected = 0;
      }
    });
    tempData.imageArray = tempArray;
    this.setState({ uploadImagesData: tempData });
  }

  searchRenderItem({ item, index }) {

    return (
      <View style={NewMaintenanceRequestScreenStyle.serachListItemContainer}>
        <Image
          source={{ uri: API.USER_IMAGE_PATH + item.image }}
          style={NewMaintenanceRequestScreenStyle.searchListItemImageStyle}
        />
        <Text style={NewMaintenanceRequestScreenStyle.searchListItemTextStyle}>
          {item.firstname + " " + item.lastname}
        </Text>
        <Image
          source={ImagePath.DRAWER_CROSS_ICON}
          style={NewMaintenanceRequestScreenStyle.searchListItemCloseImageStyle}
        />
      </View>
    );
  }

  onTraderSelect(item) {
    this.showTraderList();
    this.props.tradersChanged(item.data.business_name);
    this.setState({ selectedTraderId: item._id, showSavedTraders: !this.state.showSavedTraders });
  }

  onPropertySelect(item) {
    this.getTraderList(item.id, item);
    console.log("item", item, "properttyy item")
    GetLatLong(item.place_id).then(data => {
      if (data.status == "INVALID_REQUEST") {

      } else {
        this.setState({ selectedPropertyId: item.id, selectedProperty: item, reqLatitude: data.result.geometry.location.lat, selectedLocation: data.result, reqLongitude: data.result.geometry.location.lng })
        this.setState({ searchTraderList: [], searchTraderListBackUp:[],previosTraderList: [], previosTraderListBackUp:[] });
        this.props.propertyNameChanged(item.description);
        if (this.state.serviceCategoryId != '') {
          AsyncStorage.getItem("SyncittUserInfo").then(value => {
            if (value) {
              var userData = JSON.parse(value);
              let requestParams = {
                address: this.props.newMaintenanceRequestReducer.propertyName,
                categories_id: this.state.serviceCategoryId
              }
              // this.setState({isScreenLoading:true});
              APICaller('provious_existing_traders', 'POST', userData.token, requestParams).then(data => {
                console.log('data.data.other_existing_traders',data.data.other_existing_traders);
                if(data.code === 200){
                  this.setState({ searchTraderList: data.data.other_existing_traders, searchTraderListBackUp: data.data.other_existing_traders,previosTraderList: data.data.previous_traders, previosTraderListBackUp: data.data.previous_traders })
                }
                // this.setState({isScreenLoading:false });
              });
            }
          })
        }
      }

    })
    this.showPropertyList();
  }
  onWatcherSelect(item) {
    this.showSearchWatcherList();
    this.props.searchWatcherChanged("");
    this.state.selectedWatcherData.push(item);
  }

  searchTradersItem = ({ item, index }) => {
    console.log("business :" ,item.data.business_name)
    let flag = false
    item.category.forEach(element => {
      // console.log(element, this.state.selectedTraderId, this.state.selectedCategory, "elementelement")
      if (element._id == this.state.selectedCategory._id) {
        flag = true
      }
    });
    if (flag) {
      return (item.data.business_name ?
        <TouchableOpacity
          onPress={contextRef.onTraderSelect.bind(contextRef, item)}
        >
          <Text
            style={[NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle, { paddingBottom: 3 }]}
          >
            {item.data.business_name}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.category.map((element, index) => {
              console.log(index, "indexindex")
              if (index < 2) {
                return (
                  <View style={{ height: 18, borderRadius: 2, backgroundColor: '#84bcea', paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 12, color: 'white' }}>{(element.name).toUpperCase()}</Text></View>
                )
              } else if (index == 3) {
                return (
                  <View style={{ height: 18, borderRadius: 2, backgroundColor: '#84bcea', paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 12, color: 'white' }}>{'+' + item.category.length - 2}</Text></View>
                )
              }
            })}
          </View>
        </TouchableOpacity> : null
      );
    }
  }
  searchTradersItem1 = ({ item, index }) => {
    console.log('savedTraders',item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.tradersChanged(item.data.firstname + ' ' + item.data.lastname + '-' + item.data.email)
          this.setState({ selectedTraderId: item.data._id, showSavedTraders: !this.state.showSavedTraders });
        }}>
         <Text style={[NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle, { paddingBottom: 3 }]}>
           {item.data.business_name}
         </Text>
         <View style={{ height: 18, borderRadius: 2, paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center' }}>
           <Text style={{ fontSize: 12 }}>
           {`- ${item.data.email}`}
             </Text>
           </View>
      </TouchableOpacity>
    );
  }
  searchPropertyItem({ item, index }) {
    return (
      <TouchableOpacity
        onPress={contextRef.onPropertySelect.bind(contextRef, item)}
      >
        <Text
          style={NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  }

  renderSearchWatcherItem({ item, index }) {
    return (
      <TouchableOpacity
        onPress={contextRef.onWatcherSelect.bind(contextRef, item)}
      >
        <Text
          style={NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle}
        >
          {item.firstname + " " + item.lastname}
        </Text>
      </TouchableOpacity>
    );
  }

  renderItem({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => contextRef.uploadImageListSelection(index)}
      >
        <View style={NewMaintenanceRequestScreenStyle.uploadImageListItemStyle}>
          <Image
            source={item.url}
            style={
              NewMaintenanceRequestScreenStyle.uploadPropertyListImageStyle
            }
          />
        </View>
        {item.isSelected == 1 ? (
          <View style={NewMaintenanceRequestScreenStyle.selectedImageStyle}>
            <View
              style={
                NewMaintenanceRequestScreenStyle.roundedBlueFeaturedButtonStyle
              }
            >
              <Text style={NewMaintenanceRequestScreenStyle.featuredTextStyle}>
                {Strings.FEATURED}
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }

  async SearchFilterFunction(text) {
    const newData = this.state.searchTraderListBackUp.filter(function (item) {
      if (item.data && item.data.business_name) {
        const itemData = item.data.business_name.trim().toUpperCase();
        const textData = text.trim().toUpperCase();
        return itemData.indexOf(textData) > -1;
      }
    });
    this.setState({
      searchTraderList: newData, showSavedTraders: true,
    });
  }
  async SearchPreviosFilterFunction(text) {
    const newData = this.state.previosTraderListBackUp.filter(function (item) {
      if (item.data && item.data.business_name) {
        const itemData = item.data.business_name.trim().toUpperCase();
        const textData = text.trim().toUpperCase();
        return itemData.indexOf(textData) > -1;
      }
    });
    this.setState({
      previosTraderList: newData, showSavedTraders: true,
    });
  }

  SearchWatcherFunction(text) {
    const newData = this.state.watcherData.filter(function (item) {

      const itemData = item.firstname.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      watcherSearchedData: newData
    });
  }
  _pickfromtraders = () => {
    if(this.state.showPickedTraders === true){
      this.setState({ showPickedTraders: false,showSavedTraders:true,isTraderListShow:true,selectedTraderId:'' });
    }else{
      this.SearchFilterFunction('');
      this.setState({ showPickedTraders: true,isTraderListShow:false });
    }
    this.props.tradersChanged('');
  }
  _renderpreviostraderData = (arrayObject)=>{
    return arrayObject.map((item,index)=>{
      return (item.data.business_name ?
        <TouchableOpacity onPress={contextRef.onTraderSelect.bind(contextRef, item)} >
          <Text style={[NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle, { paddingBottom: 3 }]}>
            {item.data.business_name}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.category.map((element, index) => {
              if (index < 2) {
                return (
                  <View style={{ height: 18, borderRadius: 2, backgroundColor: '#84bcea', paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 12, color: 'white' }}>{(element.name).toUpperCase()}</Text></View>
                )
              } else if (index == 3) {
                return (
                  <View style={{ height: 18, borderRadius: 2, backgroundColor: '#84bcea', paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 12, color: 'white' }}>{'+' + item.category.length - 2}</Text></View>
                )
              }
            })}
          </View>
        </TouchableOpacity> : null
      );
    });
  }
  _rendertraderData = (arrayObject)=>{
    return arrayObject.map((item,index)=>{
      return (item.data.business_name ?
        <TouchableOpacity onPress={contextRef.onTraderSelect.bind(contextRef, item)}>
          <Text
            style={[NewMaintenanceRequestScreenStyle.searchTraderListItemTextStyle, { paddingBottom: 3 }]}
          >
            {item.data.business_name}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.category.map((element, index) => {
              if (index < 2) {
                return (
                  <View style={{ height: 18, borderRadius: 2, backgroundColor: '#84bcea', paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 12, color: 'white' }}>{(element.name).toUpperCase()}</Text></View>
                )
              } else if (index == 3) {
                return (
                  <View style={{ height: 18, borderRadius: 2, backgroundColor: '#84bcea', paddingHorizontal: 5, marginHorizontal: 5, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 12, color: 'white' }}>{'+' + item.category.length - 2}</Text></View>
                )
              }
            })}
          </View>
        </TouchableOpacity> : null
      );
    // }
    })
  }
  render() {
    return (
      <View style={NewMaintenanceRequestScreenStyle.mainContainer}>
        {this.navBar()}
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            // scrollEnabled={this.state.enableScrollViewScroll}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps={'handled'}
          // contentContainerStyle={
          //   NewMaintenanceRequestScreenStyle.scrollViewContainerStyle
          // }
          >
            <View
              style={NewMaintenanceRequestScreenStyle.addPropertyInputContainer}
            >
              <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                {Strings.JOB_ADDRESS}
              </Text>
              <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                <TextInput
                  autoCapitalize="none"
                  ref="ref_property"
                  autoCorrect={false}
                  placeholder={Strings.JOB_ADDRESS}
                  underlineColorAndroid={Colors.TRANSPARENT}
                  style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                  onChangeText={(val) => this.onLocationChangeText(val.trimLeft(), "reqAddress")}
                  value={this.props.newMaintenanceRequestReducer.propertyName}
                  onSubmitEditing={event => {
                    this.refs.refReqName.focus();
                  }}
                />
                <Image
                  source={ImagePath.SEARCH_ICON}
                  style={NewMaintenanceRequestScreenStyle.searchImageStyle}
                />
              </View>
              {this.state.isPropertyListShow ? (
                <FlatList
                  style={[NewMaintenanceRequestScreenStyle.modalContainerStyles, { height: null }]}
                  horizontal={false}
                  data={this.state.predictions}
                  renderItem={this.searchPropertyItem}
                  extraData={this.state}
                />
              ) : null}
              <View style={{ paddingVertical: 10, paddingTop: 0 }}>
                <TouchableOpacity onPress={() => { this.setState({ mrType: 0, selectedTraderId: "" }); this.props.tradersChanged(""); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ height: 20, width: 20, borderWidth: 1, borderColor: this.state.mrType == 0 ? Colors.SKY_BLUE_BUTTON_BACKGROUND : Colors.GRAY_COLOR, backgroundColor: this.state.mrType == 0 ? Colors.SKY_BLUE_BUTTON_BACKGROUND : Colors.WHITE, borderRadius: 20, marginRight: 10 }}></View>
                  <Text style={{ fontSize: 15, paddingVertical: 10, fontWeight: '600', color: Colors.BLACK }}>DIRECT REQUEST</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { this.setState({ mrType: 1, selectedTraderId: "" }); this.props.tradersChanged(""); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ height: 20, width: 20, borderWidth: 1, borderColor: this.state.mrType == 1 ? Colors.SKY_BLUE_BUTTON_BACKGROUND : Colors.GRAY_COLOR, backgroundColor: this.state.mrType == 1 ? Colors.SKY_BLUE_BUTTON_BACKGROUND : Colors.WHITE, borderRadius: 20, marginRight: 10 }}></View>
                  <Text style={{ fontSize: 15, paddingVertical: 10, fontWeight: '600', color: Colors.BLACK }}>PUBLIC JOB</Text></TouchableOpacity>
              </View>


              {this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER ? (
                  <View
                    style={NewMaintenanceRequestScreenStyle.labelContainerStyle}
                  >
                    <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                      {this.state.mrType == 1 ? 'Service Category' : 'Trader Category'}
                    </Text>
                  </View>
                ) : null}

              {this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER ? (
                  <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder={'Search category'}
                      underlineColorAndroid={Colors.TRANSPARENT}
                      style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                      onChangeText={this.onServiceChange.bind(this)}
                      value={this.state.serviceCategory}
                      onSubmitEditing={event => {
                        this.refs.refReqName.focus();
                      }}
                    />
                    <Image
                      source={ImagePath.SEARCH_ICON}
                      style={NewMaintenanceRequestScreenStyle.searchImageStyle}
                    />
                  </View>
                ) : null}

              {this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER ? (
                  this.state.isServiceCategoryShow == true ? (
                    <FlatList
                      style={[NewMaintenanceRequestScreenStyle.modalContainerStyles, { marginBottom: 10 }]}
                      horizontal={false}
                      data={this.state.servicesList}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity onPress={() => {
                            let arr = this.state.tradersDataBackUp
                            if (this.props.newMaintenanceRequestReducer.propertyName != '') {
                              AsyncStorage.getItem("SyncittUserInfo").then(value => {
                                if (value) {
                                  var userData = JSON.parse(value);
                                  // this.setState({isScreenLoading:true});
                                  let requestParams = {
                                    address: this.props.newMaintenanceRequestReducer.propertyName,
                                    categories_id: item._id
                                  }
                                  console.log(requestParams, "requestParamsrequestParams")
                                  APICaller('provious_existing_traders', 'POST', userData.token, requestParams).then(data => {
                                    console.log('data.data.other_existing_traders',data);
                                    if(data.code === 200){
                                      this.setState({ searchTraderList: data.data.other_existing_traders, searchTraderListBackUp: data.data.other_existing_traders,previosTraderList: data.data.previous_traders, previosTraderListBackUp: data.data.previous_traders})
                                    }
                                    // this.setState({isScreenLoading:false })
                                  });
                                }
                                this.setState({ selectedCategory: item,serviceCategoryId:item._id, serviceCategory: item.name, isServiceCategoryShow: false, isTraderListShow: true, selectedTraderId: '' })
                              })
                            }
                          }} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                            <Text>{item.name}</Text>
                          </TouchableOpacity>
                        )
                      }}
                      extraData={this.state}
                    />
                  ) : null
                ) : null}



              {this.state.mrType == 0 && (this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER) ? (
                  <View
                    style={NewMaintenanceRequestScreenStyle.labelContainerStyle}>
                    <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                      {this.state.showPickedTraders?'Select Traders':Strings.SEARCH_TRADERS}
                    </Text>
                    <TouchableOpacity onPress={() => this._pickfromtraders()}>
                      <Text style={NewMaintenanceRequestScreenStyle.pickSavedTradersLabelStyle}>
                        {Strings.PICK_FROM_SAVED_TRADERS}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

              {this.state.mrType == 0 && !this.state.showPickedTraders && (this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER) ? (
                  <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder={Strings.SEARCH_TRADERS}
                      underlineColorAndroid={Colors.TRANSPARENT}
                      style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                      onChangeText={this.onTraderNameChange.bind(this)}
                      value={this.props.newMaintenanceRequestReducer.traderName}
                      onSubmitEditing={event => {
                        this.refs.refReqName.focus();
                      }}
                    />
                    <Image
                      source={ImagePath.SEARCH_ICON}
                      style={NewMaintenanceRequestScreenStyle.searchImageStyle}
                    />
                  </View>
                ) : null}

              {this.state.showSavedTraders && !this.state.showPickedTraders && (this.state.searchTraderList.length > 0||this.state.previosTraderList.length > 0) &&
                (this.state.roleName == Strings.USER_ROLE_AGENT || this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                  this.state.roleName == Strings.USER_ROLE_OWNER) ? (
                  this.state.isTraderListShow == true ? (
                    <ScrollView style={NewMaintenanceRequestScreenStyle.modalContainerStyles}>
                      {this.state.previosTraderList.length > 0 && <Text style={{fontSize:14,color:'black',paddingLeft:5,paddingVertical:5,backgroundColor:Colors.GRAY}}>Previous Traders</Text>}
                      {this.state.previosTraderList.length > 0 && this._renderpreviostraderData(this.state.previosTraderList)}
                      {this.state.searchTraderList.length > 0 && <Text style={{fontSize:14,color:'black',paddingLeft:5,paddingVertical:5,backgroundColor:Colors.GRAY}}>Save Traders</Text>}
                      {this.state.searchTraderList.length > 0 && this._rendertraderData(this.state.searchTraderList)}
                    </ScrollView>
                    // <FlatList
                    //   style={NewMaintenanceRequestScreenStyle.modalContainerStyles}
                    //   horizontal={false}
                    //   data={this.state.searchTraderList}
                    //   nestedScrollEnabled
                    //   keyboardShouldPersistTaps={'handled'}
                    //   renderItem={this.searchTradersItem}
                    //   extraData={this.state}
                    // />
                  ) : null
                ) : null}

              {this.state.mrType == 0 && this.state.showPickedTraders && (this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER) ? (
                  <TouchableOpacity onPress={() => this.setState({ showSavedTraders: !this.state.showSavedTraders })} style={[NewMaintenanceRequestScreenStyle.searchViewStyle,{flexDirection:'row'}]}>
                    <Text style={[NewMaintenanceRequestScreenStyle.searchTextInputStyle, this.props.newMaintenanceRequestReducer.traderName ? null : { color: Colors.GRAY }]}>{this.props.newMaintenanceRequestReducer.traderName ? this.props.newMaintenanceRequestReducer.traderName : 'Select Trader'}</Text>
                    <Image
                      source={ImagePath.ARROW_DOWN}
                      style={NewMaintenanceRequestScreenStyle.searchImageStyle}
                    />
                  </TouchableOpacity>
                ) : null}

              {this.state.mrType == 0 && !this.state.showSavedTraders && this.state.showPickedTraders && (this.state.roleName == Strings.USER_ROLE_AGENT ||
                this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ||
                this.state.roleName == Strings.USER_ROLE_OWNER) ? (
                  <FlatList
                    style={NewMaintenanceRequestScreenStyle.modalContainerStyles}
                    horizontal={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps={'handled'}
                    data={this.state.savedTraders}
                    renderItem={this.searchTradersItem1}
                    extraData={this.state}
                  />
                ) : null}

              <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                {'Request Subject'}
                {/* {Strings.REQUEST_NAME} */}
              </Text>
              <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                <TextInput
                  ref="refReqName"
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid={Colors.TRANSPARENT}
                  style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                  onChangeText={this.onRequestNameChange.bind(this)}
                  value={
                    this.props.newMaintenanceRequestReducer.maintenanceRequestName
                  }
                  onSubmitEditing={event => {
                    this.refs.refBudget.focus();
                  }}
                />
              </View>
              <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                {Strings.BUDGET_LABEL}
              </Text>
              <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                <TextInput
                  ref="refBudget"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={'numeric'}
                  underlineColorAndroid={Colors.TRANSPARENT}
                  style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                  onChangeText={this.onBudgetChange.bind(this)}
                  value={this.props.newMaintenanceRequestReducer.maintenanceBudget}
                  onSubmitEditing={event => {
                    this.refs.refReqDetail.focus();
                  }}
                />
              </View>

              <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                {Strings.DUE_DATE}
              </Text>
              <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                <DatePicker
                  style={NewMaintenanceRequestScreenStyle.datePickerStyle}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="MMM DD YYYY"
                  minDate={this.state.minDate}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      right: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 0,
                      position: "absolute",
                      left: 5,
                      borderBottomWidth: 0,
                      borderLeftWidth: 0,
                      borderTopWidth: 0,
                      borderRightWidth: 0
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={date => {
                    console.log(date, new Date(date).toISOString())
                    this.setState({ date: new Date(date) });
                  }}
                />
              </View>
              <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                {Strings.REQUEST_DETAILS}
              </Text>
              <TextInput
                ref="refReqDetail"
                style={NewMaintenanceRequestScreenStyle.inputDescriptionTextStyle}
                multiline={true}
                onChangeText={this.onReqDetailChange.bind(this)}
                value={this.props.newMaintenanceRequestReducer.reqDetail}
                onSubmitEditing={event => {
                  // this.refs.refWatcher.focus();
                }}
              />

              {/* <Text style={NewMaintenanceRequestScreenStyle.labelStyle}>
                {Strings.TAG_WATCHER_FOR_REQUEST}
              </Text>

              <View style={NewMaintenanceRequestScreenStyle.searchViewStyle}>
                <TextInput
                  ref="refWatcher"
                  placeholder={Strings.SEARCH}
                  underlineColorAndroid={Colors.TRANSPARENT}
                  style={NewMaintenanceRequestScreenStyle.searchTextInputStyle}
                  onChangeText={this.onWatcherNameChange.bind(this)}
                  value={
                    this.props.newMaintenanceRequestReducer.searchWatcherName
                  }
                />
                <Image
                  source={ImagePath.SEARCH_ICON}
                  style={NewMaintenanceRequestScreenStyle.searchImageStyle}
                />
              </View> */}

              {this.state.isSearchWatcherListShow == true ? (
                <FlatList
                  style={
                    NewMaintenanceRequestScreenStyle.watcherListContainerStyles
                  }
                  horizontal={false}
                  data={this.state.watcherSearchedData}
                  renderItem={this.renderSearchWatcherItem}
                  extraData={this.state}
                />
              ) : null}
              <FlatList
                horizontal={false}
                numColumns={2}
                data={this.state.selectedWatcherData}
                renderItem={this.searchRenderItem}
                extraData={this.state}
              />
            </View>

            <View>
              <View
                style={
                  NewMaintenanceRequestScreenStyle.uploadImageListContainerView
                }
              >
                <Text style={NewMaintenanceRequestScreenStyle.maxImageTextStyle}>
                  {Strings.MAX_IMAGE_LIMIT}
                </Text>
                {this.state.selectedImage != "" ? (
                  <Image
                    source={this.state.selectedImage}
                    style={
                      NewMaintenanceRequestScreenStyle.uploadPropertyImageStyle
                    }
                  />
                ) : null}
                <View style={{ marginTop: 10 }}>
                  {this.state.uploadImagesData.imageArray ? (
                    <FlatList
                      horizontal={true}
                      data={this.state.uploadImagesData.imageArray}
                      renderItem={this.renderItem}
                      extraData={this.state}
                    />
                  ) : null}
                </View>
                <TouchableOpacity
                  style={NewMaintenanceRequestScreenStyle.uploadImageButtonStyle}
                  onPress={() => this.showActionSheet()}
                >
                  <View>
                    <Text
                      style={
                        NewMaintenanceRequestScreenStyle.uploadButtonTextStyle
                      }
                    >
                      {Strings.UPLOAD_IMAGE}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 50 }} />
          </ScrollView>
        </View>
        <View style={NewMaintenanceRequestScreenStyle.buttonContainerStyle}>
          <TouchableOpacity onPress={() => this.callAddMaintenanceReqApi()}>
            <View
              style={
                NewMaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle
              }
            >
              <Text
                style={NewMaintenanceRequestScreenStyle.proceedButtonTextStyle}
              >
                {Strings.SUBMIT_REQUEST}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={actionOptions}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />

        {
          (this.props.newMaintenanceRequestReducer.isScreenLoading || this.state.isScreenLoading) ? (
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
    homeScreenReducer: state.homeScreenReducer,
    newMaintenanceRequestReducer: state.newMaintenanceRequestReducer
  };
}

export default connect(
  mapStateToProps,
  {
    clearUploadedImageRes,
    addMaintenanceReq,
    maintenanceReqDetailChanged,
    maintenanceReqNameChanged,
    propertyNameChanged,
    maintenanceBudgetChanged,
    uploadMaintenaceImage,
    searchWatcherChanged,
    getWatherList,
    getPropertyList,
    tradersChanged,
    getMaintenancePropertyList,
    getTradersOptionList,
    showLoading,
    resetState,
    updateScene,
    clearAddMaintenanceRes
  }
)(NewMaintenanceRequestScreen);
