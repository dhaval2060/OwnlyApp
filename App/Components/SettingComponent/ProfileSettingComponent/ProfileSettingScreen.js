import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  ImageBackground,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import ProfileSettingScreenStyle from "./ProfileSettingScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import * as Progress from "react-native-progress";
import API from "../../../Constants/APIUrls";
import ImagePicker from 'react-native-image-picker';
// var ImagePicker = require("react-native-image-picker");
import ActionSheet from "react-native-actionsheet";
import { connect } from "react-redux";
import {
  showLoading,
  showScreenLoading,
  phoneNumberChanged,
  suburbPostcodeChanged,
  businessNameChanged,
  abnNumberChanged,
  latitudeChanged,
  longitudeChanged,
  clearUserImageInfo,
  aboutUserChanged,
  firstNameChanged,
  lastNameChanged,
  cityNameChanged,
  stateChanged,
  agencyChanged,
  zipCodeChanged,
  rateChanged,
  resetState,
  clearUserInfo,
  clearAgencyList,
  clearAssociateAgency
} from "./UpdateImageAction";

import {
  updateUserImage,
  getUserDetails,
  updateUserDetails,
  getAllAgencyList,
  getAssociateWithAgency
} from "../../../Action/ActionCreators";
import APICaller, { GetLocation, GetLatLong } from "../../../Saga/APICaller";
import { Matrics } from "../../../CommonConfig";
import IMAGEPATH from "../../../Constants/ImagesPath";

var options = {
  title: "Select Property Image",
  quality: 0.3,
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
var responseData = {};
let stateList = [
  { value: "New South Wales" },
  { value: "Australian Capital Territory" },
  { value: "Victoria" },
  { value: "Queensland" },
  { value: "South Australia" },
  { value: "Western Australia" },
  { value: "Tasmania" },
  { value: "Northern Territory" }
];

class ProfileSettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      fullAdrees:null,
      userProfileDetails: {},
      predictions: [],
      countryData: [],
      stateData: [],
      selectedState: "",
      selectedAgency: "",
      selectedAgencyId: "",
      selectedServiceTags: [],
      showLoader: false,
      agencyList: [],
      cityData: [],
      zipCodeData: [],
      serviceCategories: [],
      serviceCategoriesBackUp: [],
      isEditable: false,
      isDisabled: true,
      agencyID: "",
      roleName: "",
      isChanged: false
    };
    this.handlePress = this.handlePress.bind(this);
  }

  componentWillReceiveProps(nextProps) { }

  componentDidUpdate() {
    this.onUpdateImageSuccess();
    this.onUserDetailsSuccess();
    this.onAgencyListSuccess();
    this.onAgencyAssociateSuccess();
  }

  componentWillUnmount() { }

  componentWillMount() {
    this.setState({ stateData: stateList });
    this.getUserDetails();
    this.callAgencyList();
    this.getRoleName();
    this.getServicesCategory();
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

  prepareAgencyDropdownData(agencyData) {
    var tempArray = agencyData;
    tempArray.map((data, index) => {
      tempArray[index].value = tempArray[index].name;
      tempArray[index].id = tempArray[index]._id;
    });

    return tempArray;
  }

  onEditClick() {
    this.setState({ isEditable: true });
    this.setState({ isDisabled: false });
  }
  getServicesCategory() {
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        APICaller(
          "getServiceCategory",
          "GET",
          authToken
        ).then(data => {

          if (data.code == 200) {
            let arr = []
            this.setState({ serviceCategories: data.data, serviceCategoriesBackUp: [] })

          }
          this.getUserDetails();

        });
      }
    });
  }
  onUserDetailsSuccess() {
    if (this.props.updateUserImageReducer.userDetailsRes != "") {
      console.log(this.props.updateUserImageReducer, "this.props.updateUserImageReducer.userDetailsRes")
      if (this.props.updateUserImageReducer.userDetailsRes.code == 200) {
        responseData = this.props.updateUserImageReducer.userDetailsRes.data;
        if (responseData.agency_id != undefined) {
          if (responseData.agency_id.name == undefined) {
            this.getUserDetails();
          }
        }
        this.setState({
          agencyID: responseData.agency_id ? responseData.agency_id : ""
        });
        AsyncStorage.setItem(
          "SyncittUserProfileInfo",
          JSON.stringify(this.props.updateUserImageReducer.userDetailsRes)
        );
        let image = this.props.updateUserImageReducer.userDetailsRes.data.image
        global.userImage = API.USER_IMAGE_PATH + image
        AsyncStorage.getItem("SyncittUserInfo").then(value => {
          let arr = JSON.parse(value)
          arr.data['image'] = image
          AsyncStorage.setItem("SyncittUserInfo", JSON.stringify(arr))
        })
          .done();

        this.setState({
          userProfileDetails: this.props.updateUserImageReducer.userDetailsRes
        });
        this.setState({
          countryData: this.prepareCountryDropdownData(responseData.country)
        });
        //this.setState({ stateData: this.prepareStateDropdownData(responseData.state) });

        // this.setState({ zipCodeData: this.prepareZipcodeDropdownData(.zipCode) });
        this.setState({ selectedState: responseData.state, isChanged: false });

        this.setState({
          cityData: this.prepareCityDropdownData(responseData.city)
        });
        if (responseData.categories_id) {
          // this.state.serviceCategories.forEach(element => {
          //   if (responseData.categories_id.includes(element._id)) {
          //     element['isSelected'] = true
          //     arr.push(element)
          //   }
          //   else {
          //     element['isSelected'] = false
          //     arr.push(element)
          //   }
          // });
          this.setState({ selectedServiceTags: responseData.categories_id })
        }
        // this.setState({ zipCodeData: this.prepareZipcodeDropdownData(.zipCode) });
        this.setUserData(responseData);
      } else {
        // alert(this.props.updateUserImageReducer.userDetailsRes.message);
        //alert(this.props.updateUserImageReducer.uploadUserImageRes.message);
      }
      // this.props.resetState();
      this.props.clearUserInfo();
    }
  }
  onUpdateImageSuccess() {
    console.log(this.props.updateUserImageReducer, "this.props.updateUserImageReducer")
    if (this.props.updateUserImageReducer.updateUserImageRes != "") {
      if (this.props.updateUserImageReducer && this.props.updateUserImageReducer.updateUserImageRes && this.props.updateUserImageReducer.updateUserImageRes.code == 200) {
        // let image = this.props.updateUserImageReducer.updateUserImageRes.data.image
        // global.userImage = API.USER_IMAGE_PATH + image
        // AsyncStorage.getItem("SyncittUserInfo").then(value => {
        //   let arr = JSON.parse(value)
        //   arr.data['image'] = image
        //   AsyncStorage.setItem("SyncittUserInfo", JSON.stringify(arr))
        // })
        //   .done();
        // AsyncStorage.setItem(
        //   "SyncittUserProfileInfo",
        //   JSON.stringify(this.props.updateUserImageReducer.updateUserImageRes)
        // );
        this.setState({ showLoader: false });
        this.getUserDetails();
        // this.setState({ userProfileDetails: this.props.updateUserImageReducer.updateUserImageRes, showLoader: false });
      } else {
        //alert('');
      }
      this.props.clearUserImageInfo();
    }
  }

  getUserDetails() {
    AsyncStorage.getItem("roleId")
      .then(roleId => {
        if (roleId) {
          AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
              if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                let postData = {
                  userId: userData.data._id,
                  roleId: roleId
                };
                this.props.showScreenLoading();
                this.props.getUserDetails(authToken, postData);
              }
            })
            .done();
        }
      })
      .done();
  }

  callUpdateUserDetails() {
    AsyncStorage.getItem("roleId")
      .then(role => {
        if (role) {
          AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
              if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                let postData={};
                if(this.state.roleName == Strings.USER_ROLE_TRADER){
                  postData = {
                    userId: userData.data._id,
                    firstname: this.props.updateUserImageReducer.firstName,
                    lastname: this.props.updateUserImageReducer.lastName,
                    email: userData.data.email,
                    mobile_no: this.props.updateUserImageReducer.phoneNumber,
                    about_user: this.props.updateUserImageReducer.aboutUser,
                    country: userData.data.country,
                    state: this.props.updateUserImageReducer.stateName,
                    city: this.props.updateUserImageReducer.cityName,
                    roleId: role,
                    categories_id: this.state.selectedServiceTags,
                    // 03/09/2020
                    business_name: this.props.updateUserImageReducer.business_name,
                    abn_number: this.props.updateUserImageReducer.abn_number,
                    location_administrative_area_level_1:this.state.fullAdrees?this.state.fullAdrees.structured_formatting.secondary_text:'',
                    location_country:'AU',
                    location_locality:this.state.fullAdrees?this.state.fullAdrees.structured_formatting.main_text:'',
                    location_postal_code:"",
                    location_street_number:'',
                    rate:this.props.updateUserImageReducer.rate,
                    suburb_postcode: this.props.updateUserImageReducer.suburb_postcode,
                    location_latitude: Number(this.props.updateUserImageReducer.location_latitude),
                    location_longitude: Number(this.props.updateUserImageReducer.location_longitude),
                  };
                }else{
                  postData = {
                    userId: userData.data._id,
                    firstname: this.props.updateUserImageReducer.firstName,
                    lastname: this.props.updateUserImageReducer.lastName,
                    email: userData.data.email,
                    mobile_no: this.props.updateUserImageReducer.phoneNumber,
                    about_user: this.props.updateUserImageReducer.aboutUser,
                    country: userData.data.country,
                    state: this.props.updateUserImageReducer.stateName,
                    zipCode: this.props.updateUserImageReducer.zipCode,
                    city: this.props.updateUserImageReducer.cityName,
                    roleId: role,
                    categories_id: this.state.selectedServiceTags,
                  };
                }
                console.log(postData)
                this.props.showScreenLoading();
                this.setState({ isEditable: false });
                this.setState({ isDisabled: true });
                this.props.updateUserDetails(authToken, postData);
              }
            })
            .done();
        }
      })
      .done();
  }

  sendRequest() {
    if (this.state.selectedAgencyId !== undefined) {
      AsyncStorage.getItem("SyncittUserInfo")
        .then(value => {
          if (value) {
            var postdata = {};
            var userData = JSON.parse(value);
            var authToken = userData.token;
            let postData = {
              sender_id: userData.data._id,
              receiver_id: this.state.selectedAgencyId,
              agencyName: this.state.selectedAgency,
              userName: userData.data.firstname + " " + userData.data.lastname
            };


            this.props.showScreenLoading();
            this.props.getAssociateWithAgency(authToken, postData);
          }
        })
        .done();
    } else {
      alert("Please select agency");
    }
  }

  onAgencyAssociateSuccess() {
    if (this.props.updateUserImageReducer.agencyAssociateRes != "") {

      if (this.props.updateUserImageReducer.agencyAssociateRes.code == 200) {
        alert(this.props.updateUserImageReducer.agencyAssociateRes.message);
      } else {
        alert(this.props.updateUserImageReducer.agencyAssociateRes.message);
      }
      this.props.clearAssociateAgency();
    }
  }

  callAgencyList() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var postdata = {};
          var userData = JSON.parse(value);
          var authToken = userData.token;

          this.props.getAllAgencyList(authToken);
        }
      })
      .done();
  }

  onAgencyListSuccess() {
    if (this.props.updateUserImageReducer.agencyList != "") {


      if (this.props.updateUserImageReducer.agencyList.code == 200) {
        this.setState({
          agencyList: this.prepareAgencyDropdownData(
            this.props.updateUserImageReducer.agencyList.data
          )
        });
      } else {
        alert(this.props.updateUserImageReducer.agencyList.message);
      }
      this.props.clearAgencyList();
    }
  }

  showCamera() {
    // Launch Camera:
    ImagePicker.launchCamera(options, response => {

      if (response.didCancel) {

      } else if (response.error) {

      } else if (response.customButton) {

      } else {
        response.data = "";
        let source = { uri: response.uri };
        var path = response.uri.replace("file://", "");
        let imagePath = Platform.OS == "ios" ? path : response.path;
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
        this.setState({ showLoader: true })
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var _id = userData.data._id;
              this.props.showLoading();

              this.props.updateUserImage(
                authToken,
                response.uri.replace("file://", ""),
                _id
              );
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
        this.setState({ showLoader: true })
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var _id = userData.data._id;
              this.props.showLoading();
              // let postData = {
              //   token: authToken,
              //   data: response.data
              // }
              // this.props.updateUserImage(postData)
              // response.uri.replace("file://", ""),
              this.props.updateUserImage(
                authToken,
                response.data,
                _id
              );
            }
          })
          .done();
      }
    });
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

  prepareCountryDropdownData(countryData) {
    var tempArray = [];
    var country = {
      value: countryData
    };
    tempArray.push(country);
    //tempArray[index].id = tempArray[index].property_owner._id;


    return tempArray;
  }

  prepareStateDropdownData(stateData) {

    var tempArray = [];
    var states = {
      value: stateData
    };
    tempArray.push(states);

    // tempArray[index].id = tempArray[index].property_owner._id;


    return tempArray;
  }

  prepareCityDropdownData(cityData) {
    var tempArray = [];
    var City = {
      value: cityData
    };
    tempArray.push(City);

    // tempArray[index].id = tempArray[index].property_owner._id;


    return tempArray;
  }

  prepareZipcodeDropdownData(zipCodeData) {
    var tempArray = [];
    var zipcode = {
      value: zipCodeData
    };
    tempArray.push(zipcode);
    //tempArray[index].id = tempArray[index].property_owner._id;


    return tempArray;
  }

  onPhoneNumberChange(text) {
    this.setState({ isChanged: true });
    this.props.phoneNumberChanged(text);
  }
  onPressLocation(element, reqAddress) {
    console.log(element, "elementelement")
    this.setState({fullAdrees:element});
    this.setState({ predictions: [] })
    this.props.suburbPostcodeChanged(element.description);
    GetLatLong(element.place_id).then(data => {
      console.log(data, "datadatadatadata")
      if (data.status == "INVALID_REQUEST") {

      } else {
        // this.setState({ reqLatitude: data.result.geometry.location.lat, reqLongitude: data.result.geometry.location.lng })
        this.props.latitudeChanged(data.result.geometry.location.lat);
        this.props.longitudeChanged(data.result.geometry.location.lng);
      }

    })
  }
  onSuburbPostcodeChange(text) {
    this.setState({ isChanged: true });
    this.props.suburbPostcodeChanged(text);
    GetLocation(text).then(data => {
      if (data.predictions.length > 0) {
        console.log(data.predictions, "data.predictions")
        this.setState({ predictions: data.predictions })
      }
      else if (data.status == 'ZERO_RESULTS') {
        this.setState({ predictions: [] })
      }
    })

  }

  onAbnNumberChange(text) {
    this.setState({ isChanged: true });
    this.props.abnNumberChanged(text);
  }

  onBusinessNameChange(text) {
    this.setState({ isChanged: true });
    this.props.businessNameChanged(text);
  }

  onAboutUserChange(text) {
    this.setState({ isChanged: true });
    this.props.aboutUserChanged(text);
  }

  onFirstNameChange(text) {
    this.setState({ isChanged: true });
    this.props.firstNameChanged(text);
  }
  onLastNameChange(text) {
    this.setState({ isChanged: true });
    this.props.lastNameChanged(text);
  }

  onCityNameChange(text) {
    this.setState({ isChanged: true });
    this.props.cityNameChanged(text);
  }
  onZipCodeChange(text) {
    this.props.zipCodeChanged(text);
    this.setState({ isChanged: true });
  }
  onRateChange(text) {
    this.props.rateChanged(text);
    this.setState({ isChanged: true });
  }
  onStateChange(text) {

    if (this.state.editable) {
      this.setState({ isChanged: true });
    }
    this.props.stateChanged(text);
  }

  onAgencyChange(text) {

    if (this.state.editable) {
      this.setState({
        isChanged: true,
        selectedAgencyId: this.state.agencyList[
          this.refs.ref_agency.selectedIndex()
        ].id,
        selectedAgency: text
      });
    }
    this.props.agencyChanged(text);
  }

  setUserData(responseData) {
    console.log(responseData, "responseDataresponseData")
    if (responseData.groups) {
      this.props.aboutUserChanged(responseData.groups.about_user);
    }
    this.props.phoneNumberChanged(responseData.mobile_no);
    this.props.suburbPostcodeChanged(responseData.suburb_postcode);
    this.props.businessNameChanged(responseData.business_name);
    this.props.abnNumberChanged(responseData.abn_number);
    this.props.latitudeChanged(responseData.location_latitude);
    this.props.longitudeChanged(responseData.location_longitude);
    this.props.firstNameChanged(responseData.firstname);
    this.props.lastNameChanged(responseData.lastname);
    this.props.cityNameChanged(responseData.city);
    this.props.zipCodeChanged(responseData.zipCode);
    this.props.stateChanged(responseData.state);
    this.props.rateChanged(responseData.rate?responseData.rate:'');
  }

  render() {
    var userData = this.state.userProfileDetails
      ? this.state.userProfileDetails.data
      : "";
    var userImagePath = this.state.userProfileDetails.data
      ? this.state.userProfileDetails.data.image
        ? API.USER_IMAGE_PATH + this.state.userProfileDetails.data.image
        : ""
      : "";
    var firstName = userData ? userData.firstname : "";
    var lastName = userData ? userData.lastname : "";

    return (
      <View style={ProfileSettingScreenStyle.settingContainerStyle}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              ProfileSettingScreenStyle.scrollViewContainerStyle
            }
          >
            <View style={ProfileSettingScreenStyle.profileTopContainerStyle}>
              <View style={ProfileSettingScreenStyle.imageContainer}>
                {userImagePath.includes("undefined") || userImagePath == "" ? (
                  <View style={ProfileSettingScreenStyle.emptyUserImageStyle}>
                    <Text style={CommonStyles.initialTextStyle}>
                      {firstName ? firstName.charAt(0).toUpperCase() : "" +
                        " " +
                        lastName ? lastName.charAt(0).toUpperCase() : ""}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.showActionSheet()}
                      style={[ProfileSettingScreenStyle.editImageView, { alignSelf: 'center', bottom: 7, borderBottomRightRadius: 150, borderBottomLeftRadius: 150 }]}
                    >
                      <View style={{ marginTop: 0 }}>
                        {/* <Image source={ImagePath.EDIT_PEN_WHITE} /> */}
                        <Text style={{ color: 'white' }}>Edit</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                    <ImageBackground
                      source={{ uri: userImagePath }}
                      style={ProfileSettingScreenStyle.userImageStyle}
                      imageStyle={ProfileSettingScreenStyle.userImageStyle}
                      contentContainerStyle={ProfileSettingScreenStyle.userImageStyle}>
                      <TouchableOpacity
                        onPress={() => this.showActionSheet()}
                        style={[ProfileSettingScreenStyle.editImageView, { alignSelf: 'center', bottom: 7, borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }]}
                      >
                        <View style={{ marginTop: 0 }}>
                          {/* <Image source={ImagePath.EDIT_PEN_WHITE} /> */}
                          <Text style={{ color: 'white' }}>Edit</Text>
                        </View>
                      </TouchableOpacity>

                    </ImageBackground>
                  )}
                {/* <TouchableOpacity style={ProfileSettingScreenStyle.editTextContainer} onPress={() => this.showActionSheet()} >
                                <Text style={ProfileSettingScreenStyle.editTextStyle}>{Strings.EDIT}</Text>
                            </TouchableOpacity> */}

                {//23 Nov
                  this.props.updateUserImageReducer.isScreenLoading ? (
                    <View style={CommonStyles.circles}>
                      <Progress.CircleSnail
                        color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
                      />
                    </View>
                  ) : null
                  //
                }



              </View>
              <View style={ProfileSettingScreenStyle.userNameContainerStyle}>
                {this.state.isEditable ? (
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      style={ProfileSettingScreenStyle.firstnameInputTextStyle}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      editable={this.state.isEditable}
                      value={this.props.updateUserImageReducer.firstName}
                      onChangeText={this.onFirstNameChange.bind(this)}
                    />

                    <TextInput
                      style={ProfileSettingScreenStyle.firstnameInputTextStyle}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      editable={this.state.isEditable}
                      value={this.props.updateUserImageReducer.lastName}
                      onChangeText={this.onLastNameChange.bind(this)}
                    />
                  </View>
                ) : (
                    <Text style={ProfileSettingScreenStyle.userNameTextStyle}>
                      {userData && userData.firstname ? userData.firstname : "" + " "}
                      {' '} {userData && userData.lastname ? userData.lastname : "" + " "}
                    </Text>
                  )}
                {this.state.isEditable ? null : (
                  <TouchableOpacity onPress={() => this.onEditClick()}>
                    <Image
                      source={ImagePath.EDIT_PEN_ICON}
                      style={ProfileSettingScreenStyle.editImageStyle}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={ProfileSettingScreenStyle.emailTextStyle}>
                {userData ? userData.email : ""}
              </Text>
              {this.state.isEditable ? null : (
                  <TouchableOpacity style={ProfileSettingScreenStyle.editProfileOuterView} onPress={() => this.onEditClick()}>
                    <Text style={ProfileSettingScreenStyle.editProfileTextStyle}>EDIT PROFILE</Text>
                  </TouchableOpacity>
                )}
            </View>

            <View style={ProfileSettingScreenStyle.profileBottomContainerStyle}>
              <View>
                {this.state.roleName == Strings.USER_ROLE_TRADER &&
                  <View>

                    <Text style={ProfileSettingScreenStyle.labelStyle}>
                      {Strings.SUBURB_OR_POSTCODE}
                    </Text>
                    <TextInput
                      style={ProfileSettingScreenStyle.dropDownViewStyle}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      editable={this.state.isEditable}
                      value={this.props.updateUserImageReducer.suburb_postcode}
                      onChangeText={this.onSuburbPostcodeChange.bind(this)}
                    />
                    <View style={{ alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '85%' }}>
                      {this.state.predictions.map(element => {
                        return (
                          <TouchableOpacity onPress={this.onPressLocation.bind(this, element)} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                            <View style={{ flex: 0.1 }}>
                              <Image source={IMAGEPATH.MAP_MARKER} style={{ marginRight: Matrics.ScaleValue(15) }} />
                            </View>
                            <View style={{ flex: 0.9 }}>
                              <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{element.description}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </View>

                    <Text style={ProfileSettingScreenStyle.labelStyle}>
                      {Strings.BUSINESS_NAME}
                    </Text>
                    <TextInput
                      style={ProfileSettingScreenStyle.dropDownViewStyle}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      editable={this.state.isEditable}
                      value={this.props.updateUserImageReducer.business_name}
                      onChangeText={this.onBusinessNameChange.bind(this)}
                    />

                    <Text style={ProfileSettingScreenStyle.labelStyle}>
                      {Strings.ABN_NUMBER}
                    </Text>
                    <TextInput
                      style={ProfileSettingScreenStyle.dropDownViewStyle}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      editable={this.state.isEditable}
                      value={this.props.updateUserImageReducer.abn_number}
                      onChangeText={this.onAbnNumberChange.bind(this)}
                    />


                  </View>}

                <Text style={ProfileSettingScreenStyle.labelStyle}>
                  {Strings.PHONE_NUMBER}
                </Text>
                <TextInput
                  style={ProfileSettingScreenStyle.dropDownViewStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  returnKeyType="next"
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={this.state.isEditable}
                  value={this.props.updateUserImageReducer.phoneNumber}
                  onChangeText={this.onPhoneNumberChange.bind(this)}
                />

                <Text style={ProfileSettingScreenStyle.labelStyle}>
                  {Strings.COUNTRY}
                </Text>

                <Dropdown
                  label=""
                  labelHeight={5}
                  fontSize={14}
                  baseColor={Colors.WHITE}
                  containerStyle={ProfileSettingScreenStyle.dropDownViewStyle}
                  data={this.state.countryData}
                  value={
                    this.state.countryData.length > 0
                      ? this.state.countryData[0].value
                      : ""
                  }
                />

                <Text style={ProfileSettingScreenStyle.labelStyle}>
                  {Strings.STATE}
                </Text>
                <Dropdown
                  label=""
                  labelHeight={5}
                  fontSize={14}
                  editable={this.state.isEditable}
                  baseColor={Colors.WHITE}
                  containerStyle={ProfileSettingScreenStyle.dropDownViewStyle}
                  data={this.state.stateData}
                  onChangeText={this.onStateChange.bind(this)}
                  value={this.state.selectedState}
                />

                <Text style={ProfileSettingScreenStyle.labelStyle}>
                  {Strings.CITY}
                </Text>
                <TextInput
                  style={[ProfileSettingScreenStyle.inputTextStyle, { borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR }]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  returnKeyType="next"
                  editable={this.state.isEditable}
                  value={this.props.updateUserImageReducer.cityName}
                  onChangeText={this.onCityNameChange.bind(this)}
                />

                <Text style={ProfileSettingScreenStyle.labelStyle}>
                  {Strings.ZIP_CODE}
                </Text>
                <TextInput
                  style={[ProfileSettingScreenStyle.inputTextStyle, { borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR }]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  returnKeyType="next"
                  keyboardType="number-pad"
                  maxLength={4}
                  editable={this.state.isEditable}
                  value={this.props.updateUserImageReducer.zipCode}
                  onChangeText={this.onZipCodeChange.bind(this)}
                />
                {this.state.roleName == Strings.USER_ROLE_TRADER &&
                  <View>
                    <Text style={ProfileSettingScreenStyle.labelStyle}>
                      Rate (hr)
                    </Text>
                    <TextInput
                      style={[ProfileSettingScreenStyle.inputTextStyle, { borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR }]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="next"
                      keyboardType="number-pad"
                      editable={this.state.isEditable}
                      value={this.props.updateUserImageReducer.rate}
                      onChangeText={this.onRateChange.bind(this)}
                    />
                  </View>
                }

                {this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER || this.state.roleName == Strings.USER_ROLE_TRADER ? null : (
                  <View style={ProfileSettingScreenStyle.sendContainerViewStyle}>
                    <View style={ProfileSettingScreenStyle.sendContainerStyle}>
                      <Text style={ProfileSettingScreenStyle.labelStyle}>
                        {Strings.ASSOCIATE_WITH_AGENCY}
                      </Text>

                      {this.state.agencyID != "" ? (
                        <TextInput
                          style={[ProfileSettingScreenStyle.inputTextStyle, { borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR }]}
                          autoCapitalize="none"
                          autoCorrect={false}
                          underlineColorAndroid="transparent"
                          editable={this.state.isEditable}
                          value={
                            responseData.agency_id
                              ? responseData.agency_id.name
                              : "Select agency"
                          }
                        />
                      ) : (
                          <Dropdown
                            ref="ref_agency"
                            label=""
                            disabled={this.state.isEditable}
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={
                              ProfileSettingScreenStyle.dropDownViewStyle
                            }
                            data={this.state.agencyList}
                            onChangeText={this.onAgencyChange.bind(this)}
                            value={
                              responseData.agency_id
                                ? responseData.agency_id.name
                                : "Select agency"
                            }
                          />
                        )}
                    </View>

                    {this.state.agencyID != "" ? null : (
                      <TouchableOpacity onPress={() => this.sendRequest()}>
                        <View
                          style={
                            ProfileSettingScreenStyle.roundedBlueSendButtonStyle
                          }
                        >
                          <Text
                            style={ProfileSettingScreenStyle.sendRequestTextStyle}
                          >
                            {Strings.SEND}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {this.state.roleName == Strings.USER_ROLE_TRADER &&
                  <View>
                    <View style={ProfileSettingScreenStyle.sendContainerViewStyle}>
                      <View style={ProfileSettingScreenStyle.sendContainerStyle}>
                        <Text style={ProfileSettingScreenStyle.labelStyle}>
                          Services offered and Skills
                      </Text>
                      </View>
                    </View>
                    {this.state.isEditable &&
                      <TextInput
                        style={[ProfileSettingScreenStyle.inputTextStyle, { borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR }]}
                        autoCapitalize="none"
                        placeholder={'Select services'}
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                        editable={this.state.isEditable}
                        onChangeText={(val) => {
                          console.log(val)
                          let arr = this.state.serviceCategories.filter(item => {
                            return ((item.name.toLowerCase()).match(val.toLowerCase()) && item)
                          })
                          this.setState({ serviceCategoriesBackUp: arr, serviceTag: val })
                        }}
                        value={this.state.serviceTag}
                      />
                    }
                    {this.state.isEditable && this.state.serviceCategoriesBackUp.length > 0 &&
                      <ScrollView keyboardShouldPersistTaps={'handled'} style={{ height: 350, marginBottom: 20, borderWidth: 1, borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR, borderRadius: 4 }}>
                        <FlatList
                          data={this.state.serviceCategoriesBackUp}
                          contentContainerStyle={{}}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity onPress={() => {
                                if (this.state.isEditable) {
                                  // let arr = this.state.serviceCategories
                                  // arr[index].isSelected = !item.isSelected
                                  // this.setState({ serviceCategories: arr, serviceTag: arr[index].name, isChanged: true })
                                  if (this.state.selectedServiceTags.includes(item._id)) {
                                    let arr = this.state.selectedServiceTags
                                    arr.splice(this.state.selectedServiceTags.indexOf(item._id), 1)
                                    this.setState({ selectedServiceTags: arr, isChanged: true })
                                  }
                                  else {
                                    let arr = this.state.selectedServiceTags
                                    arr.push(item._id)
                                    this.setState({ selectedServiceTags: arr, isChanged: true })
                                  }
                                }
                              }
                              } style={{ height: 30, justifyContent: 'center', borderBottomColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR, borderBottomWidth: 1, backgroundColor: this.state.selectedServiceTags.includes(item._id) ? Colors.LIGHT_SKY_BLUE : 'white', paddingLeft: 15 }}>
                                <Text style={{ fontSize: 15, color: Colors.GRAY_COLOR }}>{item.name}</Text>
                              </TouchableOpacity>
                            )
                          }} />
                      </ScrollView>
                    }
                    <FlatList
                      data={this.state.serviceCategories}
                      contentContainerStyle={{ marginBottom: 20, flexWrap: 'wrap', flexDirection: 'row' }}
                      renderItem={(item) => {
                        return (
                          // <View style={{ flexDirection: 'row', margin: 3 }}>
                          //   <TouchableOpacity onPress={() => {
                          //     if (this.state.isEditable) {
                          //       let arr = this.state.serviceCategories
                          //       arr[item.index].isSelected = !item.item.isSelected
                          //       this.setState({ serviceCategories: arr, isChanged: true })
                          //     }
                          //   }}
                          //     activeOpacity={1}>
                          //     <Image source={item.item.isSelected ? ImagePath.CHECK_BOX_ACTIVE : ImagePath.UNCHECK} />
                          //   </TouchableOpacity>
                          //   <View style={{ backgroundColor: 'transparent', margin: 5, textAlign: 'center' }}>
                          //     <Text>
                          //       {item.item.name}
                          //     </Text>
                          //   </View>
                          // </View>
                          <View>
                            {
                              this.state.selectedServiceTags.includes(item.item._id) &&
                              <View style={{ height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), paddingHorizontal: Matrics.ScaleValue(15), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue' }}>
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: Matrics.ScaleValue(12) }}>{item.item.name}
                                  {this.state.isEditable && <Text onPress={() => {
                                    let arr = this.state.selectedServiceTags
                                    arr.splice(this.state.selectedServiceTags.indexOf(item.item._id), 1)
                                    this.setState({ selectedServiceTags: arr, isChanged: true })
                                  }}>  X</Text>}</Text>
                              </View>
                            }
                          </View>
                        )
                      }}
                    ></FlatList>
                  </View>
                }
                <Text style={ProfileSettingScreenStyle.labelStyle}>
                  {Strings.ABOUT_OVERVIEW}
                </Text>
                <TextInput
                  style={ProfileSettingScreenStyle.inputDescriptionTextStyle}
                  multiline={true}
                  underlineColorAndroid={Colors.TRANSPARENT}
                  editable={this.state.isEditable}
                  value={this.props.updateUserImageReducer.aboutUser}
                  onChangeText={this.onAboutUserChange.bind(this)}
                />

                {/* value={userData ? userData.about_user : ''} */}
              </View>
            </View>
            <ActionSheet
              ref={o => (this.ActionSheet = o)}
              options={actionOptions}
              cancelButtonIndex={CANCEL_INDEX}
              destructiveButtonIndex={DESTRUCTIVE_INDEX}
              onPress={this.handlePress}
            />
          </ScrollView >
        </KeyboardAvoidingView>
        {
          this.state.isChanged && (
            <View style={ProfileSettingScreenStyle.bottomViewStyle}>
              <TouchableOpacity
                onPress={() => this.callUpdateUserDetails()}
                disabled={this.state.isDisabled}
              >
                <View
                  style={ProfileSettingScreenStyle.roundedBlueSaveButtonStyle}
                >
                  <Text style={ProfileSettingScreenStyle.saveButtonTextStyle}>
                    {Strings.SAVE_CHANGES}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
        {//23 Nov
          this.props.updateUserImageReducer.isLoading ? (
            <View style={CommonStyles.circles}>
              <Progress.CircleSnail
                color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
              />
            </View>
          ) : null
          //
        }
        {//23 Nov
          this.state.showLoader ? (
            <View style={CommonStyles.circles}>
              <Progress.CircleSnail
                color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
              />
            </View>
          ) : null
          //
        }
      </View >
    );
  }
}

function mapStateToProps(state) {

  return {
    updateUserImageReducer: state.updateUserImageReducer
  };
}

export default connect(
  mapStateToProps,
  {
    clearUserImageInfo,
    updateUserImage,
    getUserDetails,
    updateUserDetails,
    showLoading,
    showScreenLoading,
    phoneNumberChanged,

    suburbPostcodeChanged,
    businessNameChanged,
    abnNumberChanged,
    latitudeChanged,
    longitudeChanged,

    firstNameChanged,
    lastNameChanged,
    aboutUserChanged,
    resetState,
    cityNameChanged,
    zipCodeChanged,
    rateChanged,
    stateChanged,
    agencyChanged,
    clearUserInfo,
    getAllAgencyList,
    getAssociateWithAgency,
    clearAgencyList,
    clearAssociateAgency
  }
)(ProfileSettingScreen);