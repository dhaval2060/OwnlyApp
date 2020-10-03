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
var ImagePicker = require("react-native-image-picker");
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
var options = {
  title: "Select Property Image",
  quality: 1,
  customButtons: [{ name: "Ownly", title: "Choose Photo" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};
let spinerData = [
  { value: "Select Value" },
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
let relationData = [
  { value: "0", title: "Spouse" },
  { value: "1", title: "Son" },
  { value: "2", title: "Daughter" },
  { value: "3", title: "Father" },
  { value: "4", title: "Mother" },
  { value: "5", title: "Grand Father" },
  { value: "6", title: "Grand Mother" }
];
var uploadImagesArray = [];
let contextRef;
class DisplayApplySyncProfileScreenStepTwo extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      uploadImagesData: {},
      selectedImage: "",
      errorMsg: "",
      errorOnTextField: "",
      propertyAddress: props.propertyDetail.propertyDetail.address,

      vehicleCount: props.propertyDetail.vehicles.length,
      PetCount: props.propertyDetail.pets.length,
      personCount: props.propertyDetail.members.length,

      applyPrimaryApplicant:
        props.propertyDetail.created_by.firstname +
        " " +
        props.propertyDetail.created_by.lastname,

      vehicles: props.propertyDetail.vehicles,
      pets: props.propertyDetail.pets,
      members: props.propertyDetail.members,

      showDropDown: "",
      showPetDropDrown: "",

      memberValidate: false,
      vehiclesValidate: false,
      petValidate: false
    };
    contextRef = this;
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {}
  componentDidMount() {
    
    // this.setState({
    //     personCount: this.props.propertyDetail.members.length,
    //     vehicleCount: this.props.propertyDetail.vehicles.length,
    //     PetCount: this.props.propertyDetail.pets.length,
    //     members: this.props.propertyDetail.members,
    //     pets: this.props.propertyDetail.pets,
    //     vehicles: this.props.propertyDetail.vehicles
    // })
  }
  componentWillUnmount() {}

  closeAddProperty() {
    Actions.popTo("Dashboard");
  }

  callBack() {
    Actions.pop();
  }

  callProceedToStepThree() {
    Actions.DisplayApplySyncProfileScreenStepThree({
      propertyDetail: this.props.propertyDetail
    });
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

        if (uploadImagesArray.length == 1) {
          this.uploadImageListSelection(0);
        }
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
            }
          })
          .done();
      }
    });
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

  callSavePropertyApi() {}

  validateMemebers() {
    if (this.state.members.length > 0) {
      for (let index = 0; index < this.state.members.length; index++) {
        
        const element = this.state.members[index];
        if (element.name == "") {
          this.setState({
            errorOnTextField: index + "name",
            errorMsg: "Name is required"
          });
          return false;
        } else if (element.age == "") {
          this.setState({
            errorOnTextField: index + "age",
            errorMsg: "Age is required"
          });
          return false;
        } else if (element.relationship == undefined) {
          this.setState({
            errorOnTextField: index + "relationship",
            errorMsg: "Relationship is required"
          });
          return false;
        } else if (element.email == "") {
          this.setState({
            errorOnTextField: index + "email",
            errorMsg: "Email is required"
          });
          return false;
        } else if (element.mobile_number == "") {
          this.setState({
            errorOnTextField: index + "mobile_number",
            errorMsg: "Mobile Number is required"
          });
          return false;
        } else if (index == this.state.members.length - 1) {
          
          return true;
        }
      }
    } else {
      // this.setState({ errorOnTextField: 1, errorMsg: 'Please select number of persons' })
      return true;
    }
  }
  validateVehicles() {
    if (this.state.vehicles.length > 0) {
      for (let index = 0; index < this.state.vehicles.length; index++) {
        const element = this.state.vehicles[index];
        if (element.type == undefined) {
          this.setState({
            errorOnTextField: index + "type",
            errorMsg: "Vehicle Type is required"
          });
          return false;
        } else if (element.registration == "") {
          this.setState({
            errorOnTextField: index + "registration",
            errorMsg: "Registration is required"
          });
          return false;
        } else if (element.make_model == "") {
          this.setState({
            errorOnTextField: index + "make_model",
            errorMsg: "Make / Modal is required"
          });
          return false;
        } else if (index == this.state.vehicles.length - 1) {
          
          return true;
        }
      }
    } else {
      return true;
    }
  }
  validatePets() {
    if (this.state.pets.length > 0) {
      
      for (let index = 0; index < this.state.pets.length; index++) {
        const element = this.state.pets[index];
        
        if (element.typeVal == undefined) {
          this.setState({
            errorOnTextField: index + "petType",
            errorMsg: "Pet Type is required"
          });
          return false;
        } else if (element.breed == "") {
          this.setState({
            errorOnTextField: index + "breed",
            errorMsg: "Type / Breed is required"
          });
          return false;
        } else if (element.registration_number == "") {
          this.setState({
            errorOnTextField: index + "registration_number",
            errorMsg: "Council Registration No is required"
          });
          return false;
        } else if (index == this.state.pets.length - 1) {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  callSaveAsDraft() {}

  async setVehicle(val, valIndex, index) {
    let arr = this.state.vehicles;
    arr[index]["typeVal"] = val;
    arr[index]["type"] = valIndex;
    await this.setState({ showDropDown: "", vehicles: arr, errorMsg: "" });
  }
  renderVehicleItem = data => {
    if (this.state.vehicles[data.index]) {
      return (
        <View>
          <View style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>
              Vehicle {data.item.id}
            </Text>
          </View>
          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Vehicle Type
          </Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center", paddingLeft: 10 }
            ]}
          >
            {this.state.vehicles[data.index].type == 0 && (
              <Text>Convertible</Text>
            )}
            {this.state.vehicles[data.index].type == 1 && (
              <Text>Crossover</Text>
            )}
            {this.state.vehicles[data.index].type == 2 && (
              <Text>Hatchback</Text>
            )}
            {this.state.vehicles[data.index].type == 3 && <Text>Sedan</Text>}
            {this.state.vehicles[data.index].type == 4 && <Text>SUV</Text>}
            {this.state.vehicles[data.index].type == 5 && <Text>Other</Text>}
          </View>
          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Registration
          </Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            <Text>{this.state.vehicles[data.index]["registration"]}</Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Make/Model</Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            <Text>{this.state.vehicles[data.index]["make_model"]}</Text>
          </View>
        </View>
      );
    }
  };
  // setPet(val, index) {
  //     let arr = this.state.pets;
  //     arr[index] = val
  //     this.setState({ showPetDropDrown: '', pets: arr })
  // }
  async setPet(valIndex, val, index) {
    let arr = this.state.pets;
    arr[index]["typeVal"] = val;
    arr[index]["type"] = valIndex;
    await this.setState({ showPetDropDrown: "", pets: arr, errorMsg: "" });
  }
  async setRelation(valIndex, text, index) {
    let arr = this.state.members;
    arr[index]["typeVal"] = text;
    arr[index]["type"] = valIndex;
    arr[index]["relationship"] = valIndex;
    await this.setState({
      showRelationshipDropDrown: "",
      members: arr,
      errorMsg: ""
    });
  }

  renderPetItem = data => {
    if (this.state.pets[data.index]) {
      return (
        <View>
          <View style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>
              Pet {data.item.id}
            </Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Type</Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center", paddingLeft: 10 }
            ]}
          >
            {this.state.pets[data.index].type == 0 && <Text>Amphibians</Text>}
            {this.state.pets[data.index].type == 1 && <Text>Bird</Text>}
            {this.state.pets[data.index].type == 2 && <Text>Cat</Text>}
            {this.state.pets[data.index].type == 3 && <Text>Dog</Text>}
            {this.state.pets[data.index].type == 4 && <Text>Fish</Text>}
            {this.state.pets[data.index].type == 5 && <Text>Horse</Text>}
            {this.state.pets[data.index].type == 6 && <Text>Reptile</Text>}
            {this.state.pets[data.index].type == 7 && <Text>Small Rodent</Text>}
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Type / Breed
          </Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center", paddingLeft: 10 }
            ]}
          >
            <Text>{this.state.pets[data.index]["breed"]}</Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Council Registration No.
          </Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center", paddingLeft: 10 }
            ]}
          >
            <Text>{this.state.pets[data.index]["registration_number"]}</Text>
          </View>
        </View>
      );
    }
  };
  renderVehicles(count) {
    vehicles = [];
    for (let index = 0; index < count; index++) {
      vehicles.push({ id: index + 1 });
    }
    return (
      <FlatList
        data={vehicles}
        extraData={this.state}
        removeClippedSubviews={false}
        renderItem={this.renderVehicleItem}
      />
    );
  }

  renderPets(count) {
    pets = [];
    for (let index = 0; index < count; index++) {
      pets.push({ id: index + 1 });
    }
    return (
      <FlatList
        data={pets}
        extraData={this.state}
        removeClippedSubviews={false}
        renderItem={this.renderPetItem}
      />
    );
  }
  renderPersons(count) {
    persons = [];
    for (let index = 0; index < count; index++) {
      persons.push({ id: index });
    }

    return (
      <FlatList
        data={persons}
        extraData={this.state}
        removeClippedSubviews={false}
        renderItem={this.renderPersonItem}
      />
    );
  }
  renderPersonItem = data => {
    
    if (this.state.members[data.index]) {
      return (
        <View>
          <View style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>
              Person {data.item.id + 1}
            </Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Name</Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            <Text>{this.state.members[data.index]["name"]}</Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Age</Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            <Text>{this.state.members[data.index]["age"]}</Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Relationship
          </Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            {this.state.members[data.index]["relationship"] == 0 && (
              <Text>Spouse</Text>
            )}
            {this.state.members[data.index]["relationship"] == 1 && (
              <Text>Son</Text>
            )}
            {this.state.members[data.index]["relationship"] == 2 && (
              <Text>Daughter</Text>
            )}
            {this.state.members[data.index]["relationship"] == 3 && (
              <Text>Father</Text>
            )}
            {this.state.members[data.index]["relationship"] == 4 && (
              <Text>Mother</Text>
            )}
            {this.state.members[data.index]["relationship"] == 5 && (
              <Text>Grand Father</Text>
            )}
            {this.state.members[data.index]["relationship"] == 6 && (
              <Text>Grand Mother</Text>
            )}
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Will this occupant be on the lease?
          </Text>
          {this.state.members[data.index] != undefined && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={this.state.members[data.index].be_on_lease}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                // onChange={(val) => {
                //     var arr = this.state.members
                //     arr[data.index]['be_on_lease'] = true
                //     this.setState({ members: arr, errorMsg: '' })
                // }}
              />
              <CheckBox
                label={"No"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={!this.state.members[data.index].be_on_lease}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                // onChange={(val) => {
                //     var arr = this.state.members
                //     arr[data.index]['be_on_lease'] = false
                //     this.setState({ members: arr, errorMsg: '' })
                // }}
              />
            </View>
          )}
          {this.state.errorMsg != "" &&
          this.state.errorOnTextField == data.index + "be_on_lease" ? (
            <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
          ) : null}

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Email</Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            <Text>{this.state.members[data.index]["email"]}</Text>
          </View>

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Mobile/All Day Contact
          </Text>
          <View
            style={[
              ApplySyncProfileScreenStyle.inputTextStyle,
              { paddingLeft: 10, justifyContent: "center" }
            ]}
          >
            <Text>{this.state.members[data.index]["mobile_number"]}</Text>
          </View>

          <Text
            style={{
              marginTop: 25,
              fontWeight: "300",
              fontSize: 15,
              lineHeight: 25,
              flexWrap: "wrap"
            }}
          >
            This occupant has not applied yet, If they have please check the
            information provided is correct as they will be emailed their part
            of the application to complete.
          </Text>
        </View>
      );
    }
  };
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
              Occupancy
            </Text>
          </View>
          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <View style={{ paddingBottom: 15, paddingTop: 15 }}>
              <Text style={{ color: "black", fontSize: 25, fontWeight: "300" }}>
                Occupants
              </Text>
            </View>

            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Primary Applicant
            </Text>
            <Text
              style={{
                color: "#1ACFFF",
                fontSize: 16,
                paddingBottom: 25,
                fontWeight: "600"
              }}
            >
              {this.state.applyPrimaryApplicant}
            </Text>

            {/* =================== Form Started ======================== */}

            {/* =================== Persons ======================== */}
            
            {this.state.personCount > 0 ? (
              <View>
                <View
                  style={[
                    ApplySyncProfileScreenStyle.dropDownViewStyle,
                    { justifyContent: "center", paddingLeft: 10 }
                  ]}
                >
                  <Text>{this.state.personCount}</Text>
                </View>

                {this.renderPersons(this.state.personCount)}
              </View>
            ) : null}
          </View>

          <View style={{ height: 25, backgroundColor: "#F8F9FE" }} />

          {/* =================== Vehicles ======================== */}

          {this.state.vehicleCount > 0 && (
            <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: "300" }}>
                  Vehicles
                </Text>
              </View>
              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                How many vehicles will be parked at the property
              </Text>

              <View
                style={[
                  ApplySyncProfileScreenStyle.dropDownViewStyle,
                  { justifyContent: "center", paddingLeft: 10 }
                ]}
              >
                <Text>{this.state.vehicleCount}</Text>
              </View>
              {this.renderVehicles(this.state.vehicleCount)}
            </View>
          )}

          <View style={{ height: 25, backgroundColor: "#F8F9FE" }} />

          {/* =================== Pets ======================== */}

          {this.state.PetCount > 0 && (
            <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
              <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: "300" }}>Pets</Text>
              </View>

              <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                No. Of Pets
              </Text>

              <View
                style={[
                  ApplySyncProfileScreenStyle.dropDownViewStyle,
                  { justifyContent: "center", paddingLeft: 10 }
                ]}
              >
                <Text>{this.state.PetCount}</Text>
              </View>

              {this.renderPets(this.state.PetCount)}
            </View>
          )}
        </KeyboardAwareScrollView>

        {/* =================== Buttons ======================== */}
        <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
          
          <TouchableOpacity onPress={() => this.callProceedToStepThree()}>
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

export default DisplayApplySyncProfileScreenStepTwo;
