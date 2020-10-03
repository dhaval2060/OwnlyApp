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
  Modal,
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

class ApplySyncProfileScreenStepFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      tncModal: false,
      errorOnTextField: "",
      roleName: "",
      need_help_moving_service: false,
      agency_name: ""
    };
    
   }

  componentWillMount() {
    this.setState({
      propertyAddress: this.props.screenThreeDetails.propertyAddress
    });

    if (global.isEdit) {
      this.setState({
        need_help_moving_service:
          global.propertyDetail.need_help_moving_service,
        agency_name: global.propertyDetail.agency_name
      });
    } else {
      this.setState({
        agency_name: this.props.screenThreeDetails.agency_name
      });
    }
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
    let screenThreeDetails = this.props.screenThreeDetails;
    screenThreeDetails[
      "need_help_moving_service"
    ] = this.state.need_help_moving_service;
    Actions.ApplySyncProfileScreenStepFive({
      screenFourDetails: screenThreeDetails
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
    if (!this.state.tncModal) {
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
                  You are applying for the property
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

            {/* ============>>>>>>> Checkboxe Yes <<<<<<<================= */}
            <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "400" }}>
                  Need help moving house or connecting utilities?
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 4,
                  padding: 10,
                  backgroundColor: "white",
                  flex: 1
                }}
              >
                <View style={{ flex: 0.15, padding: 10 }}>
                  <CheckBox
                    label={""}
                    labelStyle={[
                      ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                      { padding: 10, fontSize: 14 }
                    ]}
                    checked={this.state.need_help_moving_service}
                    checkboxStyle={{borderWidth:0.5,borderColor:'grey', borderRadius:13}}
                    checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                    uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                    onChange={val => {
                      this.setState({ need_help_moving_service: true });
                    }}
                  />
                </View>
                <View style={{ flex: 0.9 }}>
                  <Text
                    style={[
                      ApplySyncProfileScreenStyle.labelStylem,
                      { fontSize: 18, fontWeight: "300" }
                    ]}
                  >
                    Yes! I want {this.state.agency_name} to contact me and I
                    agree with their
                    <Text
                      style={{ color: "#1ACFFF" }}
                      onPress={() => this.setState({ tncModal: true })}
                    >
                      {" "}
                      Terms & Conditions
                    </Text>
                  </Text>
                </View>
              </View>

              {/* ============>>>>>>> Checkboxe NO <<<<<<<================= */}
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 4,
                  padding: 10,
                  backgroundColor: "white",
                  flex: 1
                }}
              >
                <View style={{ flex: 0.15, padding: 10 }}>
                  <CheckBox
                    label={""}
                    labelStyle={[
                      ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                      { padding: 10, fontSize: 14 }
                    ]}
                    checked={!this.state.need_help_moving_service}
                    checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                    checkboxStyle={{borderWidth:0.5,borderColor:'grey', borderRadius:13}}
                    uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                    onChange={val => {
                      this.setState({ need_help_moving_service: false });
                    }}
                  />
                </View>
                <View style={{ flex: 0.9 }}>
                  <Text
                    style={[
                      ApplySyncProfileScreenStyle.labelStylem,
                      { fontSize: 18, fontWeight: "300" }
                    ]}
                  >
                    No, I don't need help with moving house or connecting
                    utilities
                  </Text>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
            <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
              <View
                style={
                  ApplySyncProfileScreenStyle.roundedTransparentDraftButtonStyle
                }
              >
                <Text style={ApplySyncProfileScreenStyle.draftButtonTextStyle}>
                  {Strings.SAVE_AS_DRAFT}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.callProceedToStepFive()}>
              <View
                style={
                  ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle
                }
              >
                <Text
                  style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}
                >
                  {Strings.PROCEED}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <Modal
          transparent={true}
          animationType={"none"}
          contentContainerStyle={{ flex: 1, backgroundColor: "red " }}
          visible={this.state.tncModal}
        >
          <View style={{ margin: 25, backgroundColor: Colors.WHITE, flex: 1 }}>
            <Text
              style={{ padding: 10, paddingLeft:20, fontSize:25 }}
              onPress={() => this.setState({ tncModal: false })}
            >
              x
            </Text>
         
            <ScrollView style={{ padding: 15 }}>
              <Text style={{ fontWeight: "600", padding: 10 }}>
                Terms and Conditions
              </Text>
              <Text style={{ fontSize: 14, padding: 10 }}>
                This is an OPTIONAL connection service to assist you to obtain
                energy and/or telecommunications services for your new
                residence. If you are a prospective tenant, your decision
                whether or not to use this service will not affect your rental
                application.
              </Text>
              <Text style={{ fontSize: 14, padding: 10 }}>
                PropertyComm.com.au’s service provider for connections services
                Connect Now Pty Ltd ABN 79 097 398 662 the “Connections
                Partner”) will assist realestate.com.au to provide this
                connection service to you. If you have ticked one of the boxes
                above, you consent to PropertyComm.com.au and its Connections
                Partner using your personal information provided by you in this
                form and your tenant application form (if applicable) in
                accordance with the Privacy Collection Statement below including
                using those details to contact you by phone, SMS and email in
                relation to the selected product(s). We do not charge a fee for
                use of our Connection services, but you will need to pay any
                fees or charges in accordance with any agreement you enter into
                with your new utility provider (e.g. any connection or
                disconnection fees or ongoing charges). You acknowledge that
                PropertyComm.com.au and its Connections Partner may receive
                commissions or fees from your selected retailer(s), that
                commissions or fees may be paid between PropertyComm.com.au and
                its Connections Partner, and that your real estate agent may
                receive commissions or fees from realestate.com.au or its
                Connections Partner, in each case for arranging provision of the
                requested services. The value of commissions or fees may vary
                from time to time and differ depending on which retailer is
                selected.
              </Text>
              <Text style={{ fontSize: 14, padding: 10 }}>
                You may prefer to obtain services under different terms and
                conditions, or from different retailers, to those offered by the
                Connections Partner. You acknowledge that if you select one of
                the services offered by the Connections Partner and the relevant
                retailer agrees to provide that service to you, then you will
                enter into a contract with that retailer for the provision of
                that service. Retailers retain discretion in relation to
                accepting your request for products or services - acceptance may
                be affected by factors such as a retailer’s credit criteria or
                ability to supply to your selected address. Connect Now Pty Ltd
                is part of the AGL Group. Except as otherwise expressly
                indicated PropertyComm.com.au and its Connections Partner do not
                guarantee the connection, or disconnection of any other services
                requested by you, or that any will be by your requested date.
                You agree that to the maximum extent permitted by law, other
                than as set out here, PropertyComm.com.au and its Connections
                Partner will have no liability to you for the provision of the
                service.
              </Text>
              <View style={{ height: 25 }} />
            </ScrollView>
          </View>
        </Modal>
      );
    }
  }
}
export default ApplySyncProfileScreenStepFour;
