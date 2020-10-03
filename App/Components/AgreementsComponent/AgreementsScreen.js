
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
    Dimensions
} from 'react-native';

import {
    getAgreementList,


} from "../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    updateAgreementList
} from "./AgreementsAction";

import {
  
    updateAgreementData

} from "./EditAgreementComponent/EditAgreementAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import AgreementsScreenStyle from './AgreementsScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import Moment from 'moment';
import FilterScreen from '../FilterComponent/FilterScreen';
const window = Dimensions.get('window');

let ref;
class AgreementsScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            agreementsListData: [],
            isFilter: false,
        };
    }

    componentWillReceiveProps(nextProps) {
   
        
        if(nextProps.agreementsReducer.updateAgreementList!=''&&nextProps.agreementsReducer.updateAgreementList!=undefined){
            this.callGetAgreements();
            this.props.updateAgreementList('');
        }
        if(nextProps.editAgreementReducer.isAgreementUpdate!=''){
            this.callGetAgreements();
            //this.props.updateAgreementData('');
                 
        }
    }

    componentDidUpdate() {
        this.onAgreementsListSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.callGetAgreements();
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    callGetAgreements() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {
                        var postData = {
                            agency_id: userData.data.agency_id,
                            request_by_role: role,
                            created_by: userData.data._id,
                        }
                        this.props.showLoading();
                        console.log('postData',postData);
                        this.props.getAgreementList(authToken, postData);
                    }
                }).done();
            }
        }).done();
    }


    onAgreementsListSuccess() {

        if (this.props.agreementsReducer.agreementsListRes != '') {
            if (this.props.agreementsReducer.agreementsListRes.code == 200) {

                this.setState({ agreementsListData: this.props.agreementsReducer.agreementsListRes.data });

            }
            else {

                alert(this.props.agreementsReducer.agreementsListRes.message);
            }
            this.props.resetState();
        }
    }

    ActionToAddAgreementScreen() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var agency_id = userData.data.agency_id;
                if (agency_id == undefined || agency_id == null) {
                    alert(Strings.ERROR_CREATE_AGREEMENT_MESSAGE);
                } else {
                    Actions.AddAgreementScreen();
                }
            }
        }).done();
        
    }




    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.AGREEMENTS}</Text>
                <TouchableOpacity onPress={this.ActionToAddAgreementScreen.bind(this)} style={CommonStyles.navPlusImageView}>
                    <Image source={ImagePath.PLUS_ICON}  />
                </TouchableOpacity>
            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.users_id ? API.USER_IMAGE_PATH + item.users_id.image : '' }} style={AgreementsScreenStyle.userListImageStyle} />
        );
    }
    onMaintenanceItemClick(id) {
        Actions.AgreementDetailsScreen({ agreementId: id });
    }

    renderItem({ item, index }) {
        var propertyImg = [];
        var tenantData = [];
        tenantData = item.tenants;
        propertyImg = item.property_id ? (item.property_id.image ? item.property_id.image : []) : [];
        
        var propertyImagePath = (propertyImg.length > 0 ? API.PROPERTY_IMAGE_PATH + propertyImg[0].path : '');
        return (
            <View style={AgreementsScreenStyle.listMainContainerStyle}>
                <TouchableOpacity onPress={ref.onMaintenanceItemClick.bind(ref, item._id)}>
                    <View style={AgreementsScreenStyle.agreementImageViewStyle}>
                        {
                            propertyImagePath!=''?<Image source={{ uri: propertyImagePath }} style={AgreementsScreenStyle.agreementImageViewStyle} />
                            :
                            <View style={AgreementsScreenStyle.topCoverImageContainer} />
                        }
                        <View style={AgreementsScreenStyle.dateContainerStyle}>
                            <Image source={ImagePath.DATE_ICON} style={AgreementsScreenStyle.dateImageStyle} />
                            <Text style={AgreementsScreenStyle.dateTextStyle}>
                                {Moment(item.case_validity).format(Strings.DATE_FORMATE)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={AgreementsScreenStyle.propertyTitleViewStyle}>
                    <Text numberOfLines={2} style={AgreementsScreenStyle.propertyTitleTextStyle}>{item.property_id ? item.property_id.address : ''}</Text>
                </View>
                <View style={AgreementsScreenStyle.propetySubTitleViewStyle}>
                    <Text numberOfLines={2} style={AgreementsScreenStyle.propertySubTitleTextStyle}>{item.property_id ? item.property_id.description : ''}</Text>
                </View>

                <View style={AgreementsScreenStyle.imageListMainContainerStyle}>
                    <View>
                        <Image source={ImagePath.USER_DEFAULT} style={AgreementsScreenStyle.userImageStyle} />
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={AgreementsScreenStyle.imageListContainerStyle}>
                            {
                                tenantData.map((data, index) => {
                                    return ref.renderImageItem(data, index);
                                })
                            }
                        </View>
                    </ScrollView>

                </View>

                <View style={AgreementsScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={AgreementsScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.DOLLAR_ICON} />
                        <Text style={AgreementsScreenStyle.propertyValueTextStyle}>{item.rent_price}</Text>
                    </View>
                    <View style={AgreementsScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.CALENDAR_ICON} />
                        <Text style={AgreementsScreenStyle.propertyValueTextStyle}>{Moment(item.tenancy_start_date).format(Strings.DATE_FORMATE)}</Text>
                    </View>
                    <View style={AgreementsScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.SEARCH_ICON} />
                        <Text style={AgreementsScreenStyle.propertyValueTextStyle}>{item.rental_period} times</Text>
                    </View>

                </View>
                <Image source={ImagePath.HEART} style={AgreementsScreenStyle.likeImageViewStyle} />
            </View>
        );
    }

    onDrobDownChange(text){
        this.onSortList(text);
     }
     sortBy(key) {
 
         return function (x, y) {
     
             return ((x[key] === y[key]) ? 0 : ((x[key] > y[key]) ? 1 : -1));
     
         };
     
     };
     
 
    onSortList(text){

         
         if(text=='Agreement Id'){
             this.setState({agreementsListData:this.state.agreementsListData.sort(this.sortBy('agreement_id'))});
         }
         else if(text=='Tenancy start Date'){
             this.setState({agreementsListData:this.state.agreementsListData.sort(this.sortBy('tenancy_start_date'))});
         } 
 
         else if(text=='Rent Price'){
             this.setState({agreementsListData:this.state.agreementsListData.sort(this.sortBy('rent_price'))});
         }
        
         
     }


    render() {
        let data = [{
            value: 'Rent Price',
        },
        {
            value: 'Tenancy start Date',
        },
        {
            value: 'Agreement Id',
        }
        ];

        return (
            <View style={AgreementsScreenStyle.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={AgreementsScreenStyle.refineResultContainerStyle}>
                        {/* <View>
                            <Text style={AgreementsScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={AgreementsScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={AgreementsScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={AgreementsScreenStyle.refineResultArrowStyle} />
                        } */}
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                            containerStyle={AgreementsScreenStyle.dropDownViewStyle}
                            data={data}
                            onChangeText={this.onDrobDownChange.bind(this)}
                            value={data[0].value}
                        />
                    </View>
                </TouchableOpacity>
                {/* <View style={AgreementsScreenStyle.tabContainerStyle}>

                    <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={AgreementsScreenStyle.dropDownViewStyle}
                        data={data}
                         value={data[0].value}
                    />

                </View> */}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {/* {this.state.isFilter ?
                        <FilterScreen /> : null
                    } */}


                    {
                        this.state.agreementsListData.length > 0 ?

                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.agreementsListData}
                                renderItem={this.renderItem}
                                extraData={this.state} />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', marginTop:window.height*0.25 }}>
                            <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>
                                {Strings.NO_AGREEMENT_FOUND}</Text>
                            </View>
                           

                    }

                </ScrollView>

            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        agreementsReducer: state.agreementsReducer,
        editAgreementReducer: state.editAgreementReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getAgreementList,
        showLoading,
        resetState,
        updateAgreementList,
        updateAgreementData
    }

)(AgreementsScreen);
