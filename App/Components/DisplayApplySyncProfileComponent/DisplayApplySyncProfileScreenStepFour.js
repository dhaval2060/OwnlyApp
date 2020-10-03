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

import CheckBox from "react-native-checkbox";

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

let propertyType = [
  { value: "House" },
  { value: "Town house" },
  { value: "Unit" },
  { value: "Apartment" },
  { value: "Vila" },
  { value: "Land" }
];

let propertyCategory = [{ value: "Sale" }, { value: "Rental" }];

class DisplayApplySyncProfileScreenStepFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      errorOnTextField: "",
      roleName: "",
      propertyAddress: "",
      need_help_moving_service: false,
      agency_name: ""
    }; 
  }

  componentWillMount() {
    this.setState({
      propertyAddress: this.props.propertyDetail.propertyDetail.address
    });

    this.setState({
      need_help_moving_service: this.props.propertyDetail
        .need_help_moving_service,
      agency_name: this.props.propertyDetail.agency_name
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
  callProceedToStepFive() {
    
    Actions.DisplayApplySyncProfileScreenStepFive({
      propertyDetail: this.props.propertyDetail
    });
  }

  callAddOwnerScreen() {
    Actions.AddOwnerScreen();
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
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
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
              Moving Services
            </Text>
          </View>

          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "400" }}>
                Need help moving house or connecting utilities?
              </Text>
            </View>

            {/* ============>>>>>>> Checkboxe Yes <<<<<<<================= */}
            {this.state.need_help_moving_service ? (
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 4,
                  padding: 10,
                  backgroundColor: "white",
                  flex: 1
                }}
              >
                <View style={{ flex: 0.15, padding: 10, justifyContent:'center', alignItems:'center' }}>
                  <CheckBox
                    label={''}
                    checked={this.state.need_help_moving_service}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                  />
                </View>
                <View style={{ flex: 0.9, justifyContent:'center', alignItems:'center' }}>
                  <Text
                    style={[
                      ApplySyncProfileScreenStyle.labelStylem,
                      { fontSize: 18, lineHeight: 18, fontWeight: "300" }
                    ]}
                  >
                    Yes, Tenant wants now and agree with Terms & Conditions.
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 4,
                  padding: 10,
                  backgroundColor: "white",
                  flex: 1
                }}
              >
                <View style={{ flex: 0.15, padding: 10 , justifyContent:'center', alignItems:'center'}}>
                  <CheckBox
                    label={''}
                    checked={!this.state.need_help_moving_service}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                  />
                </View>
                <View style={{ flex: 0.9, justifyContent:'center',alignItems:'center' }}>
                  <Text
                    style={[
                      ApplySyncProfileScreenStyle.labelStylem,
                      { fontSize: 18, fontWeight: "300" }
                    ]}
                  >
                    No, Tenant don't need help with moving house or connecting
                    utilities
                  </Text>
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>

        <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
     
     
          <TouchableOpacity onPress={() => this.callProceedToStepFive()}>
            <View
              style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}
            >
              <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                {Strings.PROCEED}
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
    addPropertyReducer: state.addPropertyReducer
  };
}

export default DisplayApplySyncProfileScreenStepFour;
