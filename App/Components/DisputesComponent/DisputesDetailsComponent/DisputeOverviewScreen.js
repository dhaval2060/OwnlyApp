import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    Button,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import DisputeOverviewScreenStyle from './DisputeOverviewScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import DisputesScreenStyle from '../DisputesScreenStyle';
import Moment from 'moment';
import {
    updateDisputeStatusById,
    getDisputesDetails,
} from "../../../Action/ActionCreators";
import { EventRegister } from 'react-native-event-listeners'
let ref;
class DisputeOverviewScreen extends Component {
    constructor() {
        super();
        this.state = {
            isShowMore: false,
            starCount: 3.5,
            roleName: '',
            agreementDetailData: {},
        };
        this.getRoleName()
        ref = this;
    }


    componentDidUpdate() {
        this.onDisputeUpdateSuccess()
        this.onGetDisputeSuccess()
    }
    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });

            }
        }).done();
    }
    componentWillMount() {
        this.setState({ agreementDetailData: this.props.agreementDetail });
        // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
        //     if (value) {
        //         var userData = JSON.parse(value);
        //         var authToken = userData.token;
        //         var postData = {
        //             dispute_id: this.state.agreementDetailData._id,
        //             status: 1
        //         };
        
        //         this.props.updateDisputeStatusById(authToken, postData);
        //     }
        // }).done();
        
    }
    onGetDisputeSuccess() {
        if (this.props.disputesDetailsReducer.disputeDetailsRes != []) {
            if (this.props.disputesDetailsReducer.disputeDetailsRes.code == 200)
                
            this.setState({ agreementDetailData: this.props.disputesDetailsReducer.disputeDetailsRes.data })
        }
    }
    onDisputeUpdateSuccess() {
        
        if (this.props.disputesDetailsReducer.updateDisputeStatus) {
            if (this.props.disputesDetailsReducer.updateDisputeStatus.code == 200) {
                
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        
                        var authToken = userData.token;
                        var postData = {
                            disputeId: this.state.agreementDetailData._id,
                        }
                        this.props.getDisputesDetails(authToken, postData);
                    }
                }).done();
            }
        }
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    callResolved(val) {
        
        
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    dispute_id: this.state.agreementDetailData._id,
                    status: val
                };
                
                this.props.updateDisputeStatusById(authToken, postData);
                EventRegister.emit('disputeUpdate', postData)
            }
        }).done();

    }
    maintenanceRequestRenderItem({ item, index }) {

        return (

            <CardViewWithLowMargin>
                <View style={DisputeOverviewScreenStyle.maintenanceListHeaderContainer}>
                    <View style={DisputeOverviewScreenStyle.statusContainerStyle}>
                        <View style={DisputeOverviewScreenStyle.maintenanceStatusViewStyle}>
                            <Text style={DisputeOverviewScreenStyle.statusViewTextStyle}>COMPELTED</Text>
                        </View>
                    </View>
                    <Image source={ImagePath.USER_DEFAULT} style={DisputeOverviewScreenStyle.maintenaceUserImageStyle} />
                    <View style={DisputeOverviewScreenStyle.statusContainerStyle}>
                        <Text style={DisputeOverviewScreenStyle.dollarTextStyle}>$77</Text>
                        <Text style={DisputeOverviewScreenStyle.daysTextStyle}>in 7 days</Text>
                    </View>
                </View>
                <View style={DisputeOverviewScreenStyle.detailContainerStyle}>
                    <View style={DisputeOverviewScreenStyle.maintenanceDetailTitleContainerStyle}>
                        <Text style={DisputeOverviewScreenStyle.maintenanceDetailTitleTextStyle}>Faucet not running water</Text>
                        <Image source={ImagePath.RED_NOTIFICATION} style={DisputeOverviewScreenStyle.notificatioImageStyle} />
                    </View>
                    <Text style={DisputeOverviewScreenStyle.maintenanceDetailTextStyle}>Request ID : 100923824</Text>
                    <Text style={DisputeOverviewScreenStyle.maintenanceDetailTextStyle}>Category name</Text>
                </View>
            </CardViewWithLowMargin>
        );

    }


    fileRenderItem({ item, index }) {
        var path = API.MAINTENANCE_IMAGE_PATH + item.path;
        
        return (
            <View style={DisputeOverviewScreenStyle.listContainerStyle}>

                <View style={DisputeOverviewScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: path }} style={DisputeOverviewScreenStyle.userImageStyle} />
                </View>

                <View style={{ justifyContent: 'center', }}>
                    <View style={DisputeOverviewScreenStyle.detailTitleContainerStyle}>
                        <Text style={DisputeOverviewScreenStyle.detailTitleTextStyle}>{item.path}</Text>
                        <Image source={ImagePath.BLUE_HEART} style={DisputeOverviewScreenStyle.listImageStyle} />
                        <Image source={ImagePath.DOTS_ICON} style={DisputeOverviewScreenStyle.listImageStyle} />
                    </View>

                </View>

            </View>
        );
    }

    watcherRenderItem({ item, index }) {

        return (
            <View style={DisputeOverviewScreenStyle.listContainerStyle}>

                <View style={DisputeOverviewScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: item.url }} style={DisputeOverviewScreenStyle.watcherImageStyle} />
                </View>

                <View style={DisputeOverviewScreenStyle.detailTitleContainerStyle}>
                    <Text style={DisputeOverviewScreenStyle.watcherTitleTextStyle}>{item.name}</Text>

                    <Image source={ImagePath.DOTS_ICON} style={DisputeOverviewScreenStyle.listImageStyle} />
                </View>


            </View>
        );
    }

    showHideMore() {
        if (this.state.isShowMore == false) {
            this.setState({ isShowMore: true });
        }
        else {
            this.setState({ isShowMore: false });
        }

    }

    render() {
        
        var message = this.state.agreementDetailData ? this.state.agreementDetailData.message : '';
        var address = this.state.agreementDetailData ? this.state.agreementDetailData.property_id.address : '';
        var description = this.state.agreementDetailData ? this.state.agreementDetailData.property_id.description : '';
        var propertyImages = this.state.agreementDetailData ? (this.state.agreementDetailData.property_id.image.length > 0 ? this.state.agreementDetailData.property_id.image : []) : [];
        var image = propertyImages.length > 0 ? API.PROPERTY_IMAGE_PATH + propertyImages[0].path : '';
        
        return (
            <ScrollView>

                {/* <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Highlights</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={DisputeOverviewScreenStyle.highlightViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Tenancy Start date</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>July 30, 2017</Text>
                            </View>

                            <View style={DisputeOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Tenancy length</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>5 years</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={DisputeOverviewScreenStyle.highlightViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Rental Case validity</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>July 30, 2017</Text>
                            </View>

                            <View style={DisputeOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Payment frequency</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>Monthly</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={DisputeOverviewScreenStyle.highlightViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Contact for Lease Renewal</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueRedTextStyle}>1 month</Text>
                            </View>

                            <View style={DisputeOverviewScreenStyle.highlightValueViewContainer}>
                                <Text style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>Rent per week</Text>
                                <Text style={DisputeOverviewScreenStyle.highlightValueTextStyle}>$2500</Text>
                            </View>
                        </View>

                    </CardViewWithLowMargin>
                </View> */}


                <View>
                    <CardViewWithLowMargin>
                        {/* <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Agreement details</Text> */}
                        <Text numberOfLines={(this.state.isShowMore == false) ? 6 : null} style={DisputeOverviewScreenStyle.aboutRequestDetailTextStyle}>
                            {message}
                        </Text>

                        {/* <TouchableOpacity onPress={this.showHideMore.bind(this)}>
                            <Text style={DisputeOverviewScreenStyle.loadMoreTextStyle}>
                                {(this.state.isShowMore == false) ? 'Show more' : 'Show less'}
                            </Text>
                        </TouchableOpacity> */}


                    </CardViewWithLowMargin>
                </View>


                {/* <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Maintenance requests</Text>
                        <View style={DisputeOverviewScreenStyle.tileListContainerStyle} >

                            <FlatList
                                horizontal={false}
                                data={listData}
                                renderItem={this.maintenanceRequestRenderItem}
                                extraData={this.state}
                            />

                        </View>
                    </CardViewWithLowMargin>
                </View> */}

                {/* <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.fileTitleTextStyle}>Files Attached</Text>
                        <View style={DisputeOverviewScreenStyle.tileListContainerStyle} >

                            <FlatList
                                horizontal={false}
                                data={listData}
                                renderItem={this.fileRenderItem}
                                extraData={this.state}
                            />

                        </View>
                    </CardViewWithLowMargin>
                </View> */}

                {this.state.agreementDetailData.dispute_status == 2 &&
                    <View style={[DisputesScreenStyle.statusAcceptedViewStyle, { alignSelf: 'flex-end', margin: 10, marginBottom: 5 }]}>
                        <Text style={DisputesScreenStyle.statusViewTextStyle}>Resolved</Text>
                    </View>
                }
                {this.state.agreementDetailData.dispute_status == 3 &&
                    <View style={[DisputesScreenStyle.statusBookViewStyle, { alignSelf: 'flex-end', margin: 10, marginBottom: 5 }]}>
                        {/* <Text style={DisputesScreenStyle.statusViewTextStyle}>Not made to any decision</Text> */}
                        <Text style={DisputesScreenStyle.statusViewTextStyle}>Closed</Text>
                    </View>
                }
                <View>
                    <CardViewWithLowMargin>
                        <Image source={{ uri: image }} style={DisputeOverviewScreenStyle.disputesImageViewStyle} />
                        <View style={DisputeOverviewScreenStyle.disputesTitleViewStyle}>
                            <Text numberOfLines={2} style={DisputeOverviewScreenStyle.disputesTitleTextStyle}>{address}</Text>
                        </View>
                        <View style={DisputeOverviewScreenStyle.disputesSubTitleViewStyle}>
                            {/* <Text style={DisputeOverviewScreenStyle.disputesSubTitleTextStyle}>Property ID : 10098273</Text> */}

                            <Text numberOfLines={2} style={DisputeOverviewScreenStyle.disputesSubTitleTextStyle}>{description}</Text>
                        </View>
                    </CardViewWithLowMargin>
                </View>


                {/* <View>
                    <CardViewWithLowMargin>
                        <Text style={DisputeOverviewScreenStyle.titleTextStyle}>Watcher</Text>
                        <View style={DisputeOverviewScreenStyle.tileListContainerStyle} >
                            {
                                listData ?
                                    <FlatList
                                        horizontal={false}
                                        data={listData}
                                        renderItem={this.watcherRenderItem}
                                        extraData={this.state}
                                    /> : null
                            }
                        </View>
                    </CardViewWithLowMargin>
                </View> */}
                

                {(this.state.agreementDetailData.dispute_status == 1 && this.state.roleName == Strings.USER_ROLE_AGENT) ?
                    <View style={DisputeOverviewScreenStyle.buttonContainerStyle} >
                        <TouchableOpacity onPress={() => this.callResolved(2)}>
                            <View style={DisputeOverviewScreenStyle.roundedTransparentDraftButtonStyle}>
                                <Text style={DisputeOverviewScreenStyle.draftButtonTextStyle}>
                                    Resolved
                                    </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.callResolved(3)}>
                            <View style={DisputeOverviewScreenStyle.roundedTransparentDraftButtonStyle}>
                                <Text style={DisputeOverviewScreenStyle.draftButtonTextStyle}>
                                    Not Resolved
                                    </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    : null}

            </ScrollView>

        );
    }
}
function mapStateToProps(state) {
    
    return {
        disputesDetailsReducer: state.disputesDetailsReducer
    }
}
export default connect(
    mapStateToProps,
    {
        updateDisputeStatusById,
        getDisputesDetails
    }

)(DisputeOverviewScreen);

