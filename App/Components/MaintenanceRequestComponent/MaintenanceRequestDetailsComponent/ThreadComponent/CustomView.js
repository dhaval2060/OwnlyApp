import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import {
  Linking,
  Platform,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  ImageBackground,
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  AsyncStorage,
  Alert
} from 'react-native';
import MapView from 'react-native-maps';
import MaintenanceRequestScreenStyle from '../../MaintenanceRequestScreenStyle'
import Strings from '../../../../Constants/Strings';
import {
  acceptDeclineProposalRequest,
  confirmDeclineCompleteJob
} from "../../../../Action/ActionCreators";
import { EventRegister } from 'react-native-event-listeners'
import {
  showLoading,
  resetState,
} from "./ChatAction";
import Colors from '../../../../Constants/Colors';
import Lightbox from 'react-native-lightbox';
import * as Progress from 'react-native-progress';

import ThreadScreenStyle from '../ThreadScreenStyle';
import IMAGEPATH from '../../../../Constants/ImagesPath';
import COLORS from '../../../../Constants/Colors';
import { Actions, Router, Reducer, Scene } from 'react-native-router-flux';

class CustomView extends React.Component {

  constructor() {
    super();
    ref = this;
    this.state = {
      userPermission: [],
      loaderValue: [],
      roleName: '',
      imageModalOn: false
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidUpdate() {
    //  this.onAcceptorDeclineSuccess();
    //this.onConfirmDeclineSuccess();
  }

  componentWillUnmount() {

  }

  componentWillMount() {
    
    AsyncStorage.getItem("userPermission").then((value) => {
      if (value) {

        var permission = JSON.parse(value);
        this.setState({ userPermission: permission.data });

      }
    }).done();
    this.getRoleName()
  }

  counterProposal() {
    return (

      <View>
        {/* <View style={ThreadScreenStyle.viewLineStyle} /> */}
        <View style={ThreadScreenStyle.tagViewContainer}>
          <View style={ThreadScreenStyle.viewtagContainerStyle}>
            <Text style={ThreadScreenStyle.viewtextStyle}>{Strings.COUNTER_PROPOSAL}</Text>
          </View>
        </View>
      </View>
    );
  }

  proposalCompleted() {

    return (

      <View>
        {/* <View style={ThreadScreenStyle.viewLineStyle} /> */}
        <View style={ThreadScreenStyle.tagViewContainer}>
          <View style={ThreadScreenStyle.viewtagContainerStyle}>
            <Text style={ThreadScreenStyle.viewtextStyle}>{Strings.COMPLETED}</Text>
          </View>
        </View>
      </View>
    );
  }

  proposalApproved() {
    return (
      <View>
        {/* <View style={ThreadScreenStyle.viewLineStyle} /> */}
        <View style={ThreadScreenStyle.tagViewContainer}>
          <View style={ThreadScreenStyle.viewtagContainerStyle}>
            <Text style={ThreadScreenStyle.viewtextStyle}>{Strings.PROPOSAL_APPROVED}</Text>
          </View>
        </View>
      </View>
    );
  }

  proposalDecline() {
    return (
      <View>
        <View style={ThreadScreenStyle.tagViewContainer}>
          <View style={ThreadScreenStyle.viewtagContainerStyle}>
            <Text style={ThreadScreenStyle.viewtextStyle}>{'Proposal Declined'}</Text>
          </View>
        </View>
      </View>
    );
  }


  callAcceptorDeclineRequest(isAccept, price) {

    AsyncStorage.getItem("SyncittUserInfo").then((value) => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;

        var postData = {
          proposal_id: this.props.currentMessage.location.proposal_id,
          is_proposal_accept: isAccept,
          due_date: isAccept ? this.props.currentMessage.location.proposalData.proposed_date : global.maintenanceData.due_date,
          price: price
        }

        // this.props.showLoading();
        //this.props.currentMessage.location.maintenanceId
        var objMessage = {
          from: userData.data._id,
          to: this.props.currentMessage.location.maintenanceId,
          textMsg: isAccept ? 'Counter Proposal Accepted' : 'Counter Proposal Declined',
          time: new Date(),
          is_status: true,
          maintenanceId: this.props.currentMessage.location.maintenanceId
        }
        // this.props.socket.emit('maintenanceGroupMessageSent', objMessage)

        console.log(this.props, this.state, "sfsfsfsfsf1")
        Actions.pop();
        this.props.acceptDeclineProposalRequest(authToken, postData);
        EventRegister.emit('updateCounter', postData)
      }
    }).done();

  }

  callConfirmDeclineRequest(isAccept) {

    AsyncStorage.getItem("SyncittUserInfo").then((value) => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        var postData = {
          maintenence_id: this.props.currentMessage.location.maintenanceId,
          job_close_confirmation: isAccept
        }

        var objMessage = {
          from: userData.data._id,
          to: this.props.currentMessage.location.maintenanceId,
          textMsg: isAccept ? 'Confirmation Approved' : 'Confirmation Declined',
          time: new Date(),
          is_status: true,
          maintenanceId: this.props.currentMessage.location.maintenanceId
        }


        this.props.socket.emit('maintenanceGroupMessageSent', objMessage)

        this.props.showLoading();
        this.props.confirmDeclineCompleteJob(authToken, postData);
      }
    }).done();

  }


  onAcceptorDeclineSuccess() {

    if (this.props.threadReducer.acceptDeclineProposalRes != '') {
      if (this.props.threadReducer.acceptDeclineProposalRes.code == 200) {



      }
      else {

        //alert(this.props.threadReducer.acceptDeclineProposalRes.message);
      }
    }
    this.props.resetState();
  }

  onConfirmDeclineSuccess() {

    if (this.props.threadReducer.confirmDeclineRes != '') {
      if (this.props.threadReducer.confirmDeclineRes.code == 200) {



      }
      else {

        //alert(this.props.threadReducer.acceptDeclineProposalRes.message);
      }
    }
    this.props.resetState();
  }


  confirmAlertforApproval(isAccept, price) {

    Alert.alert(
      Strings.APP_NAME,
      isAccept == 1 ? Strings.ALERT_MESSAGE_FOR_COUNTER_PROPOSAL_APPROVAL : Strings.ALERT_MESSAGE_FOR_COUNTER_PROPOSAL_DECLINE,
      [
        { text: Strings.YES, onPress: () => this.callAcceptorDeclineRequest(isAccept == 0 ? false : true, price) },
        { text: Strings.NO, onPress: () => { } }
      ],
      { cancelable: false }
    )
  }


  confirmAlert(isAccept) {

    Alert.alert(
      Strings.APP_NAME,
      isAccept == 2 ? Strings.ALERT_MESSAGE_FOR_COMPLETION_APPROVAL : Strings.ALERT_MESSAGE_FOR_COMPLETION_DECLINE,
      [
        { text: Strings.YES, onPress: () => this.callConfirmDeclineRequest(isAccept) },
        { text: Strings.NO, onPress: () => { } }
      ],
      { cancelable: false }
    )
  }


  renderStatusView(item) {
    //1 No confirm 2 confirm 3 decline

    switch (item) {

      case 1:
        return (
          <View style={{ height: 40, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.confirmAlert(2)}  >
                <View style={{ backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, marginHorizontal: 5, borderRadius: 10, top: 6, padding: 3 }}>
                  <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                    Confirm
                </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.confirmAlert(1)} >
                <View style={{ backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, marginHorizontal: 5, borderRadius: 10, top: 6, padding: 3 }}>
                  <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                    Decline
                </Text>
                </View>

              </TouchableOpacity>
            </View>

          </View>

        );
        break;
      case 2:
        return (
          this.proposalCompleted()
        );
        break;
      case 3:
        return (
          this.proposalCompleted()
        );
        break;
      default:

    }

  }



  getRoleName() {

    AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
      if (value) {

        this.setState({ roleName: value });

      }
    }).done();
  }
  renderLine() {
    return (
      <View style={{ width: 350, backgroundColor: 'green', zIndex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{
          // position: 'absolute',
          top: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          width: 150,
          height: 3,
        }} />
        <Text style={{
          // position: 'absolute',
          top: 45,
          margin: 4,
          justifyContent: 'center',
          alignItems: 'center',

        }}>Proposal Sent</Text>
        <View style={{
          // position: 'absolute',
          top: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          width: 150,
          height: 3,
        }} />
        {/* <View style={ThreadScreenStyle.tagViewContainer}> */}
        {/* <View style={{ width: 300, height: 2, backgroundColor: 'red' }} /> */}
        {/* <View style={ThreadScreenStyle.viewtagContainerStyle}>
          <Text style={ThreadScreenStyle.viewtextStyle}>{Strings.PROPOSAL_APPROVED}</Text>
        </View> */}
        {/* </View> */}
      </View>
    )
  }
  render() {
    console.log(this.props, "this.propsthis.propsthis.props")
    var proposal_id = this.props.currentMessage.location !== undefined ? this.props.currentMessage.location.proposal_id : '';
    var proposalData = this.props.currentMessage.location !== undefined ? this.props.currentMessage.location.proposalData : '';
    var isReadData = this.props.currentMessage.location != undefined ? this.props.currentMessage.location.isRead : false;
    var jobConfirm = this.props.currentMessage.location != undefined ? this.props.currentMessage.location.job_confirm : 0;
    var userID = this.props.currentMessage.user != undefined ? this.props.currentMessage.user._id : 0


    if (this.props.currentMessage.location) {
      return (
        // <View style={{ justifyContent: 'space-between' }}>

        <View style={[styles.container, this.props.containerStyle]} >
          {this.props.currentMessage.images && this.props.currentMessage.images.length > 1 &&
            <TouchableOpacity onPress={() => this.setState({ imageModalOn: true })}>
              <Text style={{ marginHorizontal: 10, color: 'blue' }}>View More images</Text>
            </TouchableOpacity>
          }
          {/* <View> */}
          {/* <MapView
            style={[styles.mapView, this.props.mapViewStyle]}
            region={{
              latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude,
              //latitudeDelta: 0.0922,
              //longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          /> */}
          {/* // (this.props.currentMessage.location.message !== '' && !this.state.userPermission.includes('create_property') && this.props.currentMessage.location.message.includes('Counter proposal')) ? */}

          {/* (isReadData == false && this.state.roleName != Strings.USER_ROLE_TENANT) || (isReadData == false && this.props.user._id == this.props.createdBy._id) ? */}
          {/* {(this.props.currentMessage.location.message !== '' && this.state.userPermission.includes('create_maintenance') && (this.props.currentMessage.location.message.includes('Counter proposal')) || this.props.currentMessage.location.message.includes('Counter Proposal')) ? */}
          {(this.props.currentMessage.location.message !== '' && this.state.userPermission.includes('create_maintenance') && proposal_id && userID != global.userId) ?
            (isReadData == false && this.state.roleName != Strings.USER_ROLE_TENANT) ?
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity style={[MaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle, { marginVertical: 20 }]} onPress={() => {


                  let str = this.props.currentMessage.text.split('\n')[2].replace(/[^\d.]/g, '');

                  var price = parseInt(str, 10)
                  this.confirmAlertforApproval(true, price)
                }} >
                  <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                    Approve
                </Text>
                </TouchableOpacity>
                <TouchableOpacity style={MaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle} onPress={() => {
                  str = this.props.currentMessage.text.split('\n')[2].replace(/[^\d.]/g, '');
                  var price = parseInt(str, 10)
                  this.confirmAlertforApproval(false, price)
                }}>
                  <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                    Decline
                </Text>
                </TouchableOpacity>
              </View>
              : (this.state.roleName == Strings.USER_ROLE_TENANT) || (isReadData == false && this.props.user._id == this.props.createdBy._id) ?
                <View>
                  <Text></Text>
                </View>
                : <View>
                  {proposalData.is_proposal_accept ? this.proposalApproved() : this.proposalDecline()}
                </View>
            : null
          }
          {
            (this.props.currentMessage.location.message !== '' && this.props.currentMessage.location.message.includes('Job completed')) ?
              this.renderStatusView(jobConfirm)
              : null

          }
          {/* {(this.props.currentMessage.location.message !== '' && this.props.currentMessage.location.message == 'Sent') &&
            <View style={{ borderBottomColor: 'white', borderBottomWidth: 2, marginTop: 5, marginLeft: 5, marginRight: 5 }}>
              <Text style={{ borderBottomColor: 'white', borderBottomWidth: 2, color: 'white' }}>Proposal Sent</Text>
            </View>
          } */}
          <Modal visible={this.state.imageModalOn} transparent={true} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 5, }}>
              <TouchableOpacity style={{ margin: 15, padding: 5, marginTop: 40, alignSelf: 'flex-start', marginRight: 25 }} hitSlop={{ left: 5, right: 5, top: 5, bottom: 5 }} onPress={() => this.setState({ imageModalOn: false })}>
                <Text style={{ fontSize: 20 }}>Close</Text>
              </TouchableOpacity>
              <ScrollView>

                <FlatList
                  data={this.props.currentMessage.images}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    return (
                      <Lightbox renderContent={() => {
                        return <Image
                          style={{ height: 400 }}
                          source={{ uri: item }}
                          resizeMode={'contain'}
                        />
                      }}>
                        <ImageBackground source={{ uri: item }} onLoadStart={() => {
                          let loaderValue = this.state.loaderValue
                          loaderValue[index] = true
                          this.setState({ loaderValue: loaderValue })
                        }} onLoadEnd={() => {
                          let loaderValue = this.state.loaderValue
                          loaderValue[index] = false

                          this.setState({ loaderValue: loaderValue })
                        }} style={{ height: 200, borderColor: 'grey', borderWidth: 1, borderRadius: 5, margin: 20 }}>
                          {this.state.loaderValue[index] &&
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                              <Progress.CircleSnail color={[COLORS.BLACK, COLORS.BLACK, COLORS.BLACK]} />
                            </View>
                          }

                        </ImageBackground>
                      </Lightbox>
                    )
                  }}
                />
              </ScrollView>
            </View>
          </Modal>
        </View>

        // </View >
        // </View>
      );
    }
    else {
      // return (
      // <View style={[styles.container, this.props.containerStyle]} />
      return null;
      // );
    }
    return null;
  }
}




function mapStateToProps(state) {

  return {
    threadReducer: state.threadReducer
  }
}

export default connect(
  mapStateToProps,
  {
    confirmDeclineCompleteJob,
    acceptDeclineProposalRequest,
    showLoading,
    resetState,
  }

)(CustomView);



const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -45,
    // backgroundColor:'red',
    // paddingBottom:-55,
    // margin:5
    // padding:10,
    zIndex: 1,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
};

CustomView.propTypes = {
  onSend: PropTypes.func,
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
};
