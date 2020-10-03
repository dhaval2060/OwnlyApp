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
import DatePicker from "react-native-datepicker";
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
import moment from "moment";
let propertyType = [
  { value: "House" },
  { value: "Town house" },
  { value: "Unit" },
  { value: "Apartment" },
  { value: "Vila" },
  { value: "Land" }
];
let propertyCategory = [{ value: "Sale" }, { value: "Rental" }];
let leasYears = [
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
  { value: "7" },
  { value: "8" },
  { value: "9" },
  { value: "10" }
];
let leasMonths = [
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
  { value: "7" },
  { value: "8" },
  { value: "9" },
  { value: "10" },
  { value: "11" },
  { value: "12" }
];
class DisplayApplySyncProfileScreenStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyAdd: "",
      ownerData: [],
      errorMsg: "",
      errorOnTextField: "",
      isTypeAdreesManual: false,
      roleName: "",

      // applyCommenceDate: '',
      // applyLeaseYear: '',
      // applyLeaseMonth: '',
      // applyWeeklyRent: '',
      // applyMonthlyRent: '',
      // applyBond: '',
      // applyDescription: '',

      // applyPropertyAddress: '',
      // applyPropertyType: '',
      // applyTotalBedroom: '',
      // applyPropertyId: '',
      // applyAgencyName: '',
      // applyManagerName: '',
      // applyManagerEmail: '',

      propertyDetails: props.propertyDetail.propertyDetail,
      applyCommenceDate: props.propertyDetail.preferred_comm_date,
      applyLeaseYear: props.propertyDetail.preferred_length_of_lease_years,
      applyLeaseMonth: props.propertyDetail.preferred_length_of_lease_months,
      applyWeeklyRent: props.propertyDetail.weekly_rent,
      applyMonthlyRent: props.propertyDetail.monthly_rent,
      applyBond: props.propertyDetail.bond,
      applyDescription: props.propertyDetail.why_propery_is_right_for_u,

      applyPropertyAddress: props.propertyDetail.propertyDetail.address,
      applyPropertyType: props.propertyDetail.property_type,
      applyTotalBedroom: props.propertyDetail.number_bedroom,
      applyPropertyId: props.propertyDetail.property_id,
      applyAgencyName: props.propertyDetail.agency_name,
      applyManagerName: props.propertyDetail.property_manager_name,
      applyManagerEmail: props.propertyDetail.property_manager_email
    };
  }
  componentDidMount() {
    
  }
  callProceedToStepTwo() {
    let arr = [];
    
    if (this.state.propertyDetails && this.state.propertyDetails) {
      arr = this.state.propertyDetail;
      arr["propertyDetail"] = this.state.propertyDetails;
      
      Actions.DisplayApplySyncProfileScreenStepTwo({ propertyDetail: arr });
    }
  }

  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}

  componentWillUnmount() {}

  componentDidMount() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var postData = {
            applicationId: this.props.propertyDetail._id
          };
          var userData = JSON.parse(value);
          var authToken = userData.token;
          
          APICaller(
            "getpropertyApplicationByid",
            "POST",
            authToken,
            postData
          ).then(data => {
            
            if (data.code == 200) {
              this.setState({ propertyDetail: data.data });
              global.ApplicationStatus = data.data.status
            }
          },
          err=>{
            
          });
        }
      })
      .done();
  }

  closeAddProperty() {
    Actions.popTo("Dashboard");
  }
  callSaveAsDraft() {
    let propertyData = {
      applyCommenceDate: this.state.applyCommenceDate,
      applyLeaseYear: this.state.applyLeaseYear,
      applyLeaseMonth: this.state.applyLeaseMonth,
      applyWeeklyRent: this.state.applyWeeklyRent,
      applyMonthlyRent: this.state.applyMonthlyRent,
      applyBond: this.state.applyBond,
      applyDescription: this.state.applyDescription,

      applyPropertyAddress: this.state.applyPropertyAddress,
      applyPropertyType: this.state.applyPropertyType,
      applyTotalBedroom: this.state.applyTotalBedroom,
      applyPropertyId: this.state.applyPropertyId,
      applyAgencyName: this.state.applyAgencyName,
      applyManagerName: this.state.applyManagerName,
      applyManagerEmail: this.state.applyManagerEmail
    };
    
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

  onPropertyNameChange(text) {
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }

  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>
          Application Details
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
                  {this.state.applyPropertyAddress}
                </Text>
              </View>
            </View>
            <View style={ApplySyncProfileScreenStyle.headerContainer}>
              <View style={ApplySyncProfileScreenStyle.dotContainer}>
                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
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
                Property Details
              </Text>
            </View>
            <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Address
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyPropertyAddress}
                </Text>
              </View>
              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Type of Property
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyPropertyType}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                No of Bedrooms
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyTotalBedroom}
                </Text>
              </View>
              {/* <View style={[ApplySyncProfileScreenStyle.searchTextInputStyle, { justifyContent: 'center' }]}>
                                <Text>{this.state.applyTotalBedroom}</Text>
                            </View> */}

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Commencement Date
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {moment(this.state.applyCommenceDate).format("MMM Do YY")}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Lenght Of Lease
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyLeaseYear} Year(s){" "}
                  {this.state.applyLeaseMonth} Month(s)
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Weekly Rent
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  ${this.state.applyWeeklyRent}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Monthly Rent
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  ${this.state.applyMonthlyRent}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>Bond</Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  ${this.state.applyBond}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Why this property is right for you?
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyDescription}
                </Text>
              </View>
            </View>

            <View style={{ height: 25, backgroundColor: "#F8F9FE" }} />
            <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: Colors.SKY_BLUE_BUTTON_BACKGROUND,
                    fontWeight: "600"
                  }}
                >
                  Property Manager Details
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Agency Name
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyAgencyName}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Property Manager Name
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyManagerName}
                </Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                Property Manager Email Address
              </Text>
              <View style={{ marginTop: 10, marginBottom: 25 }}>
                <Text style={{ fontSize: 18, fontWeight: "300" }}>
                  {this.state.applyManagerEmail}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
          {/* <TouchableOpacity onPress={() => this.callProceedToStepTwo()}>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                    </TouchableOpacity> */}

         
          <TouchableOpacity onPress={() => this.callProceedToStepTwo()}>
            <View
              style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}
            >
              <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                {Strings.PROCEED}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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

export default DisplayApplySyncProfileScreenStepOne;
