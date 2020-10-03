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
  AsyncStorage,
  FlatList,
  Modal
} from "react-native";

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import NewNoticeBoardScreenStyle from "./NewNoticeBoardScreenStyle";
import CheckBox from "react-native-checkbox";
import { Dropdown } from "react-native-material-dropdown";
import * as Progress from "react-native-progress";
//import listData from  "../../../../data";
var selectedRolesData = [];
var selectedPropertyData = [];
let propertyType = [
  {
    value: "1002944 : Apartment 901, Building 4, R"
  },
  {
    value: "Rental"
  }
];
let contextRef;
var amenitiesSelectedArrray = [];

import {
  getUserRolesList,
  getMaintenancePropertyList,
  CreateNotice,
  getAdminStatistics,
  getPropertyListForCreateNotice
} from "../../../Action/ActionCreators";

import {
  noticeDescriptionChanged,
  noticeNameChanged,
  resetState,
  showLoading
} from "../NoticeBoardAction";
import APICaller, { GETAPICaller } from "../../../Saga/APICaller";

class NewNoticeBoardScreen extends Component {
  constructor() {
    super();
    this.state = {
      amenitiesListData: {},
      userRolesData: [],
      rolesData: [],
      propertyListData: [],
      searchPropertyList: [],
      isLoading: true,
      errorMsg: "",
      errorOnTextField: "",
      userRoleCount: [
        { id: "1", description: "All", count: 0 },
        {
          _id: "5a1d113016bed22901ce050b",
          description: "Agency Owner",
          title: "I own an agency (Principle)",
          count: 0
        },
        {
          _id: "5a12b4fe6b53784648d45479",
          description: "Agent",
          title: "I am a property manager (PM)",
          count: 0
        },
        {
          _id: "5a1d11c016bed22901ce050c",
          description: "Tenant",
          title: "I am a tenant (Tenant)",
          count: 0
        },
        {
          _id: "5a1d295034240d4077dff208",
          description: "Owner",
          title: "I am a property owner (Owner)",
          count: 0
        }
      ],
      isPropertyModal: false
    };
    contextRef = this;
  }


  componentDidUpdate() {
    this.onUserRoleSuccess();
    this.onPropertyListSuccess();
    this.onAddNoticeboardSuccess();
    this.onGetAdminStatisticsSuccess();
    
  }

  componentWillUnmount() {
    amenitiesSelectedArrray = [];
    selectedRolesData = [];
    selectedPropertyData = [];
  }

  componentWillMount() {
    // AsyncStorage.getItem("SyncittUserInfo").then(value => {
    //   if (value) {
    //     var userData = JSON.parse(value);
    //     this.setState({ logedinUserData: userData });
    //     var authToken = userData.token;
    //     var postData = {
    //       agency_id: userData.data.agency_id
    //       // assign_to_roles: selectedRolesData,
    //       // created_by: userData.data._id,
    //       //description: this.props.postDescriptionChanged,
    //       // propertiesArr: selectedPropertyData,
    //       //title: this.props.postNameChanged,
    //     };
    
    
    //     // this.props.getAdminStatistics(authToken)
    //   }
    // });
    this.callPropertyList();

    this.callUserRoleList();
  }
  getCounterForProperty() {
    let bodyArr = [];
    let selectedProperty = []
    // let arr = this.state.propertyListData.filter((val)=> return val.isSelected == true)
    const arr = this.state.propertyListData.filter((val) => {
      if (val.isSelected == true) {
        
        selectedProperty.push(val.id)
      }
    });
    

    
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        APICaller("getUserCountsViaProperties", "POST", authToken, {
          property_arr: selectedProperty
        }).then(data => {
          
          this.prepareDataForUserRoles(data);
        },
          err => {
            
            let arr = {
              agencyCnt: 0,
              agentCnt: 0,
              code: 200,
              data: 0,
              ownerCnt: 0,
              tenantCnt: 0
            }
            this.prepareDataForUserRoles(arr);
          });
      }
    });
  }
  prepareDataForUserRoles(data) {
    var arr = [];
    if (this.state.userRolesData != null && this.state.rolesData != []) {
      
      element = {
        id: "1",
        description: "All",
        count: (data.tenantCnt ? data.tenantCnt : 0) + data.agentCnt + data.ownerCnt + data.agencyCnt
      };
      arr.push(element);
      this.state.userRolesData.forEach(element => {
        if (element.description == "Agent") {
          element["count"] = data.agentCnt;
          arr.push(element);
        } else if (element.description == "Tenant") {
          element["count"] = data.tenantCnt;
          arr.push(element);
        } else if (element.description == "Owner") {
          element["count"] = data.ownerCnt;
          arr.push(element);
        } else if (element.description == "Agency Owner") {
          element["count"] = data.agencyCnt;
          arr.push(element);
        }
      });
      
      this.setState({ userRoleCount: arr });
    }
  }
  onGetAdminStatisticsSuccess() {
    if (this.props.noticeBoardReducer.adminStatistics != []) {
      if (this.props.noticeBoardReducer.adminStatistics.code == 200) {
        this.setState({
          rolesData: this.props.noticeBoardReducer.adminStatistics.data
        });
        
        // this.prepareDataForUserRoles(
        //   this.props.noticeBoardReducer.adminStatistics.data
        // );
        // this.state.rolesData.forEach(element => {
        
        // });
        // for (var key in this.props.noticeBoardReducer.adminStatistics.data) {
        //     if (this.props.noticeBoardReducer.adminStatistics.data.hasOwnProperty(key)) {
        
        //     }
        // }
      }
      this.props.resetState();
    }
  }
  onPostNameChange(text) {
    this.props.noticeNameChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }

  onPostDescriptionChange(text) {
    this.props.noticeDescriptionChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }

  submitRequest() {
    this.state.userRoleCount.map((data, index) => {
      if (index != 0) {
        if (this.state.userRoleCount[index].isSelected) {
          var roleObj = {
            _id: this.state.userRoleCount[index]._id
          };
          selectedRolesData.push(roleObj);
        }
      }
    });

    if (selectedPropertyData.length == 0) {
      alert("Please select property");
    } else if (selectedRolesData.length == 0) {
      alert("Please select roles");
    } else {
      AsyncStorage.getItem("SyncittUserInfo")
        .then(value => {
          if (value) {
            var userData = JSON.parse(value);
            this.setState({ logedinUserData: userData });
            var authToken = userData.token;
            var postData = {
              agency_id: userData.data.agency_id,
              assign_to_roles: selectedRolesData,
              created_by: userData.data._id,
              //description: this.props.postDescriptionChanged,
              propertiesArr: selectedPropertyData
              //title: this.props.postNameChanged,
            };

            
            this.props.showLoading();
            this.props.CreateNotice(authToken, postData);
          }
        })
        .done();
    }
  }

  callUserRoleList() {
    this.props.getUserRolesList();
    // this.props.getAdminStatistics();
  }

  onUserRoleSuccess() {
    if (this.props.noticeBoardReducer.userRoleData != "") {
      if (this.props.noticeBoardReducer.userRoleData.code == 200) {
        
        this.setState({
          userRolesData: this.props.noticeBoardReducer.userRoleData.data
        });
      } else {
        alert(this.props.noticeBoardReducer.userRoleData.message);
      }
      this.props.resetState();
    }
  }

  callPropertyList() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          // var postData = {
          //     agency_id: userData.data.agency_id,
          //     request_by_role: userData.data.role_id,
          //     request_by_id: userData.data._id,
          // }
          //this.props.showLoading();

          //   this.props.getPropertyListForCreateNotice(authToken);
          
          GETAPICaller('getPropertyListForstarta', 'GET', authToken, '').then(data => {
            
            this.setState({
              propertyListData: this.preparePropertyListDropdownData(
                data.data
              ),
              searchPropertyList: this.preparePropertyListDropdownData(
                data.data
              ),
              isLoading: false
            });
          },
            err => {
              this.setState({ isLoading: false })
              alert('Something went wrong')
            })
        }
      })
      .done();
  }

  onAddNoticeboardSuccess() {
    if (this.props.noticeBoardReducer.addNoticeboardRes != "") {
      if (this.props.noticeBoardReducer.addNoticeboardRes.code == 200) {
        Actions.pop();
        this.props.onRefresh();
        
        //this.setState({ propertyListData: this.preparePropertyListDropdownData(this.props.noticeBoardReducer.propertyListData.data) });
      } else {
        alert(this.props.noticeBoardReducer.addNoticeboardRes.message);
      }
      this.props.resetState();
    }
  }

  onPropertyListSuccess() {
    if (this.props.noticeBoardReducer.propertyListData != "") {
      
      if (this.props.noticeBoardReducer.propertyListData.code == 200) {
        this.setState({
          propertyListData: this.preparePropertyListDropdownData(
            this.props.noticeBoardReducer.propertyListData.data
          ),
          searchPropertyList: this.preparePropertyListDropdownData(
            this.props.noticeBoardReducer.propertyListData.data
          )
        });
      } else {
        alert(this.props.noticeBoardReducer.propertyListData.message);
      }
      this.props.resetState();
    }
  }

  preparePropertyListDropdownData(propertyListData) {
    var tempArray = propertyListData;
    tempArray.map((data, index) => {
      tempArray[index].value = tempArray[index].address;
      tempArray[index].id = tempArray[index]._id;
      tempArray[index].isSelected = false;
    });
    
    return tempArray;
  }

  closeAddProperty() {
    Actions.pop();
  }

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
        <Text style={CommonStyles.navBarTitleTextView}>
          {Strings.NEW_NOTICE_BOARD}
        </Text>
        <TouchableOpacity
          onPress={() => this.closeAddProperty()}
          style={CommonStyles.navRightImageView}
        >
          <Image source={ImagePath.DRAWER_CROSS_ICON} />
        </TouchableOpacity>
      </View>
    );
  }
  prePareAmenitiesData(amenitiesData) {
    var tempArray = amenitiesData;
    tempArray.map((data, index) => {
      tempArray[index].isChecked = false;
    });
    
    return tempArray;
  }

  userRoleRenderItem = ({ item, index }) => {
    return (
      <View style={NewNoticeBoardScreenStyle.amenitiesListItemContainerStyle}>
        <CheckBox
          label={item.description + "(" + item.count + ")"}
          labelStyle={NewNoticeBoardScreenStyle.amenitisListCheckboxLabelStyle}
          checked={item.isSelected}
          checkedImage={ImagePath.CHECK_BOX_ACTIVE}
          uncheckedImage={ImagePath.UNCHECK}
          onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
        />
      </View>
    );
  };

  propertyListItem({ item, index }) {
    return (
      <View style={NewNoticeBoardScreenStyle.propertyRenderListStyle}>
        <CheckBox
          label={item.address}
          labelStyle={NewNoticeBoardScreenStyle.amenitisListCheckboxLabelStyle}
          checked={item.isSelected}
          checkedImage={ImagePath.CHECK_BOX_ACTIVE}
          uncheckedImage={ImagePath.UNCHECK}
          onChange={contextRef.onPropertyCheckBoxChangeListener.bind(
            contextRef,
            index
          )}
        />
      </View>
    );
  }
  searchProperty(text) {
    let data = this.state.propertyListData.filter(val =>
      val.address.match(text)
    );
    
    this.setState({ searchPropertyList: data });
  }
  selectedPropertyRenderItem({ item, index }) {
    
    if (item.isSelected) {
      return (
        <View style={NewNoticeBoardScreenStyle.selectedPropertyRenderListStyle}>
          {item.isSelected ? <Text>{item.address}</Text> : null}
        </View>
      );
    } else {
      return null;
    }
  }
  onCheckBoxChangeListener(index) {
    
    var tempData = this.updateCheckBoxSelection(
      index,
      this.state.userRoleCount
    );
    this.setState({ userRoleCount: tempData });
    
  }

  onPropertyCheckBoxChangeListener(index) {
    
    var tempData = this.updatePropertyCheckBoxSelection(
      index,
      this.state.propertyListData
    );
    this.setState({ propertyListData: tempData });
  }

  showPropertyModal() {
    
    if (this.state.isPropertyModal) {
      this.setState({
        isPropertyModal: false,
        searchPropertyList: this.state.propertyListData
      });
    } else {
      this.setState({ isPropertyModal: true, searchPropertyList: this.state.propertyListData });
    }
  }

  updatePropertyCheckBoxSelection(selectedIndex, propertyListData) {
    var tempArray = propertyListData;
    
    tempArray.map((data, index) => {
      if (selectedIndex == index) {
        if (tempArray[selectedIndex].isSelected) {
          tempArray[selectedIndex].isSelected = false;
          
        } else {
          tempArray[selectedIndex].isSelected = true;
          
        }
      }
    });

    return tempArray;
  }

  updateCheckBoxSelection(selectedIndex, userRolesData) {
    var tempArray = userRolesData;
    if (selectedIndex == 0) {
      var i = 0;
      if (tempArray[0].isSelected == true) {
        tempArray.map((data, index) => {
          tempArray[i].isSelected = false;
          i++;
        });
      } else {
        tempArray.map((data, index) => {
          tempArray[i].isSelected = true;
          i++;
        });
      }
    } else {
      
      if (tempArray[selectedIndex].isSelected) {
        tempArray[selectedIndex].isSelected = false;
      } else {
        tempArray[selectedIndex].isSelected = true;
      }
      // tempArray.map((data, index) => {
      //     if(tempArray[selectedIndex].isSelected) {
      //         tempArray[selectedIndex].isSelected = false;
      //     }
      // })
    }
    return tempArray;
  }
  onCancel() {
    this.showPropertyModal();
  }
  onDone() {
    this.state.propertyListData.map((data, index) => {
      if (this.state.propertyListData[index].isSelected) {
        selectedPropertyData.push(this.state.propertyListData[index]._id);
        this.setState({ searchPropertyList: this.state.propertyListData })
      }
    });
    this.getCounterForProperty();
    this.showPropertyModal();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.navBar()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            NewNoticeBoardScreenStyle.scrollViewContainerStyle
          }
        >
          {/* <View style={NewNoticeBoardScreenStyle.viewContainer}>
                        <View style={NewNoticeBoardScreenStyle.addPropertyInputContainer}>

                            <Text style={NewNoticeBoardScreenStyle.labelStyle}>
                                {Strings.POST_TITLE}
                            </Text>
                            <TextInput style={NewNoticeBoardScreenStyle.inputTextStyle}
                                multiline={false}
                                onChangeText={this.onPostNameChange.bind(this)} />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                    </View> */}

          {/* <View style={NewNoticeBoardScreenStyle.viewContainer}>
                        <View style={NewNoticeBoardScreenStyle.addPropertyInputContainer}>

                            <Text style={NewNoticeBoardScreenStyle.labelStyle}>
                                {Strings.POST_DETAILS_OR_DESCRIPTIONS}
                            </Text>
                            <TextInput style={NewNoticeBoardScreenStyle.inputDescriptionTextStyle}
                                multiline={true}
                                onChangeText={this.onPostDescriptionChange.bind(this)} />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                    </View> */}

          <View style={NewNoticeBoardScreenStyle.headerContainer}>
            <TouchableOpacity
              onPress={this.showPropertyModal.bind(this)}
              style={NewNoticeBoardScreenStyle.selectPropertyTextStyle}
            >
              <Text>Select Property</Text>
            </TouchableOpacity>

            {selectedPropertyData.length > 0 ? (
              <View
                style={NewNoticeBoardScreenStyle.selectedPropertyListContainer}
              >
                <View
                  style={
                    NewNoticeBoardScreenStyle.selectedPropertyListViewStyle
                  }
                >
                  <FlatList
                    data={this.state.propertyListData}
                    extraData={this.state}
                    renderItem={this.selectedPropertyRenderItem}
                  />
                </View>
              </View>
            ) : null}

            {/* <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={NewNoticeBoardScreenStyle.dropDownViewStyle}
                            data={this.state.propertyListData}
                            value={this.state.propertyListData ? (this.state.propertyListData.length > 0 ? this.state.propertyListData[0].value : '') : ''}
                        /> */}
          </View>

          
          <View style={NewNoticeBoardScreenStyle.addPropertyInputContainer}>
            <Text style={NewNoticeBoardScreenStyle.labelStyle}>
              {Strings.ADD_MEMBERS}
            </Text>
            
            {this.state.userRoleCount != [] ? (
              <View style={NewNoticeBoardScreenStyle.amenitiesListViewStyle}>
                <FlatList
                  data={this.state.userRoleCount}
                  extraData={this.state}
                  renderItem={this.userRoleRenderItem}
                />
              </View>
            ) : (
                null
              )}
          </View>
        </ScrollView>

        <View style={NewNoticeBoardScreenStyle.buttonContainerStyle}>
          <TouchableOpacity onPress={this.submitRequest.bind(this)}>
            <View
              style={NewNoticeBoardScreenStyle.roundedBlueProceedButtonStyle}
            >
              <Text style={NewNoticeBoardScreenStyle.proceedButtonTextStyle}>
                {Strings.SAVE}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.state.isPropertyModal ? (
          <Modal onRequestClose={() => { }} transparent>
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: Colors.TRANSLUCENT_BLACK_DARK
              }}
            >
              <View style={NewNoticeBoardScreenStyle.propertyListSelction}>
                {/* <View style={{ padding: 15, height: 65 }}>
                  <TextInput
                    placeholder={"Search Property"}
                    underlineColorAndroid={Colors.TRANSPARENT}
                    style={NewNoticeBoardScreenStyle.searchTextInputStyle}
                    onChangeText={val => this.searchProperty(val)}
                  />
                </View> */}
                <FlatList
                  data={this.state.searchPropertyList}
                  extraData={this.state}
                  renderItem={this.propertyListItem}
                />

                <View
                  style={NewNoticeBoardScreenStyle.modalButtonContainerStyle}
                >
                  <TouchableOpacity onPress={this.onCancel.bind(this)}>
                    <View
                      style={
                        NewNoticeBoardScreenStyle.roundedBlueProceedButtonStyle
                      }
                    >
                      <Text
                        style={NewNoticeBoardScreenStyle.modalButtonTextStyle}
                      >
                        {Strings.CANCEL}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onDone.bind(this)}>
                    <View
                      style={
                        NewNoticeBoardScreenStyle.roundedBlueProceedButtonStyle
                      }
                    >
                      <Text
                        style={NewNoticeBoardScreenStyle.modalButtonTextStyle}
                      >
                        {Strings.DONE}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : null}

        {this.state.isLoading ? (
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
    noticeBoardReducer: state.noticeBoardReducer
  };
}

export default connect(
  mapStateToProps,
  {
    resetState,
    showLoading,
    getUserRolesList,
    getMaintenancePropertyList,
    getAdminStatistics,
    noticeDescriptionChanged,
    noticeNameChanged,
    CreateNotice,
    getPropertyListForCreateNotice
  }
)(NewNoticeBoardScreen);
