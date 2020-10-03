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
    Modal,
    Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import NoticeBoardDetailScreenStyle from './NoticeBoardDetailScreenStyle';
//import listData from  '../../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../../Constants/APIUrls';
import { CardView } from '../../CommonComponent/CardView';
import {
    deleteNoticeboard,
    deleteNoticeBoardPost,
    getNoticeBoardDetail,
} from "../../../Action/ActionCreators";
import * as Progress from "react-native-progress";

import {


    showLoading,
    resetState,
} from "../../HomeComponent/HomeScreenAction";
const window = Dimensions.get('window');
let ref;
class NoticeBoardDetailScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: true,
            isLoading:true,
            noticeBoardDetailListData: [],
            isShowPopup: false,
            roleName: '',
        };
    }


    componentDidUpdate() {

        this.onNoticeBoardDetailListSuccess();
        this.onNoticePostDeleteSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        
        this.getRoleName();
        this.callGetNoticeBoardDetailList();
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });
            }
        }).done();
    }

    callAddNoticeBoardScreen() {

        Actions.NewNoticeBoardScreen({ noticeBoardId: id });
    }

    onDiscoverTabClick() {

        this.setState({ isTabSelected: true });
    }

    onLinksTabClick() {

        this.setState({ isTabSelected: false });
    }

    callGetNoticeBoardDetailList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var postdata = {};
                var authToken = userData.token;

                postdata = {

                    agency_id: userData.data.agency_id,
                    role_id: userData.data.role_id
                };
                this.props.showLoading();
                
                this.props.getNoticeBoardDetail(authToken, this.props.noticeBoardId);
            }

        }).done();

    }

    onNoticeBoardDetailListSuccess() {

        if (this.props.noticeBoardReducer.noticeBoardDetailListResponse != '') {
            if (this.props.noticeBoardReducer.noticeBoardDetailListResponse.code == 200) {
                
                this.setState({ noticeBoardDetailListData: this.props.noticeBoardReducer.noticeBoardDetailListResponse.data,isLoading:false });
            }
            else {

                alert(this.props.noticeBoardReducer.noticeBoardDetailListResponse.message);
                this.setState({isLoading:false });
            }
            this.props.resetState();
        }
    }

    showPopup() {

        if (this.state.isShowPopup == false) {

            this.setState({ isShowPopup: true });
        }
        else {

            this.setState({ isShowPopup: false });
        }
    }

    onPost() {
        this.setState({ isShowPopup: false });

        Actions.NoiticeBoardAddPostScreen({ onRefresh: () => this.callRefresh(), noticeBoardId: this.props.noticeBoardId, assignedRoles: this.state.noticeBoardDetailListData.length > 0 ? this.state.noticeBoardDetailListData[0].assign_to_roles : [] });
    }
    callRefresh() {
        this.callGetNoticeBoardDetailList();
    }
    onEdit() {
        this.setState({ isShowPopup: false });
        Actions.EditNoticeBoardScreen({ onRefresh: () => this.callRefresh(), noticeDetails: this.state.noticeBoardDetailListData });
    }

    onPostClick(id) {

        Actions.NoticeBoardPostDetail({ noticeBoardPostId: id });
    }

    callDeleteNoticeboard() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.deleteNoticeboard(authToken, this.props.noticeBoardId);
                this.props.onClickRefresh();
                Actions.pop();
            }

        }).done();

    }


    onDeleteNoticeboard() {
        this.callDeleteNoticeboard();
    }

    callDeleteNoticeBoardPost(id) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.deleteNoticeBoardPost(authToken, id);
            }

        }).done();

    }

    onNoticePostDeleteSuccess() {
        
        if (this.props.noticeBoardReducer.noticePostDeleteRes != '') {
            if (this.props.noticeBoardReducer.noticePostDeleteRes.code == 200) {
                
                this.callGetNoticeBoardDetailList();
            }
            else {

                alert(this.props.noticeBoardReducer.noticePostDeleteRes.message);
            }
            this.props.resetState();
        }
    }



    onBackPress() {
        Actions.pop();
    }

    navBar() {

        return (
            <View style={NoticeBoardDetailScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.onBackPress()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{ padding: 20, paddingLeft: 20 }}>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>
                {this.state.roleName == Strings.USER_ROLE_STRATA_PRINCIPLE || this.state.roleName == Strings.USER_ROLE_STRATA_STAFF ?
                    <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                        <View style={NoticeBoardDetailScreenStyle.optionViewStyle} >
                            <Image source={ImagePath.THREE_DOTS_ICON} />
                        </View>
                    </TouchableOpacity>
                    : null
                }

                {
                    (this.state.isShowPopup) ?


                        <Modal onRequestClose={() => { }} transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={NoticeBoardDetailScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={NoticeBoardDetailScreenStyle.modalContainerStyles}>

                                        <TouchableOpacity style={{ marginTop: 10 }} onPress={this.onPost.bind(this)}>

                                            <View style={NoticeBoardDetailScreenStyle.roundedBlueEditPropertyButtonStyle}>
                                                <Text style={NoticeBoardDetailScreenStyle.blueButtonTextStyle}>
                                                    {Strings.NEW_POST}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ marginTop: 10 }} onPress={this.onEdit.bind(this)}>

                                            <View style={NoticeBoardDetailScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={NoticeBoardDetailScreenStyle.grayButtonTextStyle}>
                                                    {Strings.EDIT}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>


                                        <TouchableOpacity style={{ marginBottom: 20 }} onPress={this.onDeleteNoticeboard.bind(this)} >
                                            <View style={NoticeBoardDetailScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={NoticeBoardDetailScreenStyle.redTextStyle}>
                                                    {Strings.DELETE}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal> : null
                }


            </View>
        );
    }



    renderImageItem(item, index) {

        return (

            <Image source={{ uri: item.url }} style={NoticeBoardDetailScreenStyle.userListImageStyle} />
        );
    }

    renderItem = ({ item, index }) => {

        
        return (

            <CardView>
                <TouchableOpacity onPress={ref.onPostClick.bind(ref, item._id)}>
                    <View style={NoticeBoardDetailScreenStyle.listMainContainerStyle}>
                        {this.state.roleName == Strings.USER_ROLE_STRATA_PRINCIPLE || this.state.roleName == Strings.USER_ROLE_STRATA_STAFF ?
                            <TouchableOpacity style={{ marginRight: 10, alignItems: 'flex-end' }} onPress={ref.callDeleteNoticeBoardPost.bind(ref, item._id)}>
                                <View >
                                    <Image source={ImagePath.DELETE_ICON} />
                                </View>
                            </TouchableOpacity>
                            : null
                        }
                        <View style={NoticeBoardDetailScreenStyle.propertyTitleViewStyle}>
                            <Text numberOfLines={2} style={NoticeBoardDetailScreenStyle.propertyTitleTextStyle}>{'Anouncement : ' + item.agenda_resolution}</Text>
                        </View>
                        <View style={NoticeBoardDetailScreenStyle.propetySubTitleViewStyle}>
                            <Text numberOfLines={3} style={NoticeBoardDetailScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                        </View>

                        <View style={NoticeBoardDetailScreenStyle.propertyInfoContainerViewStyle}>

                            { /*<View style={NoticeBoardDetailScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.TENANTS_ICON} />
                            <Text style={NoticeBoardDetailScreenStyle.propertyValueTextStyle}>40 members</Text>
                        </View>*/}

                        </View>
                    </View>
                </TouchableOpacity>
            </CardView>
        );
    }




    render() {

        
        let data = [{
            value: 'By best match',
        }, {
            value: 'By Property Name',
        }];


        return (

            <View style={CommonStyles.listMainContainerStyle}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={NoticeBoardDetailScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.noticeBoardDetailListData.length > 0 ? this.state.noticeBoardDetailListData[0].property_id_arr[0].address : ''}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID :{this.state.noticeBoardDetailListData.length > 0 ? this.state.noticeBoardDetailListData[0].noticeboard_id : ''} </Text>
                            </View>

                            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
                                <Image source={ImagePath.FLAG_ICON} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>25 posts</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
                                <Image source={ImagePath.TENANTS_ICON} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>25 posts</Text>
                            </View> */}
                        </View>
                    </View>
                    {this.navBar()}

                </View>

                {/*  <View style={NoticeBoardDetailScreenStyle.refineResultContainerStyle}>
                    <View>
                        <Text style={NoticeBoardDetailScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                        <View style={NoticeBoardDetailScreenStyle.refineResultBottomBarStyle} />
                    </View>

                    <Image source={ImagePath.ARROW_DOWN} style={NoticeBoardDetailScreenStyle.refineResultArrowStyle} />
                </View>
                 <View style={NoticeBoardDetailScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onDiscoverTabClick()} >
                        <View style={NoticeBoardDetailScreenStyle.tabTextViewContainerStyle}>
                            <View style={NoticeBoardDetailScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected) ? NoticeBoardDetailScreenStyle.tabLabelTextStyle : NoticeBoardDetailScreenStyle.tabLabelDiselectTextStyle}>All</Text>
                            </View>
                            {this.state.isTabSelected ? <View style={NoticeBoardDetailScreenStyle.tabIndicatorStyle}></View> : null}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onLinksTabClick()}>
                        <View>
                            <View style={NoticeBoardDetailScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == false) ? NoticeBoardDetailScreenStyle.tabLabelTextStyle : NoticeBoardDetailScreenStyle.tabLabelDiselectTextStyle}>Favorites</Text>
                            </View>
                            {(this.state.isTabSelected == false) ? <View style={NoticeBoardDetailScreenStyle.tabIndicatorStyle}></View> : null}
                        </View>
                    </TouchableOpacity>

                </View> */}


                {
                    /* <Dropdown
                         label=''
                         labelHeight={5}
                         fontSize={14}
                         baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                         containerStyle={NoticeBoardDetailScreenStyle.dropDownViewStyle}
                         data={data}
                         value={data[0].value}
                     />*/

                }

                {
                    this.state.noticeBoardDetailListData.length > 0 ?
                        this.state.noticeBoardDetailListData[0].noticeboardposts ?
                            this.state.noticeBoardDetailListData[0].noticeboardposts.length > 0 ?
                                <FlatList contentContainerStyle={CommonStyles.flatListStyle}

                                    data={this.state.noticeBoardDetailListData[0].noticeboardposts}
                                    extraData={this.state}
                                    renderItem={this.renderItem}
                                /> :
                                <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.15 }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_DATA_FOUND}</Text>
                                </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.15 }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_DATA_FOUND}</Text>
                            </View>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.15 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_DATA_FOUND}</Text>
                        </View>

                }

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
    }
}

export default connect(
    mapStateToProps,
    {
        getNoticeBoardDetail,
        deleteNoticeBoardPost,
        showLoading,
        resetState,
        deleteNoticeboard,
    }

)(NoticeBoardDetailScreen);



