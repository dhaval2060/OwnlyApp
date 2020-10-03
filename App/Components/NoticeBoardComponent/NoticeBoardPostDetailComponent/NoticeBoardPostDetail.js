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
import NoticeBoardPostDetailStyle from './NoticeBoardPostDetailStyle';
//import listData from  '../../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../../Constants/APIUrls';
import { CardView } from '../../CommonComponent/CardView';
import * as Progress from "react-native-progress";
import {

    getNoticePostDetails,
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "../../HomeComponent/HomeScreenAction";
const window = Dimensions.get('window');
let ref;
class NoticeBoardPostDetail extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: true,
            showLoader:true,
            noticeBoardPostDetailData: [],
            isShowPopup: false,
            roleName: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onNoticeBoardPostDetailListSuccess();
        this.onDeleteNoticeboardSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getRoleName();
        this.callGetNoticeBoardPostDetailList();
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });
            }
        }).done();
    }    

  
    onDiscoverTabClick() {

        this.setState({ isTabSelected: true });
    }

    onLinksTabClick() {

        this.setState({ isTabSelected: false });
    }
    onRefresh=()=>{
        this.setState({showLoader:true})
        this.callGetNoticeBoardPostDetailList()
    }
    callGetNoticeBoardPostDetailList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token; 
                this.props.showLoading();
                this.props.getNoticePostDetails(authToken, this.props.noticeBoardPostId);
            }

        }).done();

    }

    onNoticeBoardPostDetailListSuccess() {

        if (this.props.noticeBoardReducer.noticeBardPostDetailRes != '') {
            if (this.props.noticeBoardReducer.noticeBardPostDetailRes.code == 200) {
                
                this.setState({ noticeBoardPostDetailData: this.props.noticeBoardReducer.noticeBardPostDetailRes.data, showLoader:false });
            }
            else {

                this.setState({showLoader:false });
                alert(this.props.noticeBoardReducer.noticeBardPostDetailRes.message);
            }
            this.props.resetState();
        }
    }

    onDeleteNoticeboardSuccess(){
        if (this.props.noticeBoardReducer.noticePostDeleteRes != '') {
            if (this.props.noticeBoardReducer.noticePostDeleteRes.code == 200) {
                this.callGetNoticeBoardPostDetailList();
            }
            else {

                alert(this.props.noticeBoardReducer.noticePostDeleteRes.message);
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

    // onPost() {
    //     this.setState({ isShowPopup: false });
        
    //     Actions.NoiticeBoardAddPostScreen({ noticeBoardId: this.props.noticeBoardId,assignedRoles:this.state.noticeBoardDetailListData.length > 0?this.state.noticeBoardDetailListData[0].assign_to_roles:[] });
    // }

    onEdit() {
        
        this.setState({ isShowPopup: false }); 
        Actions.EditNoticeBoardPost({ noticePostDetails:this.state.noticeBoardPostDetailData, onRefresh:()=>this.onRefresh()});
    }

    onBackPress() {
        Actions.pop();
    }

    navBar() {

        return (
            <View style={NoticeBoardPostDetailStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.onBackPress()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{padding:20,paddingLeft:20}}>
                    <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>
                {this.state.roleName == Strings.USER_ROLE_STRATA_PRINCIPLE || this.state.roleName == Strings.USER_ROLE_STRATA_STAFF ?
                <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={NoticeBoardPostDetailStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity>
                : null
                } 

                {
                    (this.state.isShowPopup) ?
                        <Modal  onRequestClose={() => { }} transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={NoticeBoardPostDetailStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={NoticeBoardPostDetailStyle.modalContainerStyles}>

                                        <TouchableOpacity style={{ marginTop: 10,marginBottom:20 }} onPress={this.onEdit.bind(this)}>

                                            <View style={NoticeBoardPostDetailStyle.roundedTransparentButtonStyle}>
                                                <Text style={NoticeBoardPostDetailStyle.grayButtonTextStyle}>
                                                    {Strings.EDIT}
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

            <Image source={{ uri: item.url }} style={NoticeBoardPostDetailStyle.userListImageStyle} />
        );
    }

    renderItem({ item, index }) {


        return (

          
            <View style={NoticeBoardPostDetailStyle.serachListItemContainer} >
                
                <Text style={NoticeBoardPostDetailStyle.searchListItemTextStyle}>{item.role_id?item.role_id.description:''}</Text>
                
            </View>
         
        );
    }

    render() {

        return (

            <View style={CommonStyles.listMainContainerStyle}>
                <View >

                    <Image source={ImagePath.HEADER_BG} style={NoticeBoardPostDetailStyle.topCoverImageContainer} />
                  
                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.noticeBoardPostDetailData.title}</Text>
                        {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID :</Text>
                            </View>

                          
                        </View> */}
                    </View>
                    {this.navBar()}

                </View>

                {/*  <View style={NoticeBoardPostDetailStyle.refineResultContainerStyle}>
                    <View>
                        <Text style={NoticeBoardPostDetailStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                        <View style={NoticeBoardPostDetailStyle.refineResultBottomBarStyle} />
                    </View>

                    <Image source={ImagePath.ARROW_DOWN} style={NoticeBoardPostDetailStyle.refineResultArrowStyle} />
                </View>
                 <View style={NoticeBoardPostDetailStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onDiscoverTabClick()} >
                        <View style={NoticeBoardPostDetailStyle.tabTextViewContainerStyle}>
                            <View style={NoticeBoardPostDetailStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected) ? NoticeBoardPostDetailStyle.tabLabelTextStyle : NoticeBoardPostDetailStyle.tabLabelDiselectTextStyle}>All</Text>
                            </View>
                            {this.state.isTabSelected ? <View style={NoticeBoardPostDetailStyle.tabIndicatorStyle}></View> : null}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onLinksTabClick()}>
                        <View>
                            <View style={NoticeBoardPostDetailStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == false) ? NoticeBoardPostDetailStyle.tabLabelTextStyle : NoticeBoardPostDetailStyle.tabLabelDiselectTextStyle}>Favorites</Text>
                            </View>
                            {(this.state.isTabSelected == false) ? <View style={NoticeBoardPostDetailStyle.tabIndicatorStyle}></View> : null}
                        </View>
                    </TouchableOpacity>

                </View> */}


                {
                    /* <Dropdown
                         label=''
                         labelHeight={5}
                         fontSize={14}
                         baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                         containerStyle={NoticeBoardPostDetailStyle.dropDownViewStyle}
                         data={data}
                         value={data[0].value}
                     />*/

                }

              
                {               <ScrollView>
                                <View style={{padding:20}}>
                                    <Text style={{fontSize:14}}>
                                        {'Agenda: '+this.state.noticeBoardPostDetailData.agenda_resolution}
                                    </Text>

                                    <Text style={{fontSize:14,marginTop:10}}>
                                        {this.state.noticeBoardPostDetailData.description}
                                    </Text>

                                    <Text style={{fontSize:14,marginTop:10}}>
                                        {this.state.noticeBoardPostDetailData.message}
                                    </Text>
                                </View>
                                <FlatList contentContainerStyle={{paddingBottom:70,paddingLeft:20}}

                                    data={this.state.noticeBoardPostDetailData.assign_to_roles}
                                    extraData={this.state}
                                    horizontal={true}
                                    renderItem={this.renderItem}
                                /> 

                                </ScrollView>
                              
                       
                       
                }

                {this.state.showLoader ? (
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
        getNoticePostDetails,
        showLoading,
        resetState,
    }

)(NoticeBoardPostDetail);



