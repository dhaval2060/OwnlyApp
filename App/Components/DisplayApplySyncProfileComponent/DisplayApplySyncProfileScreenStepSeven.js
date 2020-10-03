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
  AsyncStorage
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { Actions } from "react-native-router-flux";
import CommonStyles from "../../CommonStyle/CommonStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import ImagePath from "../../Constants/ImagesPath";
import ApplySyncProfileScreenStyle from "./ApplySyncProfileScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Progress from "react-native-progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import APICaller from "../../Saga/APICaller";

let propertyType = [
  { value: "House" },
  { value: "Town house" },
  { value: "Unit" },
  { value: "Apartment" },
  { value: "Vila" },
  { value: "Land" }
];

let propertyCategory = [{ value: "Sale" }, { value: "Rental" }];

class DisplayApplySyncProfileScreenStepSeven extends Component {
  constructor() {
    super();
    this.state = {
      propertyAdd: "",
      ownerData: [],
      errorMsg: "",
      errorOnTextField: "",
      isTypeAdreesManual: false,
      roleName: "",
      update: true,
      isApprove: false
    };
    
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentWillMount() {
    
    this.setState({
      propertyAddress: this.props.propertyDetail.propertyDetail.address,
      isApprove: this.props.propertyDetail.status
    });
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
  approveApplication(val) {
    
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var postData = {
            applicant_email_id: this.props.propertyDetail.created_by.email,
            applicationId: this.props.propertyDetail._id,
            firstname:
              this.props.propertyDetail.created_by.firstname +
              " " +
              this.props.propertyDetail.created_by.lastname,
            status: val
          };
          var userData = JSON.parse(value);
          var authToken = userData.token;
          
          APICaller(
            "updateapplicationStatus",
            "POST",
            authToken,
            postData
          ).then(data => {
            if (data.code == 200) {
              this.setState({ isApprove: val });
              
              global.ApplicationStatus = data.data[0].status;
              this.setState({ update: true });
              // Actions.popTo('Dashboard');
            }
          });
        }
      })
      .done();
  }

  onPropertyNameChange(text) {}

  onPropertyCountryChange(text) {}

  onPropertyTypeChange(text) {}

  onPropertyCategoryChange(text) {}

  onPropertyOwnerChange(text) {}

  onPropertyAddressChange(text) {}

  onPropertyDescChange(text) {}
  callGetPropertyOwner() {}

  onGetPropertyOwnerSuccess() {}

  preparePropertyOwnerDropdownData(ownerData) {
    var tempArray = ownerData;
    tempArray.map((data, index) => {
      tempArray[index].value =
        tempArray[index].firstname + " " + tempArray[index].lastname;
      tempArray[index].id = tempArray[index]._id;
    });
    
    return tempArray;
  }

  callAddOwnerScreen() {
    Actions.AddOwnerScreen();
  }

  callSavePropertyApi() {}

  onSavePropertySuccess() {}
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

  setAddressInputType() {}

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.navBar()}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            ApplySyncProfileScreenStyle.scrollViewContainerStyle
          }
        >
          <View>
            <View
              style={{
                backgroundColor: "white",
                shadowColor: "#000",
                borderBottomColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
                borderBottomWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View>
                <Text style={{ color: "#d1d1d1", padding: 5, fontSize: 16 }}>
                  Applicant applying for the property
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: "600", fontSize: 17 }}>
                  {this.state.propertyAddress}
                </Text>
              </View>
            </View>
            <View style={ApplySyncProfileScreenStyle.headerContainer}>
              <View style={ApplySyncProfileScreenStyle.dotContainer}>
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F8F9FE",
                paddingBottom: 30
              }}
            >
              <Text style={{ color: "black", fontSize: 25, fontWeight: "300" }}>
                Approve Application
              </Text>
            </View>
            
            {this.state.update && (
              <View>
                {global.ApplicationStatus == 0 ? (
                  <View
                    style={[
                      ApplySyncProfileScreenStyle.addPropertyInputContainer,
                      { paddingTop: 80 }
                    ]}
                  >
                    <View
                      style={[ApplySyncProfileScreenStyle.buttonContainerStyle]}
                    >
                      <TouchableOpacity
                        onPress={() => this.approveApplication("2")}
                      >
                        <View
                          style={
                            ApplySyncProfileScreenStyle.roundedTransparentDraftButtonStyle
                          }
                        >
                          <Text
                            style={
                              ApplySyncProfileScreenStyle.draftButtonTextStyle
                            }
                          >
                            Decline
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.approveApplication("1")}
                      >
                        <View
                          style={
                            ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle
                          }
                        >
                          <Text
                            style={
                              ApplySyncProfileScreenStyle.proceedButtonTextStyle
                            }
                          >
                            Approve Application
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    {global.ApplicationStatus == 1 ? (
                      <View
                        style={[
                          ApplySyncProfileScreenStyle.addPropertyInputContainer,
                          { paddingTop: 80 }
                        ]}
                      >
                        <View
                          style={[
                            ApplySyncProfileScreenStyle.buttonContainerStyle
                          ]}
                        >
                          {/* <TouchableOpacity onPress={() => this.callProceedToStepFinal()}> */}
                          <View
                            style={
                              ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle
                            }
                          >
                            <Text
                              style={
                                ApplySyncProfileScreenStyle.proceedButtonTextStyle
                              }
                            >
                              Application Approved
                            </Text>
                          </View>
                          {/* </TouchableOpacity> */}
                        </View>
                      </View>
                    ) : (
                      <View
                        style={[
                          ApplySyncProfileScreenStyle.addPropertyInputContainer,
                          { paddingTop: 80 }
                        ]}
                      >
                        <View
                          style={[
                            ApplySyncProfileScreenStyle.buttonContainerStyle
                          ]}
                        >
                          {/* <TouchableOpacity onPress={() => this.callProceedToStepFinal()}> */}
                          <View
                            style={
                              ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle
                            }
                          >
                            <Text
                              style={
                                ApplySyncProfileScreenStyle.proceedButtonTextStyle
                              }
                            >
                              Application Declined
                            </Text>
                          </View>
                          {/* </TouchableOpacity> */}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        {/* <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                        <View style={ApplySyncProfileScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callProceedToStepFinal()}>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PUBLISH}
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View> */}

        {false ? (
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
    addPropertyReducer: state.addPropertyReducer
  };
}

export default DisplayApplySyncProfileScreenStepSeven;
