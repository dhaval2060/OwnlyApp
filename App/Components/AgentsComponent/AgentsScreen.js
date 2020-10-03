import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
  AsyncStorage,
  Dimensions
} from "react-native";
import { Actions } from "react-native-router-flux";
import CommonStyles from "../../CommonStyle/CommonStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import ImagePath from "../../Constants/ImagesPath";
import AgentsScreenStyle from "./AgentsScreenStyle";
import API from "../../Constants/APIUrls";
import FilterScreen from "../FilterComponent/FilterScreen";
import StarRating from "react-native-star-rating";
import * as Progress from "react-native-progress";
import {
  getAllAgentList,
  getAllAgentListWithiInAgency,
  getDeleteAgent
} from "../../Action/ActionCreators";
import { updateAgentList, showLoading, resetState } from "./AgentsScreenAction";
const window = Dimensions.get("window");

let ref,loggedUser;
let data = [
  {
    value: "By best match"
  }
];
class AgentssScreen extends Component {
  constructor() {
    super();
    ref = this;
    this.state = {
      isTabSelected: true,
      isFilter: false,
      agentListData: [],
      roleName: "",
      deleteCheckStatus:false,
      isChecked : [],
      selectedLists:[],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.agentsScreenReducer.refreshScene != "" &&
      nextProps.agentsScreenReducer.refreshScene != undefined
    ) {
      
      if (this.state.isTabSelected) {
        this.callGetAgentList();
      } else {
        this.callGetAgentListWithiInAgency();
      }
      this.props.updateAgentList("");
    }
  }

  componentDidUpdate() {
    this.onAgentListSuccess();
    this.onAgentListWithiInAgencySuccess();
    this.onAgentDeleteSuccess();
  }

  componentWillMount() {
    this.getRoleName();
    this.callGetAgentList();
  }

  getRoleName() {
    AsyncStorage.getItem(Strings.USER_ROLE_NAME).then(value => {
        if (value) {
          this.setState({ roleName: value });
        }
      }).done();
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  callGetAgentList() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          loggedUser = userData.data._id;
          var authToken = userData.token;
          this.props.showLoading();
          this.props.getAllAgentList(authToken);
        }
      })
      .done();
  }

  callGetAgentListWithiInAgency() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          var postData = {
            agency_id: userData.data.agency_id
          };
          this.props.showLoading();
          
          this.props.getAllAgentListWithiInAgency(authToken, postData);
        }
      }).done();
  }
  onAgentListSuccess() {
    if (this.props.agentsScreenReducer.agentListResponse != "") {
      if (this.props.agentsScreenReducer.agentListResponse.code == 200) {
        console.log(this.props.agentsScreenReducer.agentListResponse);
        this.setState({
          agentListData: this.props.agentsScreenReducer.agentListResponse.data
        });
      } else {
        //alert(this.props.agentsScreenReducer.agentListResponse.message);
      }
      this.props.resetState();
    }
  }

  onAgentListWithiInAgencySuccess() {
    if (this.props.agentsScreenReducer.agentListWithInAgencyResponse != "") {
      if (
        this.props.agentsScreenReducer.agentListWithInAgencyResponse.code == 200
      ) {        
        console.log(this.props.agentsScreenReducer.agentListWithInAgencyResponse);
        this.setState({
          agentListData: this.props.agentsScreenReducer.agentListWithInAgencyResponse.data
        });
        let initialCheck = this.props.agentsScreenReducer.agentListWithInAgencyResponse.data.map(() => false);
        this.setState({isChecked : initialCheck});
      } else {
        //alert(this.props.agentsScreenReducer.agentListWithInAgencyResponse.message);
      }
      this.props.resetState();
    }
  }
  onAgentDeleteSuccess() {
    if (this.props.agentsScreenReducer.deleteagentResponse != "") {
      if (
        this.props.agentsScreenReducer.deleteagentResponse.code == 200
      ) {
        this.setState({ isTabSelected: false,agentListData:[] });
        this.callGetAgentListWithiInAgency();
      } else {
        //alert(this.props.agentsScreenReducer.deleteagentResponse.message);
      }
      this.props.resetState();
    }
  }
  
  callSendMessageScreen(firstname, lastname, id) {
    Actions.MessageToTraderScreen({
      userFirstName: firstname,
      userLastName: lastname,
      receiverId: id,
      goBackToPop: true
    });
  }

  callAgentRemovalScreen() {
    Actions.AgentRemovalScreen();
  }

  async onAllTabClick() {
    await this.setState({ isTabSelected: true,agentListData:[] });
    this.callGetAgentList();
  }
  async onSavedTabClick() {
    await this.setState({ isTabSelected: false ,agentListData:[]});
    this.callGetAgentListWithiInAgency();
  }

  onFilterClick() {
    if (this.state.isFilter) {
      this.setState({ isFilter: false });
    } else {
      this.setState({ isFilter: true });
    }
  }

  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>{Strings.AGENTS}</Text>
        {this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ? (
          <TouchableOpacity
            style={CommonStyles.navPlusImageView}
            onPress={this.callAddAgentScreen.bind(this)}
          >
            <Image source={ImagePath.PLUS_ICON} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  renderImageItem(item, index) {
    return (
      <Image
        source={{ uri: item.url }}
        style={AgentsScreenStyle.userListImageStyle}
      />
    );
  }

  callAgentProfileScreen(id, averageRate, totalReviewLength) {
    Actions.AgentProfileScreen({
      user_id: id,
      averageRating: averageRate,
      totalReviewLengthrating: totalReviewLength
    });
  }

  callAddAgentScreen() {
    Actions.AddAgentScreen();
  }
  _selectDeleteItem = (item,index) => {
    let { isChecked,selectedLists} = this.state;
    isChecked[index] = !isChecked[index];
    this.setState({ isChecked : isChecked});
    if(isChecked[index] == true){
        selectedLists.push(item._id);
    }else {            
        selectedLists.pop(item._id);
    }
  }
  _selectAllDeleteItem = () =>{
    let { isChecked,selectedLists} = this.state;
    if(this.state.agentListData.length > 0){
      this.state.agentListData.map((item,index)=>{
        if(loggedUser !== item._id){
          if(!this.state.deleteCheckStatus){
            isChecked[index] = true;
            this.setState({ isChecked : isChecked});
            selectedLists.push(item._id);
          }else{
            isChecked[index] = false;
            this.setState({ isChecked : isChecked});
            selectedLists.pop(item._id);
          }
          this.setState({deleteCheckStatus : !this.state.deleteCheckStatus});
        }
      })
    }else{
      console.log('no agent found')
    }
    
  }

  renderItem =(item, index) => {
    var userImage = item.image
      ? item.image
        ? API.USER_IMAGE_PATH + item.image
        : ""
      : "";
    var agencyLogoImage = item.agency_id
      ? item.agency_id.logoImage
        ? API.USER_IMAGE_PATH + item.agency_id.logoImage
        : ""
      : "";
    var firstName = item.firstname ? item.firstname : "";
    var lastName = item.lastname ? item.lastname : "";
    var address = item.address ? item.address : "";
    var teamCount = item.team_cnt ? item.team_cnt : 0;
    var propertyCount = item.property_cnt ? item.property_cnt : 0;
    var averageRate = item.averageRate ? item.averageRate : 0;
    var totalReviewLength = item.totalReviewLength ? item.totalReviewLength : 0;
    return (
      <View style={AgentsScreenStyle.listItemContainer}>
        {
          this.state.roleName === Strings.USER_ROLE_AGENCY_OWNER && this.state.isTabSelected===false && loggedUser !== item._id && (
          <TouchableOpacity style={{position:'absolute',top:10,left:10}} onPress={()=>this._selectDeleteItem(item,index)}>
            {this.state.isChecked[index] ? <Image source={ImagePath.CHECK_BOX_ACTIVE} style={{marginTop: 0}}/>:<Image source={ImagePath.CHECK_BOX_OFF} style={{marginTop: 0,tintColor:Colors.BLACK}}/>}
          </TouchableOpacity>
          )}
        <View style={AgentsScreenStyle.listImageContainerStyle}>
          <TouchableOpacity
            onPress={ref.callAgentProfileScreen.bind(
              ref,
              item._id,
              averageRate,
              totalReviewLength
            )}
          >
            {userImage != "" ? (
              <Image
                source={{ uri: userImage }}
                style={AgentsScreenStyle.listImageStyle}
              />
            ) : (
              <View style={AgentsScreenStyle.emptyMaintenaceUserImageStyle}>
                <Text style={AgentsScreenStyle.initialTextStyle}>
                  {firstName.charAt(0).toUpperCase() +
                    " " +
                    lastName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {item.is_online ? (
            <View style={AgentsScreenStyle.onLineStatusViewStyle} />
          ) : (
            <View style={AgentsScreenStyle.statusViewStyle} />
          )}
        </View>

        <Text style={AgentsScreenStyle.listTitleTextStyle}>
          {firstName + " " + lastName}
        </Text>
        <View>
          <StarRating
            disabled={true}
            maxStars={5}
            starSize={20}
            starStyle={{ paddingRight: 5, marginTop: 8 }}
            emptyStarColor={Colors.EMPTY_STAR_COLOR}
            starColor={Colors.STAR_COLOR}
            rating={averageRate}
            selectedStar={rating => ref.onStarRatingPress(rating)}
          />
        </View>
        <Text style={AgentsScreenStyle.listReviewTextStyle}>
          {averageRate +
            " " +
            "from" +
            " " +
            totalReviewLength +
            " " +
            "reviews"}
        </Text>
        <Text style={AgentsScreenStyle.listReviewTextStyle}>{address}</Text>

        <TouchableOpacity
          onPress={ref.callSendMessageScreen.bind(
            ref,
            firstName,
            lastName,
            item._id
          )}
        >
          <View style={AgentsScreenStyle.roundedBlueMessageButtonStyle}>
            <Text style={AgentsScreenStyle.messageButtonTextStyle}>
              {Strings.CONTACT_AGENT}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={AgentsScreenStyle.userInfoContainerStyle}>
          <View style={AgentsScreenStyle.userInfoTextContainerStyle}>
            <Text style={AgentsScreenStyle.labelTextStyle}>Team members</Text>
            <Text style={AgentsScreenStyle.infoTextStyle}>{teamCount}</Text>
          </View>
          <View style={AgentsScreenStyle.userInfoTextContainerStyle}>
            <Text style={AgentsScreenStyle.labelTextStyle}>
              Inspection frequency
            </Text>
            <Text style={AgentsScreenStyle.infoTextStyle}>6 /mo</Text>
          </View>
          <View style={AgentsScreenStyle.userInfoTextContainerStyle}>
            <Text style={AgentsScreenStyle.labelTextStyle}>
              No. of properties\n managed
            </Text>
            <Text style={AgentsScreenStyle.infoTextStyle}>{propertyCount}</Text>
          </View>
        </View>
        {agencyLogoImage != "" ? (
          <Image
            source={{ uri: agencyLogoImage }}
            style={AgentsScreenStyle.likeImageViewStyle}
          />
        ) : null}
      </View>
    );
  }

  _deleteOpetation = ()=>{
    if(this.state.selectedLists.length <= 0){
      Alert.alert('Please select at least one agent for delete operation');
    }else{
      Alert.alert(  
        'Delete alert',  
        "Please make sure you have changed the agent on all of this agent’s properties",  
        [  
            {  
                text: 'Cancel',  
                onPress: () => console.log('Cancel Pressed'),  
                style: 'cancel',  
            },  
            {text: 'Delete', onPress: () => this._calledDeleteAgentAPI()},  
        ] 
      );  
    }
  }
  _calledDeleteAgentAPI = ()=>{
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          var postData = {
            agentId: this.state.selectedLists
          };
          this.props.showLoading();
          this.props.getDeleteAgent(authToken, postData);
        }
      })
      .done();
  }
  render() {
    return (
      <View style={CommonStyles.listMainContainerStyle}>
        {this.navBar()}
        <View style={[AgentsScreenStyle.refineResultContainerStyle,{justifyContent:'space-between'}]}>
          <View style={{flexDirection:'row',alignItems: 'center'}}>
          <View>
            <Text style={AgentsScreenStyle.refineResultTextStyle}>
              {Strings.REFINE_RESULTS}
            </Text>
            <View style={AgentsScreenStyle.refineResultBottomBarStyle} />
          </View>
          {this.state.isFilter ? (
            <Image
              source={ImagePath.ARROW_DOWN}
              style={AgentsScreenStyle.refineResultArrowUpStyle}
            />
          ) : (
            <Image
              source={ImagePath.ARROW_DOWN}
              style={AgentsScreenStyle.refineResultArrowStyle}
            />
          )}
          </View>
          {
            this.state.isTabSelected === false && this.state.roleName === Strings.USER_ROLE_AGENCY_OWNER && (
            <View style={{flexDirection:'row',alignItems: 'center',marginRight:20,marginTop: 20,}}>
              
                <TouchableOpacity onPress={()=>this._selectAllDeleteItem()} style={{flexDirection:'row',alignItems:'center'}}>
                  {
                    this.state.deleteCheckStatus ?
                    <Image source={ImagePath.CHECK_BOX_ACTIVE} style={{marginTop: 0}}/>:
                    <Image source={ImagePath.CHECK_BOX_OFF} style={{marginTop: 0,tintColor:Colors.BLACK}}/>
                  }
                
                <Text style={[AgentsScreenStyle.refineResultTextStyle,{marginLeft:5,marginTop: 0,}]}>
                  {'Select All'}
                </Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._deleteOpetation()} style={{backgroundColor:'gray',borderRadius:5,marginLeft:10,paddingVertical:5,paddingHorizontal:8}}>
              <Text style={[AgentsScreenStyle.refineResultTextStyle,{color:'white',alignSelf:'center',marginTop: 0,marginLeft:0,marginTop: 0}]}>
                  {'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              AgentsScreenStyle.tabContainerScrollViewStyle
            }
          >
            <View style={AgentsScreenStyle.tabContainerStyle}>
              <TouchableOpacity onPress={() => this.onAllTabClick()}>
                <View>
                  <View style={AgentsScreenStyle.tabTextViewStyle}>
                    <Text
                      style={
                        this.state.isTabSelected
                          ? AgentsScreenStyle.tabLabelTextStyle
                          : AgentsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      {Strings.ALL}
                    </Text>
                  </View>
                  {this.state.isTabSelected ? (
                    <View style={AgentsScreenStyle.tabIndicatorStyle} />
                  ) : (
                    <View style={AgentsScreenStyle.tabWhiteIndicatorStyle} />
                  )}
                </View>
              </TouchableOpacity>
              {(this.state.roleName === Strings.USER_ROLE_AGENCY_OWNER || this.state.roleName===Strings.USER_ROLE_TENANT
                || this.state.roleName=== Strings.USER_ROLE_OWNER) && (
              <TouchableOpacity onPress={() => this.onSavedTabClick()}>
                <View>
                  <View style={AgentsScreenStyle.tabTextViewStyle}>
                    <Text
                      style={
                        this.state.isTabSelected == false
                          ? AgentsScreenStyle.tabLabelTextStyle
                          : AgentsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      {Strings.MY_AGENTS}
                    </Text>
                  </View>
                  {this.state.isTabSelected == false ? (
                    <View style={AgentsScreenStyle.tabIndicatorStyle} />
                  ) : (
                    <View style={AgentsScreenStyle.tabWhiteIndicatorStyle} />
                  )}
                </View>
              </TouchableOpacity>
              )} 
            </View>
          </ScrollView>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={CommonStyles.flatListStyle}>
          {this.state.isFilter ? <FilterScreen /> : null}
          {this.state.agentListData.length > 0 ? (
            <FlatList
              contentContainerStyle={CommonStyles.flatListStyle}
              data={this.state.agentListData}
              renderItem={({item,index})=>this.renderItem(item,index)}
              extraData={this.state}
            />
          ) : this.props.agentsScreenReducer.isScreenLoading ? null : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                marginTop: window.height * 0.25
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  justifyContent: "center",
                  textAlign: "center",
                  color: Colors.LIGHT_GRAY_TEXT_COLOR
                }}
              >
                {Strings.NO_AGENT_FOUND}
              </Text>
            </View>
          )}
        </ScrollView>
        {this.props.agentsScreenReducer.isScreenLoading ? (
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
    agentsScreenReducer: state.agentsScreenReducer,
    filterReducer: state.filterReducer
  };
}

export default connect(
  mapStateToProps,
  {
    updateAgentList,
    getAllAgentList,
    getAllAgentListWithiInAgency,
    showLoading,
    resetState,
    getDeleteAgent
  }
)(AgentssScreen);
