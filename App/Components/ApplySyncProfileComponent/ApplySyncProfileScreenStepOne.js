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
import DatePicker from 'react-native-datepicker'
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import ApplySyncProfileScreenStyle from './ApplySyncProfileScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import APICaller from '../../Saga/APICaller';
let propertyType = [

    { value: 'House' }, { value: 'Town house' }, { value: 'Unit' },
    { value: 'Apartment' }, { value: 'Vila' }, { value: 'Land' }
];
let propertyCategory = [

    { value: 'Sale' }, { value: 'Rental' }
];
let leasYears = [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
    { value: '6' },
    { value: '7' },
    { value: '8' },
    { value: '9' },
    { value: '10' }
]
let leasMonths = [
    { value: '0' },
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
    { value: '6' },
    { value: '7' },
    { value: '8' },
    { value: '9' },
    { value: '10' },
    { value: '11' },
    { value: '12' }
]
class ApplySyncProfileScreenStepOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyAdd: '',
            ownerData: [],
            applicantData: [],
            errorMsg: '',
            errorOnTextField: '',
            isTypeAdreesManual: false,
            roleName: '',


            applyCommenceDate: '',
            applyLeaseYear: '',
            applyLeaseMonth: '',
            applyWeeklyRent: '',
            applyMonthlyRent: '',
            applyBond: '',
            applyDescription: '',

            applyPropertyAddress: '',
            applyPropertyType: '',
            applyTotalBedroom: '',
            applyPropertyId: '',
            applyAgencyName: '',
            applyManagerName: '',
            applyManagerEmail: '',

            propertyDetails: []

        };

    }
    componentDidMount() {
        
        if (global.isEdit) {
            this.setState({
                applyCommenceDate: global.propertyDetail.preferred_comm_date,
                applyLeaseYear: global.propertyDetail.preferred_length_of_lease_years,
                applyLeaseMonth: global.propertyDetail.preferred_length_of_lease_months,
                applyWeeklyRent: global.propertyDetail.weekly_rent,
                applyMonthlyRent: global.propertyDetail.monthly_rent,
                applyBond: global.propertyDetail.bond,
                applyDescription: global.propertyDetail.why_propery_is_right_for_u,

                applyPropertyAddress: global.propertyDetail.propertyDetail.address,
                applyPropertyType: global.propertyDetail.property_type,
                applyTotalBedroom: global.propertyDetail.propertyDetail.number_bedroom,
                applyPropertyId: global.propertyDetail.property_id,
                applyAgencyName: global.propertyDetail.agency_name,
                applyManagerName: global.propertyDetail.property_manager_name,
                applyManagerEmail: global.propertyDetail.property_manager_email,
            })
        }
        else {
            if (this.props.propertyDetail.created_by_agency_id) {
                var agency_name = this.props.propertyDetail.created_by_agency_id.name
            }
            this.setState({
                applyPropertyType: this.props.propertyDetail.property_type,
                applyTotalBedroom: String(this.props.propertyDetail.number_bedroom),
                applyAgencyName: agency_name,
                applyManagerName: this.props.propertyDetail.created_by.firstname + ' ' + this.props.propertyDetail.created_by.lastname,
                applyManagerEmail: this.props.propertyDetail.created_by.email,
                applyPropertyAddress: this.props.propertyDetail.address
            })
            AsyncStorage.getItem("roleId").then((roleId) => {
                if (roleId) {
                    AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                        if (value) {
                            var userData = JSON.parse(value);
                            var authToken = userData.token;
                            postData = {
                                roleId: roleId,
                                userId: userData.data._id
                            }
                            APICaller('getUserDetails', 'POST', authToken, postData
                            ).then(data => {
                                
                                this.setState({ applicantData: data.data })
                            })

                        }
                    }).done();
                }
            }).done();
        }
    }
    callProceedToStepTwo() {
        let arr = {
            propertyAddress: this.state.applyPropertyAddress,

            property_type: this.props.propertyDetail.property_type,
            property_id: this.props.propertyDetail._id,
            preferred_comm_date: this.state.applyCommenceDate,
            preferred_length_of_lease_years: this.state.applyLeaseYear,
            preferred_length_of_lease_months: this.state.applyLeaseMonth,
            weekly_rent: this.state.applyWeeklyRent,
            monthly_rent: this.state.applyMonthlyRent,
            bond: this.state.applyBond,
            why_propery_is_right_for_u: this.state.applyDescription,
            agency_name: this.state.applyAgencyName,
            property_manager_name: this.state.applyManagerName,
            property_manager_email: this.state.applyManagerEmail,
            applicantData: this.state.applicantData,
            propertyDetail: this.props.propertyDetail
        }
        if (this.state.applyCommenceDate == '') {
            this.setState({ errorOnTextField: 1, errorMsg: 'Please select commence date' })
        }
        else if (this.state.applyLeaseYear == '') {
            this.setState({ errorOnTextField: 2, errorMsg: 'Please select preferred lenth of lease lease years' })
        }
        // else if (this.state.applyLeaseMonth == '') {
        //     this.setState({ errorOnTextField: 2, errorMsg: 'Please select preferred lenth of lease lease years' })
        //     // this.setState({errorOnTextField:3, errorMsg:'Please select lease months'})
        // }
        else if (this.state.applyWeeklyRent == '') {
            this.setState({ errorOnTextField: 3, errorMsg: 'Please enter weekly rent' })
        }
        else if (this.state.applyMonthlyRent == '') {
            this.setState({ errorOnTextField: 4, errorMsg: 'Please enter monthly rent' })
        }
        else if (this.state.applyBond == '') {
            this.setState({ errorOnTextField: 5, errorMsg: 'Please enter bond' })
        }
        // else if (this.state.applyDescription == '') {
        //     this.setState({ errorOnTextField: 6, errorMsg: 'Please enter why this property right for you' })
        // }
        else {
            Actions.ApplySyncProfileScreenStepTwo({ screenOneDetails: arr });
        }
    }

    componentWillReceiveProps(nextProps) {

    }
    componentDidUpdate() {


    }

    componentWillUnmount() {

    }

    componentWillMount() {


    }

    closeAddProperty() {
        Actions.popTo('Dashboard');
    }
    callSaveAsDraft() {

        let propertyData = {
            applyCommenceDate: this.state.applyCommenceDate,
            applyLeaseYear: this.state.applyLeaseYear,
            applyLeaseMonth: this.state.applyLeaseMonth,
            applyWeeklyRent: this.state.applyWeeklyRent,
            applyMonthlyRent: this.state.applyMonthlyRent,
            applyBond: this.state.applyBond,
            applyDescription: this.state.applyDescription,


            applyPropertyAddress: this.state.applyPropertyAddress,
            applyPropertyType: this.state.applyPropertyType,
            applyTotalBedroom: this.state.applyTotalBedroom,
            applyPropertyId: this.state.applyPropertyId,
            applyAgencyName: this.state.applyAgencyName,
            applyManagerName: this.state.applyManagerName,
            applyManagerEmail: this.state.applyManagerEmail,
        }

    }
    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });

            }
        }).done();
    }

    onPropertyNameChange(text) {
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>Apply with Ownly</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View >
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ApplySyncProfileScreenStyle.scrollViewContainerStyle}>
                    <View>
                        <View style={{
                            backgroundColor: 'white',
                            shadowColor: '#000',
                            borderBottomColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
                            borderBottomWidth: 1,
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View>
                                <Text style={{ color: '#d1d1d1', padding: 5, fontSize: 16 }}>You are applying for the property</Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: '600', fontSize: 17 }}>{this.state.applyPropertyAddress}</Text>
                            </View>
                        </View>
                        <View style={ApplySyncProfileScreenStyle.headerContainer}>
                            <View style={ApplySyncProfileScreenStyle.dotContainer}>
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                            </View>
                        </View>



                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE', paddingBottom: 30 }}>
                            <Text style={{ color: 'black', fontSize: 25, fontWeight: '300' }}>Property Details</Text>
                        </View>
                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>

                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Application Address
                            </Text>
                            <View style={{ marginTop: 10, marginBottom: 25, }}>
                                <Text style={{ fontSize: 18, fontWeight: '300' }}>
                                    {this.state.applyPropertyAddress}
                                </Text>
                            </View>
                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Type of Property
                            </Text>
                            <TextInput
                                // placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyPropertyType}
                                editable={false}
                            // placeholder={'House'}
                            />


                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                No of Bedrooms
                            </Text>

                            <TextInput
                                // placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyTotalBedroom}
                                // value={'Ray White Manningham'}
                                editable={false}
                            // placeholder={'3'}
                            />


                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Preferred Commencement Date
                            </Text>
                            <View style={ApplySyncProfileScreenStyle.searchViewStyle}>
                                <DatePicker
                                    style={ApplySyncProfileScreenStyle.datePickerStyle}
                                    mode="date"
                                    placeholder="DD/MM/YY"
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
                                    date={this.state.applyCommenceDate}
                                    onDateChange={(date) => { this.setState({ applyCommenceDate: date, errorMsg: '' }) }}
                                />
                            </View>
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }

                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Preferred Lenght Of Lease
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                <Dropdown
                                    label=''
                                    labelHeight={5}
                                    fontSize={14}
                                    baseColor={Colors.WHITE}
                                    containerStyle={[ApplySyncProfileScreenStyle.dropDownViewStyle, { flex: 0.45 }]}
                                    data={leasYears}
                                    placeholder={'Select No of Years'}
                                    onChangeText={(text) => {
                                        this.setState({ applyLeaseYear: text, errorMsg: '' })
                                    }}
                                    value={this.state.applyLeaseYear}
                                />
                                <Dropdown
                                    label=''
                                    labelHeight={5}
                                    placeholder={'Select No of Months'}
                                    fontSize={14}
                                    baseColor={Colors.WHITE}
                                    containerStyle={[ApplySyncProfileScreenStyle.dropDownViewStyle, { flex: 0.45 }]}
                                    data={leasMonths}
                                    onChangeText={(text) => {
                                        this.setState({ applyLeaseMonth: text, errorMsg: '' })
                                    }}
                                    value={this.state.applyLeaseMonth}
                                />
                            </View>

                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }



                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Weekly Rent
                            </Text>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                keyboardType={'number-pad'}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyWeeklyRent}
                                onChangeText={(text) => {
                                    
                                    let monthly = (Number(text) * (52/ 12)).toFixed(2)
                                    let bond = Number(text) * 4
                                    this.setState({ applyWeeklyRent: text, applyMonthlyRent: monthly.toString(), applyBond: bond.toString(), errorMsg: '' })
                                    
                                }}
                                placeholder={'$'}
                            />

                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }



                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Monthly Rent
                            </Text>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyMonthlyRent}
                                keyboardType={'number-pad'}
                                onChangeText={(text) => {
                                    this.setState({ applyMonthlyRent: text, errorMsg: '' })
                                }}
                                placeholder={'$'}
                            />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }



                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Bond
                            </Text>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                keyboardType={'number-pad'}
                                value={this.state.applyBond}
                                onChangeText={(text) => {
                                    this.setState({ applyBond: text, errorMsg: '' })
                                }}
                                placeholder={'$'}
                            />

                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }


                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Why this property is right for you
                            </Text>
                            <TextInput style={ApplySyncProfileScreenStyle.inputDescriptionTextStyle}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({ applyDescription: text, errorMsg: '' })
                                }}
                                value={this.state.applyDescription}
                            />

                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 6 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }





                        </View>


                        <View style={{ height: 25, backgroundColor: '#F8F9FE' }}></View>
                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>

                            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: '300' }}>Property Manager Details</Text>

                            </View>

                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Agency Name
                            </Text>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyAgencyName}
                                editable={false}
                            />

                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Property Manager Name
                            </Text>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyManagerName}
                                editable={false}
                            />

                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Property Manager Email Address
                            </Text>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={ApplySyncProfileScreenStyle.searchTextInputStyle}
                                value={this.state.applyManagerEmail}
                                editable={false}
                            />

                        </View>




                    </View>
                </KeyboardAwareScrollView>
                <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>

                    {/* <TouchableOpacity onPress={() => this.callProceedToStepTwo()}>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                    </TouchableOpacity> */}


                    <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                        <View style={ApplySyncProfileScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callProceedToStepTwo()}>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {

                    false ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null

                }

            </View>
        );
    }
}

export default ApplySyncProfileScreenStepOne;

