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
    AsyncStorage
} from 'react-native';
import {

    filterProperty,

} from "../../Action/ActionCreators";

import {
    callResetPropertyList,
    propertyTypeChanged,
    stateChanged,
    showLoading,
    resetState,
    cityChanged,

} from "./FilterAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import FilterScreenStyle from './FilterScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-checkbox';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Progress from 'react-native-progress';
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';
let propertyType = [  {value: 'House'},{ value: 'Town house'}, {value: 'Unit'}, 
{value: 'Apartment'}, {value: 'Vila'}, {value: 'Land'}];

var errorMsg = [];

class FilterScreen extends Component {
    constructor() {
        super();
        this.state = {
            searchTitle:''
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
    componentWillMount() {

    }


    onStateChange(text) {

        this.props.stateChanged(text);
    }

    onCityChange(text) {

        this.props.cityChanged(text);
    }
    onPropertyTypeChange(text) {

        this.props.propertyTypeChanged(text);

    }

    onTitleChange(text) {

       this.setState({searchTitle:text});

    }

    
    callClearFilter() {
        this.setState({searchTitle:''});
        this.setState({ date: '' });
        this.props.resetState();
        this.props.callResetPropertyList('Yes');
    }

    callFilterApi() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                var postData = {
                    property_type: this.props.filterReducer.propertyType,
                    city: this.props.filterReducer.cityChangeText,
                    state: this.props.filterReducer.stateChangeText,
                    created: this.state.date!=''?Moment(this.state.date).format():'',
                    login_id:userData.data._id,
                    title:this.state.searchTitle
                }
                if (this.props.filterReducer.propertyType == 'Select property type'&&this.props.filterReducer.cityChangeText==''
                    &&this.props.filterReducer.stateChangeText==''&&this.props.filterReducer.stateChangeText==''
                    &&this.state.date==''&&this.state.searchTitle==''
                ) {
                    alert(Strings.PROPERTY_SEARCH_VALIDATION_MESSAGE);
                } else {
                    this.props.showLoading();
                    
                    this.props.filterProperty(authToken, postData);
                }
            }
        }).done();
        this.setState({ date: '' })
    }


    render() {

        return (
            <View style={FilterScreenStyle.scrollViewContainerStyle}>

                <View style={FilterScreenStyle.addPropertyInputContainer}>

                    {
                        /*<Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={FilterScreenStyle.dropDownViewStyle}
                            data={ownerData}
                            value={ownerData[0].value}
    
                        />
    
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={FilterScreenStyle.dropDownViewStyle}
                            data={propertyType}
                            value={propertyType[0].value}
                        />*/
                    }


                    <View style={FilterScreenStyle.searchViewStyle}>
                        <Image source={ImagePath.SEARCH_ICON} style={FilterScreenStyle.searchImageStyle} />
                        <TextInput
                            placeholder={Strings.PROPERTY_FILTER_PLACE_HOLDER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={FilterScreenStyle.searchTextInputStyle}
                            onChangeText={this.onTitleChange.bind(this)}
                            value={this.state.searchTitle}
                            />
                    </View>

                    <Text style={FilterScreenStyle.labelStyle}>
                        {Strings.STATE_PROVINANCE}
                    </Text>

                    <View style={FilterScreenStyle.stateViewStyle}>
                        <TextInput

                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={FilterScreenStyle.stateTextInputStyle}
                            onChangeText={this.onStateChange.bind(this)}
                            value={this.props.filterReducer.stateChangeText}

                        />
                    </View>
                    <Text style={FilterScreenStyle.labelStyle}>
                        {Strings.CITY}
                    </Text>

                    <View style={FilterScreenStyle.stateViewStyle}>
                        <TextInput

                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={FilterScreenStyle.stateTextInputStyle}
                            onChangeText={this.onCityChange.bind(this)}
                            value={this.props.filterReducer.cityChangeText}

                        />
                    </View>
                    <Text style={FilterScreenStyle.labelStyle}>
                        {Strings.PROPERTY_TYPE}
                    </Text>

                    <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.WHITE}
                        containerStyle={FilterScreenStyle.dropDownViewStyle}
                        data={propertyType}
                        onChangeText={this.onPropertyTypeChange.bind(this)}
                        value={this.props.filterReducer.propertyType}
                    />
                    <Text style={FilterScreenStyle.labelStyle}>
                        {Strings.DATE_ADDED}
                    </Text>

                    <View style={FilterScreenStyle.stateViewStyle}>
                        <DatePicker
                            style={FilterScreenStyle.datePickerStyle}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            format='MMM DD YYYY'
                            minDate={this.state.minDate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 0,
                                    position: 'absolute',
                                    left: 5,
                                    borderBottomWidth: 0,
                                    borderLeftWidth: 0,
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                }
                                // ... You can check the source to find the other keys. 
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                    </View>

                    <View style={FilterScreenStyle.buttonContainerStyle}>

                        <TouchableOpacity onPress={() => this.callClearFilter()}>
                            <Text style={FilterScreenStyle.clearFiltersLabelStyle}>
                                {Strings.CLEAR_FILTERS}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.callFilterApi()}>
                            <View style={FilterScreenStyle.roundedBlueProceedButtonStyle}>
                                <Text style={FilterScreenStyle.proceedButtonTextStyle}>
                                    {Strings.SUBMIT}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {

                    this.props.filterReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null

                }
                <Toast ref="toast"
                    position='bottom'
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        filterReducer: state.filterReducer
    }
}

export default connect(
    mapStateToProps,
    {
       
        propertyTypeChanged,
        filterProperty,
        stateChanged,
        showLoading,
        resetState,
        cityChanged,
        callResetPropertyList

    }

)(FilterScreen);



