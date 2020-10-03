import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    FlatList,
    AsyncStorage,
    Modal
} from 'react-native';

import {
    deleteAgreement,
    getAgreementDetail,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    updateAgreementOverview

} from "./AgreementDetailsAction";

import {
  
    updateAgreementData

} from "../EditAgreementComponent/EditAgreementAction";

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AgreementDetailsScreenStyle from './AgreementDetailsScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import AgreementOverviewScreen from './AgreementOverviewScreen';
import GeneralCommunicationScreen from './GeneralCommunicationComponent/GeneralCommunicationScreen';
import StarRating from 'react-native-star-rating';
import Moment from 'moment';
import * as Progress from 'react-native-progress';
let ref;

class AgreementDetailsScreen extends Component {

    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 0,
            starCount: 3.5,
            agreementData: [],
            isShowPopup:false
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.editAgreementReducer.isAgreementUpdate!=''){
            this.callGetAgreementDetail(this.props.agreementId);
            this.props.updateAgreementData('');
           
            //this.props.updateAgreementOverview('updateOverviewScreen');
        }
    }

    componentDidUpdate() {
        this.onGetAgreementDetailSuccess();
        this.onDeleteAgreementSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {

        this.callGetAgreementDetail(this.props.agreementId);
    }

    closeNotifications() {
        Actions.pop();
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }


    callDeleteAgreement(id) {
        this.setState({isShowPopup:false});
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.deleteAgreement(authToken, id);
            }
        }).done();
    }

    onDeleteAgreementSuccess() {

        if (this.props.agreementDetailsReducer.deleteAgreement != '') {

            if (this.props.agreementDetailsReducer.deleteAgreement.code == 200) {

                alert(Strings.DELETE_AGREEMENT_MSG);
                Actions.pop();
            }
            else {

                alert(this.props.agreementDetailsReducer.deleteAgreement.message);
            }
            this.props.resetState();
        }
    }


    callGetAgreementDetail(id) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getAgreementDetail(authToken, id);
            }
        }).done();
    }

    onGetAgreementDetailSuccess() {

        if (this.props.agreementDetailsReducer.agreementDetailRes != '') {

            if (this.props.agreementDetailsReducer.agreementDetailRes.code == 200) {
                this.setState({ agreementData: this.props.agreementDetailsReducer.agreementDetailRes.data });
                this.setState({ isTabSelected: 1 });
            }
            else {

                alert(this.props.agreementDetailsReducer.agreementDetailRes.message);
            }
            this.props.resetState();
        }
    }

    onEditAgreementClick() {

        this.setState({isShowPopup:false});
        this.setState({ isTabSelected: 0 });
        Actions.EditAgreementScreen({agreementData: this.state.agreementData});
    }

    navBar() {
        return (
            <View style={AgreementDetailsScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{padding:20,paddingLeft:20}}>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={AgreementDetailsScreenStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity>

                {
                            (this.state.isShowPopup)?

                                
                                    <Modal transparent >
                                        <TouchableOpacity onPress={this.showPopup.bind(this)} style={AgreementDetailsScreenStyle.modalContainer}>
                                            <View style={{flex:1, justifyContent: 'center',
                                                alignItems: 'center'}}>
                                                <View style={AgreementDetailsScreenStyle.modalContainerStyles}>
                                                    <TouchableOpacity onPress={() => this.onEditAgreementClick()} style={{marginTop:10}}>
                    
                                                        <View style={AgreementDetailsScreenStyle.roundedBlueEditPropertyButtonStyle}>
                                                            <Text style={AgreementDetailsScreenStyle.editPropertyButtonTextStyle}>
                                                                {Strings.EDIT_AGREEMENT}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                
                                                    <TouchableOpacity style={{marginBottom:20}} onPress={this.callDeleteAgreement.bind(this,this.props.agreementId)}>
                                                        <View style={AgreementDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                            <Text style={AgreementDetailsScreenStyle.editPropertyButtonSkyBlueTextStyle}>
                                                                {Strings.DELETE_AGREEMENT}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </TouchableOpacity>   
                                    </Modal>
                                           
                               
                            :null
                        }

            </View>
        );
    }

    showPopup(){
        
        if(this.state.isShowPopup==false){
            
            this.setState({isShowPopup:true});
        }
        else{
            
            this.setState({isShowPopup:false});
        }
    }

    showAgreementOverviewScreen(){

        return(
            <View>
            {

                (this.state.agreementData.length > 0)?
                    <AgreementOverviewScreen agreementDetail = {this.state.agreementData} />
                    :null
            }
            </View>
        );
    }
   

    render() {
        
      
        var PropertyData={};
        {
            this.state.agreementData.length>0
            ?
            PropertyData=this.state.agreementData[0].propertyData?this.state.agreementData[0].propertyData:{}
            :
            {}
        }
        
        return (

            <View style={AgreementDetailsScreenStyle.profileContainer}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={AgreementDetailsScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{PropertyData.property_id?PropertyData.property_id.address:''}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>           
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                 <Image source={ImagePath.CALENDAR_ICON} style={{justifyContent: 'center' }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 5 }}>{Moment(PropertyData.property_id?PropertyData.property_id.created:'').format(Strings.DATE_FORMATE)}</Text>
                            </View>
                        </View>
                    </View>
                    {this.navBar()}

                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={AgreementDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={AgreementDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={AgreementDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? AgreementDetailsScreenStyle.tabLabelTextStyle : AgreementDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={AgreementDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={AgreementDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={AgreementDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? AgreementDetailsScreenStyle.tabLabelTextStyle : AgreementDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.GENERAL_COMMUNICATION}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={AgreementDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={AgreementDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </View>
                {(this.state.isTabSelected == 1) ?
                    this.showAgreementOverviewScreen()
                    : null}

                {(this.state.isTabSelected == 2) ?
                    <GeneralCommunicationScreen agreementDetail = {this.state.agreementData}/>
                    : null}

                {

                    this.props.agreementDetailsReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null

                }
            </View>

        );
    }
}
//agreementDetailsReducer
function mapStateToProps(state) {
    
    return {
        agreementDetailsReducer: state.agreementDetailsReducer,
        editAgreementReducer: state.editAgreementReducer
    }
}

export default connect(
    mapStateToProps,
    {
        deleteAgreement,
        getAgreementDetail,
        showLoading,
        resetState,
        updateAgreementData,
        updateAgreementOverview
    }

)(AgreementDetailsScreen);


