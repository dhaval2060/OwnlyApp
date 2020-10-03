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

    filterMyFile,

} from "../../Action/ActionCreators";

import {

    fileNameChanged,
    showLoading,
    resetState,
    clearFilter

} from "./MyFileFilterAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MyFileFilterScreenStyle from './MyFileFilterScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-checkbox';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Progress from 'react-native-progress';
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';

let propertyType = [{
    value: 'Sale',
}, {
    value: 'Rental',
}];

var errorMsg = [];

class MyFileFilterScreen extends Component {
    constructor() {
        super();
        this.state = {

        };
    }


    onFileChange(text) {

        this.props.fileNameChanged(text);
    }
  
    callClearFilter() {
        this.props.resetState();
        this.props.clearFilter('true');
    }

    callFilteApi() {
        

        if (this.props.myFileFilterReducer.fileChangeText == ''&&(this.state.date==undefined||this.state.date=='')) {
            alert(Strings.ERROR_SEARCH_VALIDATION);
        } else {
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {

                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;

                    var postData = {
                        created_by: userData.data._id,
                        document_name: this.props.myFileFilterReducer.fileChangeText,
                        
                    }
                        if(this.state.date==undefined&&this.state.date==''){
                            postData.createdDate=Moment(this.state.date).format();
                        }
                        
                        this.props.showLoading();
                        
                        this.props.filterMyFile(authToken, postData);
                
                }
            }).done();
            this.setState({ date: '' })
        }
    }


    render() {

        return (
            <View style={MyFileFilterScreenStyle.scrollViewContainerStyle}>

                <View style={MyFileFilterScreenStyle.addPropertyInputContainer}>

                    {
                        /*<Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={MyFileFilterScreenStyle.dropDownViewStyle}
                            data={ownerData}
                            value={ownerData[0].value}
    
                        />
    
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={MyFileFilterScreenStyle.dropDownViewStyle}
                            data={propertyType}
                            value={propertyType[0].value}
                        />*/
                    }


                    <View style={MyFileFilterScreenStyle.searchViewStyle}>
                        <Image source={ImagePath.SEARCH_ICON} style={MyFileFilterScreenStyle.searchImageStyle} />
                        <TextInput
                            placeholder={Strings.MY_FILE_FILTER_PLACE_HOLDER}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={MyFileFilterScreenStyle.searchTextInputStyle}
                            onChangeText={this.onFileChange.bind(this)}
                            value={this.props.myFileFilterReducer.fileChangeText}
                        />
                    </View>

                    {/* <Text style={MyFileFilterScreenStyle.labelStyle}>
                        {Strings.STATE_PROVINANCE}
                    </Text>

                    <View style={MyFileFilterScreenStyle.stateViewStyle}>
                        <TextInput

                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={MyFileFilterScreenStyle.stateTextInputStyle}
                            onChangeText={this.onStateChange.bind(this)}
                            value={this.props.myFileFilterReducer.stateChangeText}

                        />
                    </View>
                     <Text style={MyFileFilterScreenStyle.labelStyle}>
                        {Strings.CITY}
                    </Text>

                    <View style={MyFileFilterScreenStyle.stateViewStyle}>
                        <TextInput

                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={MyFileFilterScreenStyle.stateTextInputStyle}
                            onChangeText={this.onCityChange.bind(this)}
                            value={this.props.myFileFilterReducer.fileChangeText}

                        />
                    </View>
                    <Text style={MyFileFilterScreenStyle.labelStyle}>
                        {Strings.PROPERTY_TYPE}
                    </Text>

                    <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.WHITE}
                        containerStyle={MyFileFilterScreenStyle.dropDownViewStyle}
                        data={propertyType}
                        onChangeText={this.onPropertyTypeChange.bind(this)}
                        value={this.props.myFileFilterReducer.propertyType}
                    /> */}
                    <Text style={MyFileFilterScreenStyle.labelStyle}>
                        {Strings.DATE}
                    </Text>

                    <View style={MyFileFilterScreenStyle.stateViewStyle}>
                        <DatePicker
                            style={MyFileFilterScreenStyle.datePickerStyle}
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

                    <View style={MyFileFilterScreenStyle.buttonContainerStyle}>

                        <TouchableOpacity onPress={() => this.callClearFilter()}>
                            <Text style={MyFileFilterScreenStyle.clearFiltersLabelStyle}>
                                {Strings.CLEAR_FILTERS}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.callFilteApi()}>
                            <View style={MyFileFilterScreenStyle.roundedBlueProceedButtonStyle}>
                                <Text style={MyFileFilterScreenStyle.proceedButtonTextStyle}>
                                    {Strings.SUBMIT}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    this.props.myFileFilterReducer.isScreenLoading ?
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
        myFileFilterReducer: state.myFileFilterReducer
    }
}

export default connect(
    mapStateToProps,
    {
        filterMyFile,
        fileNameChanged,
        showLoading,
        resetState,
        clearFilter
      

    }

)(MyFileFilterScreen);



