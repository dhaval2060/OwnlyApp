import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions
} from "react-native";
import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import FilterScreen from "../../FilterComponent/FilterScreen";
import * as Progress from "react-native-progress";
import {
  getAllAgentList,
  getAllAgentListWithiInAgency
} from "../../../Action/ActionCreators";
import { updateAgentList, showLoading, resetState } from "../AgentsScreenAction";
import APICaller from '../../../Saga/APICaller';
import AgentsScreenStyle from "./AgentsScreenStyle";


import API from "../../../Constants/APIUrls";
import StarRating from "react-native-star-rating";
import IMAGEPATH from "../../../Constants/ImagesPath";
const window = Dimensions.get("window");

let ref;
class AgentsListScreen extends Component {
  constructor() {
    super();
    ref = this;
    this.state = {
      isTabSelected: true,
      agentListData: [],
      roleName: "",
      cityData:null,
      isScreenLoading:false,

    };
  }
  componentDidMount(){
    let navData = this.props.navigation.getParam('cityData');
    console.log(navData);
    this.setState({cityData:navData});
    this.APICalled();
  }

  
  APICalled = () => {
    this.setState({isScreenLoading:true});
    setTimeout(() => {
      const city = {city:this.state.cityData};
      console.log('agentsListWithSearch',city);
      APICaller('agentsListWithSearch', 'post', "",city).then(data => {
        this.setState({isScreenLoading:false});
        if (data.code == 200) {
          console.log('DATA',data.data);
          if(data.data.length > 0){
            this.setState({agentListData:data.data});
          }
        }else {
            alert("Something went wrong, Please try again.")
            this.setState({ agentListData:[] })
        }
    }, err => {
      this.setState({ agentListData:[] })
        alert("Something went wrong, Please try again.")
    })      
    }, 1000);
  }
  renderItem({ item, index }) {
    var userImage = item.image
      ? item.image
        ? API.USER_IMAGE_PATH + item.image
        : ""
      : "";
    var agencyLogoImage = item.agency_id
      ? item.agency_id.banner
        ? API.USER_IMAGE_PATH + item.agency_id.banner
        : ""
      : "";
    var firstName = item.firstname ? item.firstname : "";
    var lastName = item.lastname ? item.lastname : "";
    var averageRate = item.averageRate ? item.averageRate : 0;
    var agencyname = item.agency_id?item.agency_id.name:'';
    var totalReviewLength = item.totalReviewLength ? item.totalReviewLength : 0;
    
    return (
      <View style={AgentsScreenStyle.listItemContainer}>
        <View style={AgentsScreenStyle.listImageContainerStyle}>
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
          {item.is_online ? (
            <View style={AgentsScreenStyle.onLineStatusViewStyle} />
          ) : (
            <View style={AgentsScreenStyle.statusViewStyle} />
          )}
        </View>
        <Text style={{fontSize:12,marginTop: 15,color:'gray'}}>
          {'Agent Name'}
        </Text>
        <Text style={AgentsScreenStyle.listTitleTextStyle}>
          {firstName + " " + lastName}
        </Text>
        <Text style={{fontSize:12,marginTop: 10,color:'gray'}}>
          {'Agency Name'}
        </Text>
        <Text style={[AgentsScreenStyle.listTitleTextStyle,{fontSize:14}]}>
          {agencyname}
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
          {"("+totalReviewLength +
            ") " +
            "Reviews"}
        </Text>
        <TouchableOpacity 
          onPress={()=> Actions.SearchedAgentProfileScreen({user_id: item._id,averageRate:averageRate,totalReviewLength:totalReviewLength})}
          style={{marginVertical:15}}
        >
          <View style={AgentsScreenStyle.roundedBlueMessageButtonStyle}>
            <Text style={AgentsScreenStyle.messageButtonTextStyle}>
              {'CONTACT AGENT'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={AgentsScreenStyle.syncittBackgroundContainer}>
        <TouchableOpacity onPress={()=>Actions.pop()} style={{position:'absolute',left:7,top:30,zIndex:99}}>
                <Image
                  source={ImagePath.BACK_ICON}
                />
              </TouchableOpacity>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={CommonStyles.flatListStyle}
          style={{flex:1,width:'90%',marginTop:25}}
        >
          <View>
              <View style={AgentsScreenStyle.syncittLogoContainer1}>
                <Image source={IMAGEPATH.SYNCITTLOGO} style={{ height: 70,width:'100%' }} resizeMode={"contain"} />
              </View>
            <FlatList
              contentContainerStyle={CommonStyles.flatListStyle}
              data={this.state.agentListData}
              renderItem={this.renderItem}
              extraData={this.state}
              ListEmptyComponent={()=>
                this.state.agentListData.length <= 0 ? (
                <View style={{flex: 1,
                  justifyContent: "center",
                  marginTop: window.height * 0.25}}>
                  <Text
                  style={{
                    fontSize: 20,
                    justifyContent: "center",
                    textAlign: "center",
                    color: Colors.LIGHT_GRAY_TEXT_COLOR
                  }}
                >{Strings.NO_AGENT_FOUND}</Text>
                </View>
                ):null
              }
            />
          </View>
        </ScrollView>
        {this.state.isScreenLoading ? (
          <View style={CommonStyles.circles}>
            <Progress.CircleSnail
              color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
            />
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  
  return {
    agentsScreenReducer: state.agentsScreenReducer,
    filterReducer: state.filterReducer,
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
  }
)(AgentsListScreen);
