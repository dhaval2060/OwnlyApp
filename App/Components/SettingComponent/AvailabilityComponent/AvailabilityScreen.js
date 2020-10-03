import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage
} from "react-native";


import CheckBox from "react-native-checkbox";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import { showLoading, resetState } from "../ProfileSettingComponent/UpdateImageAction";

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import ApplySyncProfileScreenStyle from "./AvailabilityScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Progress from "react-native-progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import APICaller, { documentUpload } from "../../../Saga/APICaller";

let propertyType = [
  { value: "House" },
  { value: "Town house" },
  { value: "Unit" },
  { value: "Apartment" },
  { value: "Vila" },
  { value: "Land" }
];

let propertyCategory = [{ value: "Sale" }, { value: "Rental" }];

class AvailabilityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      propertyAddress: "",
      option: undefined,
      status: undefined,
      days: [],
      errorOnTextField: "",
      document_id: [],
      documentation_status: false,
      uploadedDocumentDetails: []
    };
    
  }


  componentWillMount() {
    this.getUserDetails();
    this.getUploadedIdentificationDocument();
  }
  getUserDetails() {
    this.props.showLoading();

    AsyncStorage.getItem("roleId")
      .then(roleId => {
        if (roleId) {
          AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
              if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                postData = {
                  roleId: roleId,
                  userId: userData.data._id
                };
                
                
                APICaller("getUserDetails", "POST", authToken, postData).then(
                  data => {
                    
                    this.props.resetState();

                    if (data.code == 200) {
                      this.setState({
                        days: data.data.availability.days,
                        option: data.data.availability.option,
                        status: data.data.availability.status
                      });
                    }
                  }
                );
              }
            })
            .done();
        }
      })
      .done();
  }
  closeAddProperty() {
    Actions.popTo("Dashboard");
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
  callProceedToStepSix() {
    let screenFourDetails = this.props.screenFourDetails;
    screenFourDetails["documentation_status"] = this.state.documentation_status;

    let arr = [];
    if (this.state.documentation_status) {
      screenFourDetails["document_id"] = [];
    } else {
      this.state.uploadedDocumentDetails.forEach(element => {
        arr.push(element._id);
      });
      screenFourDetails["document_id"] = arr;
      screenFourDetails[
        "uploadedDocumentDetails"
      ] = this.state.uploadedDocumentDetails;
    }

    Actions.ApplySyncProfileScreenStepSix({
      screenFiveDetails: screenFourDetails
    });
  }

  callSavePropertyApi() {}

  callBack() {
    Actions.pop();
  }
  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>Apply with Ownly</Text>
        <TouchableOpacity
          onPress={() => this.callBack()}
          style={CommonStyles.navBackRightImageView}
        >
          <View>
            <Image source={ImagePath.HEADER_BACK} />
          </View>
        </TouchableOpacity>

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

  callSaveAsDraft() {
    this.callSavePropertyApi();
  }
  getUploadedIdentificationDocument() {
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        var postBody = {
          created_by: userData.data._id
        };
        
        APICaller(
          "getUploadedIdentificationDocument",
          "POST",
          authToken,
          postBody
        ).then(data => {
          
          if (data.code == 200) {
            this.setState({ uploadedDocumentDetails: data.data });
          }
        });
      }
    });
  }
  saveData() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          postData = {
            user_id: userData.data._id,
            option: this.state.option,
            status: this.state.status,
            days: this.state.days
          };
          
          APICaller("updateAvailability", "POST", authToken, postData).then(
            data => {
              
              if (data.code == 200) {
                alert(data.message);
              }
            }
          );
        }
      })
      .done();
  }
  openFileChooser() {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        // Android
        
       
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var postBody = {
                created_by: userData.data._id,
                file: res.uri
              };

              const file = {
                uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: res.fileName, // e.g. 'image123.jpg',
                type: res.type // e.g. 'image/jpg'
              };
              const body = new FormData();
              body.append("file", file);
              body.append("created_by", userData.data._id);
              documentUpload(
                "uploadIdentificationDocumentsFiles",
                authToken,
                body,
                userData.data._id
              ).then(data => {
                
                if (data.code == 200) {
                  var arr = this.state.document_id;
                  this.getUploadedIdentificationDocument();
                  this.setState({ document_id: arr });
                }
              });
            }
          })
          .done();
      }
    );
  }
  async removeDay(val) {
    let arr = [];
    await this.state.days.forEach(element => {
      if (element == val) {
      } else {
        arr.push(element);
      }
    });
    await this.setState({ days: arr });
  }
  async setDays(val) {
    
    var arr = [];
    let flag = false;
    arr = this.state.days;
    if (arr.length == 0) {
      await arr.push(val);
    }
    await arr.forEach(element => {
      if (element == val) {
        flag = true;
      }
    });
    if (!flag) {
      await arr.push(val);
    }
    this.setState({ days: arr });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            ApplySyncProfileScreenStyle.scrollViewContainerStyle
          }
        >
          {/* ============>>>>>>> Checkboxe Yes <<<<<<<================= */}
          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <Text style={{ fontSize: 22, fontWeight: "300" }}>
              Availability
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              Are you available to take on new work? Knowing when you are
              available helps Ownly find the right jobs for you.
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              I'm currently
            </Text>
            <View style={{ flexDirection: "row", margin: 10 }}>
              <TouchableOpacity
                onPress={() => this.setState({ status: 1 })}
                style={[
                  {
                    padding: 15,
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    borderWidth: 0.3,
                    borderColor: "#aaa"
                  },
                  this.state.status == 1
                    ? {
                        backgroundColor: Colors.BOTTOM_NEXT_BUTTON_SELECTED_VIEW
                      }
                    : { backgroundColor: Colors.WHITE }
                ]}
              >
                <Text
                  style={
                    this.state.status == 1
                      ? { color: Colors.WHITE }
                      : { color: Colors.BLACK }
                  }
                >
                  Available
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ status: 2 })}
                style={[
                  {
                    padding: 15,
                    borderBottomRightRadius: 20,
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderTopRightRadius: 20,
                    borderWidth: 1,
                    borderColor: "#aaa"
                  },
                  this.state.status == 2
                    ? {
                        backgroundColor: Colors.BOTTOM_NEXT_BUTTON_SELECTED_VIEW
                      }
                    : { backgroundColor: Colors.WHITE }
                ]}
              >
                <Text
                  style={
                    this.state.status == 2
                      ? { color: Colors.WHITE }
                      : { color: Colors.BLACK }
                  }
                >
                  Not Available
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 15 }}>
              <CheckBox
                label={"7 days a week"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={this.state.option == 0}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                onChange={val => {
                  this.setState({ option: 0 });
                }}
              />

              <CheckBox
                label={"Weekdays only"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={this.state.option == 1}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                onChange={val => this.setState({ option: 1 })}
              />
              <CheckBox
                label={"Weekends only"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={this.state.option == 2}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                onChange={val => this.setState({ option: 2 })}
              />
              <CheckBox
                label={"Every day except"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={this.state.option == 3}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                onChange={val => this.setState({ option: 3 })}
              />
              {this.state.option == 3 && (
                <View>
                  <View style={{ margin: 10 }}>
                    <FlatList
                      data={this.state.days}
                      horizontal={true}
                      extraData={this.state}
                      renderItem={item => {
                        return (
                          <View>
                            {item.item == 0 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Sunday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("0")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {item.item == 1 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Monday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("1")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {item.item == 2 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Tuesday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("2")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {item.item == 3 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Wednesday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("3")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {item.item == 4 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Thursday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("4")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {item.item == 5 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Firday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("5")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                            {item.item == 6 && (
                              <View
                                style={{
                                  padding: 5,
                                  flexDirection: "row",
                                  borderColor: "#aaa",
                                  borderWidth: 1
                                }}
                              >
                                <Text>Saturday </Text>
                                <TouchableOpacity
                                  onPress={() => this.removeDay("6")}
                                >
                                  <Text>X</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setDays("0")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Sunday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setDays("1")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Monday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setDays("2")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Tuesday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setDays("3")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Wednesday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setDays("4")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Thursday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setDays("5")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Firday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setDays("6")}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      margin: 5,
                      borderColor: "#eee",
                      borderWidth: 1
                    }}
                  >
                    <Text>Saturday</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={{ backgroundColor: "white", width: "100%" }}>
            <View
              style={{
                height: 70,
                backgroundColor: Colors.WHITE,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity onPress={() => this.saveData()}>
                <View
                  style={
                    ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle
                  }
                >
                  <Text
                    style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}
                  >
                    {Strings.SAVE_CHANGES}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
    
    return {
        updateUserImageReducer: state.updateUserImageReducer
    }
}

export default connect(
  mapStateToProps,
  {
    showLoading,
    resetState
  }
)(AvailabilityScreen);
