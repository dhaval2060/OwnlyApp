import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import NotificationsScreenStyle from './NotificationsScreenStyle';
import { CardViewWithLowMargin } from '../CommonComponent/CardViewWithLowMargin';
import API from '../../Constants/APIUrls';
import Moment from 'moment';
import * as Progress from 'react-native-progress';
import {
    getNotificationList,
} from "../../Action/ActionCreators";
import {
    showLoading,
    resetState,
} from "./NotificationScreenAction";
import APICaller from '../../Saga/APICaller';
import COLORS from '../../Constants/Colors';
import { RefreshControl } from 'react-native';
let ref;
let loggedUserInfo ='';
class NotificationsScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            notificationListData: [],
            roleName:'',

        };
    }
    componentDidUpdate() {
        this.onNotificationListSuccess();
    }

    componentWillMount() {
        this.callNotificationList();
        this.getRoleName();
        AsyncStorage.getItem("SyncittUserInfo").then(value => {
            if(value){
                loggedUserInfo = JSON.parse(value);
            }
        }).done();
    }
    getRoleName() {
		AsyncStorage.getItem(Strings.USER_ROLE_NAME).then(async(value) => {
			if (value) {
				await this.setState({ roleName: value });
			}
		}).done();
	}
    callNotificationList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;
                postdata = {
                    user_id: userData.data._id,
                };
                this.props.showLoading();
                this.props.getNotificationList(authToken, postdata);
            }
        }).done();
    }

    onNotificationListSuccess() {
        if (this.props.notificationScreenReducer.notificationListResponse != '') {
            if (this.props.notificationScreenReducer.notificationListResponse.code == 200) {
                this.setState({ notificationListData: this.props.notificationScreenReducer.notificationListResponse.data });
                let counter = 0;
                this.props.notificationScreenReducer.notificationListResponse.data.map((item) => {
                    if(item.to_users[0].is_read === false){
                        counter = counter + 1;
                    }
                })
                global.notificationcounter = counter;
            }else {
                alert(this.props.notificationScreenReducer.notificationListResponse.message);
            }
            this.props.resetState();
        }
    }

    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    navBar() {
        return (
            <View style={CommonStyles.navBarMainView}>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NOTIFICATIONS}</Text>
                <TouchableOpacity onPress={() => this.closeNotifications()} style={CommonStyles.navRightImageView}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
                </TouchableOpacity>
            </View>
        );
    }

    _notificationManageAPI = (item,type,type_id)=>{
        let params = {
            notification_type: type,
            notification_type_id: type_id,
            user_id: loggedUserInfo.data._id,
        }
        console.log(params,loggedUserInfo.token);
        APICaller('markNotificationAsRead', 'POST', loggedUserInfo.token, params).then(data => {
            if (data.code == 200) {
                console.log('dataNotification',data);
                if (item.module == 1) {
                    console.log('TENANTS_PROFILES',item.from_user._id);
                    Actions.TenantsProfile({ user_id: item.from_user._id, averageRating: '0', totalReviewLengthrating: '0' });        
                } else if (item.module == 2) {
                    console.log('MAINTAINANCE_DETAILS',item.maintenence_id);
                    this.state.roleName == Strings.USER_ROLE_TRADER ? 
                    Actions.TradersMaintenanceRequestDetailsScreen({ reqId: item.maintenence_id, maintenanceData: item }) :
                    Actions.MaintenanceRequestDetailsScreen({ reqId: item.maintenence_id, maintenanceData: item });        
                } else if (item.module == 3) {
                    console.log('AGREEMENT_DETAILS',item.agreement_id);
                    Actions.AgreementDetailsScreen({ agreementId: item.agreement_id });        
                } else if (item.module == 4) {
                    console.log('DISPUTES_DETAILS',item.dispute_id)
                    Actions.DisputesDetailsScreen({ reqId: item.dispute_id });          
                } else if (item.module == 6) {
                    console.log('NOTICEBOARD_SCREEN',item.noticeboard_id);
                    Actions.NoticeBoardDetailScreen({ noticeBoardId: item.noticeboard_id});            
                } else if (item.module == 8) {
                    console.log('PROPERTIES_DETAILS',item.application_id);
                    // Actions.PropertiesDetailsScreen({ propertyId: application_id });
                    // $location.path('/view_application/' + item.application_id);
                    // $rootScope.navBarOptionSelected = 'Properties';
                    // $localStorage.userData.routeState = 'Properties';
                }
            this.callNotificationList();
            }
        });
    }

    _notificationManage = (item) =>{
        console.log('Notification',item);
        if (item.module == 1) {
            this._notificationManageAPI(item,'tenants',item.from_user._id);
        } else if (item.module == 2) {
            this._notificationManageAPI(item,'maintenance',item.maintenence_id);
        } else if (item.module == 3) {
            this._notificationManageAPI(item,'agreements',item.agreement_id);
        } else if (item.module == 4) {
            this._notificationManageAPI(item,'dispute',item.dispute_id);
        } else if (item.module == 6) {
            this._notificationManageAPI(item,'noticeboard',item.noticeboard_id);
        } else if (item.module == 8) {
            this._notificationManageAPI(item,'application',item.application_id);
        }
    }
    renderItem = ({ item, index }) => {
        var userImagePath = item.from_user.image ? API.USER_IMAGE_PATH + item.from_user.image : '';
        var firstName = item.from_user.firstname ? item.from_user.firstname : '';
        var lastName = item.from_user.lastname ? item.from_user.lastname : '';
        return (
            <TouchableOpacity onPress={()=>this._notificationManage(item)} >
                <View style={[NotificationsScreenStyle.notificationlistcontainerStyles,{backgroundColor:item.to_users[0].is_read === true?COLORS.WHITE:COLORS.GRAY}]}>
                    <View style={NotificationsScreenStyle.listContainerStyle}>

                        <View style={NotificationsScreenStyle.imageContainerStyle}>

                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={NotificationsScreenStyle.userImageStyle} />
                                    :
                                    <View style={NotificationsScreenStyle.emptyUserListImageStyle}>
                                        <Text style={NotificationsScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                        </View>
                        <View >
                            <View style={NotificationsScreenStyle.detailTitleContainerStyle}>
                                <Text style={NotificationsScreenStyle.detailTitleTextStyle}>{item.subject}</Text>
                                <Text style={NotificationsScreenStyle.messageTimeTextStyle}>{Moment(item.createdAt).fromNow()}</Text>

                            </View>
                            <Text style={NotificationsScreenStyle.detailTextStyle}>{item.message}</Text>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View>
                {this.navBar()}

                <View style={NotificationsScreenStyle.searchViewStyle} />


                {/* {
                    this.state.notificationListData.length > 0 ? */}
                <FlatList contentContainerStyle={{ paddingBottom: 150 }}
                    data={this.state.notificationListData}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    // refreshControl={
                    //     <RefreshControl
                    //       refreshing={this.props.notificationScreenReducer.isScreenLoading}
                    //       onRefresh={() => this.callNotificationList()}
                    //     />
                    //   }
                />
                {/* : */}
                {/* <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.25 }}> */}
                {/* <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}> */}
                {/* {Strings.NO_DATA_FOUND}</Text> */}
                {/* </View> */}
                {/* } */}

                {

                    this.props.notificationScreenReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null

                }
            </View>
        );
    }
}

function mapStateToProps(state) {

    return {
        notificationScreenReducer: state.notificationScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getNotificationList,
        showLoading,
        resetState,
    }

)(NotificationsScreen);
