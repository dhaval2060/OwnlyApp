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
let years = [
  { value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 },
  { value: 10 }, { value: 11 }, { value: 12 }, { value: 13 }, { value: 14 }, { value: 15 }, { value: 16 }, { value: 17 }, { value: 18 }, { value: 19 },
  { value: 20 }, { value: 21 }, { value: 22 }, { value: 23 }, { value: 24 }, { value: 25 }, { value: 26 }, { value: 27 }, { value: 28 }, { value: 29 },
  { value: 30 }, { value: 31 }, { value: 32 }, { value: 33 }, { value: 34 }, { value: 35 }, { value: 36 }, { value: 37 }, { value: 38 }, { value: 39 },
  { value: 40 }, { value: 41 }, { value: 42 }, { value: 43 }, { value: 44 }, { value: 45 }, { value: 46 }, { value: 47 }, { value: 48 }, { value: 49 },
  { value: 50 }, { value: 51 }, { value: 52 }, { value: 53 }, { value: 54 }, { value: 55 }, { value: 56 }, { value: 57 }, { value: 58 }, { value: 59 },
  { value: 60 }, { value: 61 }, { value: 62 }, { value: 63 }, { value: 64 }, { value: 65 }, { value: 66 }, { value: 67 }, { value: 68 }, { value: 69 },
  { value: 70 }, { value: 71 }, { value: 72 }, { value: 73 }, { value: 74 }, { value: 75 }, { value: 76 }, { value: 77 }, { value: 78 }, { value: 79 },
  { value: 80 }, { value: 81 }, { value: 82 }, { value: 83 }, { value: 84 }, { value: 85 }, { value: 86 }, { value: 87 }, { value: 88 }, { value: 89 },
  { value: 90 }, { value: 91 }, { value: 92 }, { value: 93 }, { value: 94 }, { value: 95 }, { value: 96 }, { value: 97 }, { value: 98 }, { value: 99 }, { value: 100 }
]
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
var uploadImagesArray = [];
let contextRef;
class ApplySyncProfileScreenStepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadImagesData: {},
      selectedImage: "",
      errorMsg: "",
      errorOnTextField: "",
      propertyAddress: "",

      vehicleCount: "",
      PetCount: "",
      personCount: "",

      applyPrimaryApplicant: "",

      vehicles: [],
      pets: [],
      members: [],

      showDropDown: "",
      showPetDropDrown: "",

      memberValidate: false,
      vehiclesValidate: false,
      petValidate: false
    };
    contextRef = this;

    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          
          this.setState({
            propertyAddress: props.screenOneDetails.propertyAddress,
            applyPrimaryApplicant:
              userData.data.firstname + " " + userData.data.lastname
          });
          if (
            props.screenOneDetails.propertyDetail.members != [] ||
            props.screenOneDetails.propertyDetail.members != null
          ) {
            // this.setState({ personCount: props.screenOneDetails.propertyDetail.members.length, members: props.screenOneDetails.propertyDetail.members.length })
          }
        }
      })
      .done();
  }

  componentWillReceiveProps(nextProps) { }

  componentDidUpdate() { }
  componentDidMount() {
    
    if (global.isEdit) {
      this.setState({
        personCount: global.propertyDetail.members.length,
        vehicleCount: global.propertyDetail.vehicles.length,
        PetCount: global.propertyDetail.pets.length,
        members: global.propertyDetail.members,
        pets: global.propertyDetail.pets,
        vehicles: global.propertyDetail.vehicles
      });
    }
    else {
      this.setState({
        personCount: this.props.screenOneDetails.applicantData.members ? this.props.screenOneDetails.applicantData.members.length : 0,
        vehicleCount: this.props.screenOneDetails.applicantData.vehicles ? this.props.screenOneDetails.applicantData.vehicles.length : 0,
        PetCount: this.props.screenOneDetails.applicantData.pets ? this.props.screenOneDetails.applicantData.pets.length : 0,
        members: this.props.screenOneDetails.applicantData.members ? this.props.screenOneDetails.applicantData.members : [],
        pets: this.props.screenOneDetails.applicantData.pets ? this.props.screenOneDetails.applicantData.pets : [],
        vehicles: this.props.screenOneDetails.applicantData.vehicles ? this.props.screenOneDetails.applicantData.vehicles : []
      });
    }
  }
  componentWillUnmount() { }

  closeAddProperty() {
    Actions.popTo("Dashboard");
  }

  callBack() {
    Actions.pop();
  }

  callProceedToStepThree() {
    var validMembers = this.validateMemebers();
    if (validMembers) {
      var validVehicles = this.validateVehicles();
      if (validVehicles) {
        var validPets = this.validatePets();
        if (validPets) {
          let screenOneDetails = this.props.screenOneDetails;
          (screenOneDetails["members"] = this.state.members),
            (screenOneDetails["vehicles"] = this.state.vehicles),
            (screenOneDetails["pets"] = this.state.pets),
            Actions.ApplySyncProfileScreenStepThree({
              screenTwoDetails: screenOneDetails
            });
        }
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

  callSavePropertyApi() { }

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
        } else if (element.age == null) {
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
        if (element.type == undefined) {
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
  callSaveAsDraft() { }

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
          <TouchableOpacity
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center" }
            ]}
            onPress={() => {
              if (this.state.showDropDown == data.item.id) {
                this.setState({ showDropDown: "", errorMsg: "" });
              } else {
                this.setState({ showDropDown: data.item.id, errorMsg: "" });
              }
            }}
          >
            {/* {this.state.vehicles[data.index] != null ||
            this.state.vehicles[data.index] != undefined ? (
              <Text>{this.state.vehicles[data.index].typeVal}</Text>
            ) : (
              <Text>Select Vehicle Type</Text>
            )} */}

            

            {this.state.vehicles[data.index].type != null ? (
              <View>
                {this.state.vehicles[data.index].type == 0 && (
                  <Text>Convertible</Text>
                )}
                {this.state.vehicles[data.index].type == 1 && (
                  <Text>Crossover</Text>
                )}
                {this.state.vehicles[data.index].type == 2 && (
                  <Text>Hatchback</Text>
                )}
                {this.state.vehicles[data.index].type == 3 && (
                  <Text>Sedan</Text>
                )}
                {this.state.vehicles[data.index].type == 4 && (
                  <Text>SUV</Text>
                )}
                {this.state.vehicles[data.index].type == 5 && (
                  <Text>Other</Text>
                )}
              </View>
            ) : (
                <Text>Select Vehicle Type</Text>
              )}



          </TouchableOpacity>
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "type" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
          {this.state.showDropDown == data.item.id ? (
            <View
              style={[
                ApplySyncProfileScreenStyle.customDropDown,
                { height: "30%" }
              ]}
            >
              <ScrollView>
                <TouchableOpacity
                  onPress={() => this.setVehicle("Convertible", 0, data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Convertible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setVehicle("Crossover", 1, data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Crossover</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setVehicle("Hatchback", 2, data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Hatchback</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setVehicle("Sedan", 3, data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Sedan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setVehicle("SUV", 4, data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>SUV</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setVehicle("Other", 5, data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Other</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : null}
          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Registration
          </Text>
          <TextInput
            placeholder={""}
            underlineColorAndroid={Colors.TRANSPARENT}
            style={ApplySyncProfileScreenStyle.searchTextInputStyle}
            value={this.state.vehicles[data.index]["registration"]}
            onChangeText={val => {
              let arr = this.state.vehicles;
              arr[data.index]["registration"] = val;
              this.setState({ showDropDown: "", vehicles: arr, errorMsg: "" });
            }}
            placeholder={""}
          />
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "registration" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Make/Model</Text>
          <TextInput
            placeholder={""}
            underlineColorAndroid={Colors.TRANSPARENT}
            style={ApplySyncProfileScreenStyle.searchTextInputStyle}
            value={this.state.vehicles[data.index]["make_model"]}
            onChangeText={val => {
              let arr = this.state.vehicles;
              arr[data.index]["make_model"] = val;
              this.setState({
                showDropDown: "",
                vehicles: arr,
                errorMsg: "",
                vehiclesValidate: true
              });
            }}
          />
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "make_model" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
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
  async setAge(val, index) {
    var arr = this.state.members;
    arr[index]["age"] = val;
    await this.setState({ members: arr, errorMsg: "", showAgeDropDrown: "" });
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
          <TouchableOpacity
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center" }
            ]}
            onPress={() => {
              if (this.state.showPetDropDrown == data.item.id) {
                this.setState({ showPetDropDrown: "", errorMsg: "" });
              } else {
                this.setState({ showPetDropDrown: data.item.id, errorMsg: "" });
              }
            }}
          >
            {/* {this.state.pets[data.index] != null ||
            this.state.pets[data.index] != undefined ? (
              <Text>{this.state.pets[data.index].typeVal}</Text>
            ) : (
              <Text>Select Type</Text>
            )} */}


            {this.state.pets[data.index].type != null ? (
              <View>
                {this.state.pets[data.index].type == 0 && (
                  <Text>Amphibians</Text>
                )}
                {this.state.pets[data.index].type == 1 && (
                  <Text>Bird</Text>
                )}
                {this.state.pets[data.index].type == 2 && (
                  <Text>Cat</Text>
                )}
                {this.state.pets[data.index].type == 3 && (
                  <Text>Dog</Text>
                )}
                {this.state.pets[data.index].type == 4 && (
                  <Text>Fish</Text>
                )}
                {this.state.pets[data.index].type == 5 && (
                  <Text>Horse</Text>
                )}
                {this.state.pets[data.index].type == 6 && (
                  <Text>Reptile</Text>
                )}
                {this.state.pets[data.index].type == 7 && (
                  <Text>Small Rodent</Text>
                )}
              </View>
            ) : (
                <Text>Select Type</Text>
              )}




          </TouchableOpacity>
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "petType" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
          {this.state.showPetDropDrown == data.item.id ? (
            <View
              style={[
                ApplySyncProfileScreenStyle.customDropDown,
                { height: "30%" }
              ]}
            >
              <ScrollView>
                <TouchableOpacity
                  onPress={() => this.setPet(0, "Amphibians", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Amphibians</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(1, "Bird", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Bird</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(2, "Cat", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Cat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(3, "Dog", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Dog</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(4, "Fish", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Fish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(5, "Horse", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Horse</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(6, "Reptile", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Reptile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setPet(7, "Small Rodent", data.index)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Small Rodent</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : null}

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Type / Breed
          </Text>
          <TextInput
            placeholder={""}
            underlineColorAndroid={Colors.TRANSPARENT}
            style={ApplySyncProfileScreenStyle.searchTextInputStyle}
            // value={'Ray White Manningham'}
            value={this.state.pets[data.index]["breed"]}
            onChangeText={val => {
              let arr = this.state.pets;
              arr[data.index]["breed"] = val;
              this.setState({ showDropDown: "", pets: arr, errorMsg: "" });
            }}
            placeholder={""}
          />
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "breed" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Council Registration No.
          </Text>
          <TextInput
            placeholder={""}
            underlineColorAndroid={Colors.TRANSPARENT}
            style={ApplySyncProfileScreenStyle.searchTextInputStyle}
            value={this.state.pets[data.index]["registration_number"]}
            onChangeText={val => {
              let arr = this.state.pets;
              arr[data.index]["registration_number"] = val;
              this.setState({
                showDropDown: "",
                pets: arr,
                errorMsg: "",
                petValidate: true
              });
            }}
            // value={'Ray White Manningham'}
            placeholder={""}
          />
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "registration_number" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
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
          <TextInput
            style={ApplySyncProfileScreenStyle.inputTextStyle}
            ref="refLotArea"
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            returnKeyType="done"
            value={this.state.members[data.index]["name"]}
            placeholder={"Name"}
            onChangeText={val => {
              var arr = this.state.members;
              arr[data.index]["name"] = val;
              this.setState({ members: arr, errorMsg: "" });
            }}
          />

          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "name" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

          {/* <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                        Age
                        </Text> */}

          {/* <TextInput style={ApplySyncProfileScreenStyle.inputTextStyle}
                        autoCapitalize='none'
                        autoCorrect={false}
                        underlineColorAndroid='transparent'
                        maxLength={6}
                        value={this.state.members[data.index]['age']}
                        keyboardType='number-pad'
                        returnKeyType='done'
                        onChangeText={(val) => {
                            var arr = this.state.members
                            arr[data.index]['age'] = val
                            this.setState({ members: arr, errorMsg: '' })
                        }}
                        placeholder={'Age'}
                    /> */}

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Age</Text>

          <TouchableOpacity
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center" }
            ]}
            onPress={() => {
              if (this.state.showRelationshipDropDrown === data.item.id) {
                this.setState({ showAgeDropDrown: "", errorMsg: "" });
              } else {
                this.setState({ showAgeDropDrown: data.item.id, errorMsg: "" });
              }
            }}
          >
            {this.state.members[data.index]["age"] != null ? (
              <View>
                {/* {this.state.members[data.index]["age"] == 0 && ( */}
                <Text>{this.state.members[data.index]["age"]}</Text>
                {/* )} */}
                {/* {this.state.members[data.index]["age"] == 1 && (
                  <Text>12-17 years old</Text>
                )}
                {this.state.members[data.index]["age"] == 2 && (
                  <Text>18-24 years old</Text>
                )}
                {this.state.members[data.index]["age"] == 3 && (
                  <Text>25-34 years old</Text>
                )}
                {this.state.members[data.index]["age"] == 4 && (
                  <Text>35-44 years old</Text>
                )}
                {this.state.members[data.index]["age"] == 5 && (
                  <Text>45-54 years old</Text>
                )}
                {this.state.members[data.index]["age"] == 6 && (
                  <Text>55-64 years old</Text>
                )}
                {this.state.members[data.index]["age"] == 7 && (
                  <Text>65-74 years old</Text>
                )} */}
              </View>
            ) : (
                <Text>Select Age</Text>
              )}
          </TouchableOpacity>

          {this.state.showAgeDropDrown === data.item.id ? (
            <View
              style={[
                ApplySyncProfileScreenStyle.customDropDown,
                { height: "30%" }
              ]}
            >
              <ScrollView>
                <FlatList
                  data={years}
                  renderItem={(item) => {
                    return (

                      <TouchableOpacity
                        onPress={() => this.setAge(item.item.value, data.item.id)}
                        style={{
                          padding: 10,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Text>{item.item.value}</Text>
                      </TouchableOpacity>
                    )
                  }}
                />
                {/* <TouchableOpacity
                  onPress={() => this.setAge(0, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Under 12 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(1, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>12-17 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(2, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>18-24 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(3, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>25-34 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(4, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>35-44 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(5, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>45-54 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(6, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>55-64 years old</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setAge(7, data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>65-74 years old</Text>
                </TouchableOpacity> */}
              </ScrollView>
            </View>
          ) : null}

          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "age" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Relationship</Text>

          <TouchableOpacity
            style={[
              ApplySyncProfileScreenStyle.searchTextInputStyle,
              { justifyContent: "center" }
            ]}
            onPress={() => {
              if (this.state.showRelationshipDropDrown === data.item.id) {
                this.setState({ showRelationshipDropDrown: "", errorMsg: "" });
              } else {
                this.setState({
                  showRelationshipDropDrown: data.item.id,
                  errorMsg: ""
                });
              }
            }}
          >
            {this.state.members[data.index] != undefined && (
              <View>
                {this.state.members[data.index]["relationship"] != null ? (
                  <View>
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
                ) : (
                    <Text>Select Relationship</Text>
                  )}
              </View>
            )}
          </TouchableOpacity>

          {this.state.showRelationshipDropDrown === data.item.id ? (
            <View
              style={[
                ApplySyncProfileScreenStyle.customDropDown,
                { height: "30%" }
              ]}
            >
              <ScrollView>
                <TouchableOpacity
                  onPress={() => this.setRelation(0, "Spouse", data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Spouse</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setRelation(1, "Son", data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Son</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setRelation(2, "Daughter", data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Daughter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setRelation(3, "Father", data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Father</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setRelation(4, "Mother", data.item.id)}
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Mother</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setRelation(5, "Grand Father", data.item.id)
                  }
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Grand Father</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setRelation(6, "Grand Mother", data.item.id)
                  }
                  style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Grand Mother</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : null}

          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "relationship" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
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
                onChange={val => {
                  var arr = this.state.members;
                  arr[data.index]["be_on_lease"] = true;
                  this.setState({ members: arr, errorMsg: "" });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle
                }
                checked={!this.state.members[data.index].be_on_lease}
                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                uncheckedImage={ImagePath.UNCHECK}
                onChange={val => {
                  var arr = this.state.members;
                  arr[data.index]["be_on_lease"] = false;
                  this.setState({ members: arr, errorMsg: "" });
                }}
              />
            </View>
          )}
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "be_on_lease" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>Email</Text>

          <TextInput
            style={ApplySyncProfileScreenStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={this.state.members[data.index]["email"]}
            returnKeyType="done"
            onChangeText={val => {
              var arr = this.state.members;
              arr[data.index]["email"] = val;
              this.setState({ members: arr, errorMsg: "" });
            }}
            placeholder={"Email"}
          // onSubmitEditing={(event) => { this.refs.refLotArea.focus(); }}
          />
          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "email" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

          <Text style={ApplySyncProfileScreenStyle.labelStyle}>
            Mobile/All Day Contact
          </Text>
          {this.state.members[data.index] && (
            <TextInput
              style={ApplySyncProfileScreenStyle.inputTextStyle}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              // maxLength={10}
              value={this.state.members[data.index]["mobile_number"]}
              keyboardType="number-pad"
              // returnKeyType='done'
              // value
              value={this.state.members[data.index].mobile_number}
              onChangeText={val => {
                var arr = this.state.members;
                arr[data.index]["mobile_number"] = val;
                this.setState({
                  members: arr,
                  errorMsg: "",
                  memberValidate: true
                });
              }}
              placeholder={"Moble Number"}
            // onSubmitEditing={(event) => { this.refs.refLotArea.focus(); }}
            />
          )}

          {this.state.errorMsg != "" &&
            this.state.errorOnTextField == data.index + "mobile_number" ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

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
            <Text
              style={{
                flexWrap: "wrap",
                fontWeight: "600",
                fontSize: 15,
                color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR
              }}
            >
              You confirm that you have the person's content to provide their
              personal information
            </Text>

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
            <Text
              style={{
                flexWrap: "wrap",
                fontWeight: "600",
                fontSize: 15,
                color: Colors.ADD_PROPERT_LABEL_TEXT_COLOR
              }}
            >
              Apart from the above, how many other people will be occupying the
              property
            </Text>
            <Dropdown
              label=""
              labelHeight={5}
              fontSize={14}
              baseColor={Colors.WHITE}
              itemTextStyle={ApplySyncProfileScreenStyle.dropDownTextStyle}
              containerStyle={ApplySyncProfileScreenStyle.dropDownViewStyle}
              data={spinerData}
              value={this.state.personCount}
              onChangeText={val => {
                this.setState({ personCount: val });
                var arr = this.state.members;
                var arr1 = [];
                for (let index = 0; index < Number(val); index++) {
                  if (arr[index] != null || arr[index] != undefined) {
                    arr1[index] = {
                      age: this.state.members[index].age,
                      be_on_lease: this.state.members[index].be_on_lease,
                      email: this.state.members[index].email,
                      mobile_number: this.state.members[index].mobile_number,
                      name: this.state.members[index].name,
                      typeVal: this.state.members[index].typeVal,
                      relationship: this.state.members[index].relationship,
                      _id: this.state.members[index]._id
                    };
                  } else {
                    arr1[index] = {
                      age: null,
                      be_on_lease: false,
                      email: "",
                      mobile_number: "",
                      name: "",
                      typeVal: "",
                      relationship: undefined
                    };
                  }
                }
                this.setState({ members: arr1 });
              }}
              placeholder="Select No. of People"
            />

            {this.state.errorMsg != "" && this.state.errorOnTextField == 1 ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

            {this.renderPersons(this.state.personCount)}
          </View>

          <View style={{ height: 25, backgroundColor: "#F8F9FE" }} />

          {/* =================== Vehicles ======================== */}

          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: "300" }}>Vehicles</Text>
            </View>
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              How many vehicles will be parked at the property
            </Text>
            <Dropdown
              label=""
              labelHeight={5}
              fontSize={14}
              baseColor={Colors.WHITE}
              itemTextStyle={ApplySyncProfileScreenStyle.dropDownTextStyle}
              containerStyle={ApplySyncProfileScreenStyle.dropDownViewStyle}
              data={spinerData}
              value={this.state.vehicleCount}
              onChangeText={val => {
                this.setState({ vehicleCount: val });
                var arr = this.state.vehicles;
                var arr1 = [];
                for (let index = 0; index < Number(val); index++) {
                  if (arr[index] != null || arr[index] != undefined) {
                    arr1[index] = {
                      make_model: this.state.vehicles[index].make_model,
                      registration: this.state.vehicles[index].registration,
                      type: this.state.vehicles[index].type,
                      _id: this.state.vehicles[index]._id,
                      typeVal: this.state.vehicles[index].typeVal
                    };
                  } else {
                    arr1[index] = {
                      make_model: "",
                      registration: "",
                      type: undefined,

                      typeVal: ""
                    };
                  }
                }
                this.setState({ vehicles: arr1 });
              }}
              placeholder="Select No. of Vehicles"
            />

            {this.renderVehicles(this.state.vehicleCount)}
          </View>

          <View style={{ height: 25, backgroundColor: "#F8F9FE" }} />

          {/* =================== Pets ======================== */}

          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: "300" }}>Pets</Text>
            </View>
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              No. Of Pets
            </Text>
            <Dropdown
              label=""
              labelHeight={5}
              fontSize={14}
              baseColor={Colors.WHITE}
              itemTextStyle={ApplySyncProfileScreenStyle.dropDownTextStyle}
              containerStyle={ApplySyncProfileScreenStyle.dropDownViewStyle}
              data={spinerData}
              value={this.state.PetCount}
              onChangeText={val => {
                this.setState({ PetCount: val });
                var arr = this.state.pets;
                var arr1 = [];
                for (let index = 0; index < Number(val); index++) {
                  if (arr[index] != null || arr[index] != undefined) {
                    arr1[index] = {
                      breed: this.state.vehicles[index].breed,
                      registration_number: this.state.vehicles[index]
                        .registration_number,
                      type: this.state.vehicles[index].type,
                      typeVal: this.state.vehicles[index].typeVal,
                      _id: this.state.vehicles[index]._id
                    };
                  } else {
                    arr1[index] = {
                      breed: "",
                      registration_number: "",
                      type: undefined,
                      typeVal: undefined
                    };
                  }
                }
                this.setState({ pets: arr1 });
              }}
              placeholder="Select No. of Pets"
            />
            {this.renderPets(this.state.PetCount)}
          </View>
        </KeyboardAwareScrollView>

        {/* =================== Buttons ======================== */}
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

export default ApplySyncProfileScreenStepTwo;
