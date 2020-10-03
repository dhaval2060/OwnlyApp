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
import moment from 'moment';
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
import CheckBox from 'react-native-checkbox';

let propertyType = [

    { value: 'House' }, { value: 'Town house' }, { value: 'Unit' },
    { value: 'Apartment' }, { value: 'Vila' }, { value: 'Land' }
];
let inspectionData = [
    { value: 'I have not yet inspected this property', status: true }, { value: 'Yes, I have inspected this property', status: false }
]
let propertyCategory = [

    { value: 'Sale' }, { value: 'Rental' }
];

class DisplayApplySyncProfileScreenStepSix extends Component {
    constructor() {
        super();
        this.state = {
            propertyAdd: '',
            ownerData: [],
            errorMsg: '',
            errorOnTextField: '',
            isTypeAdreesManual: false,
            roleName: '',
            termsPolicy: '',
            propertyAddress: '',
            inspection_status: false,
            inspection_date: '',
            access_tenancy_db: '',
            agencyName: ''

        };
        
    }

    componentWillMount() {
        this.setState({ propertyAddress: this.props.propertyDetail.propertyDetail.propertyAddress })
        this.setState({
            inspection_status: this.props.propertyDetail.inspection_status,
            inspection_date: this.props.propertyDetail.inspection_date,
            termsPolicy: true,
            access_tenancy_db: this.props.propertyDetail.access_tenancy_db,
            agencyName: this.props.propertyDetail.agency_name
        })

    }

    closeAddProperty() {
        Actions.popTo('Dashboard');
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });

            }
        }).done();
    }
    callProceedToStepSeven() {
        Actions.DisplayApplySyncProfileScreenStepSeven({ propertyDetail: this.props.propertyDetail });
    }

    onPropertyNameChange(text) {

    }

    onPropertyCountryChange(text) {


    }

    onPropertyTypeChange(text) {


    }

    onPropertyCategoryChange(text) {


    }

    onPropertyOwnerChange(text) {


    }

    onPropertyAddressChange(text) {


    }

    onPropertyDescChange(text) {


    }
    callGetPropertyOwner() {


    }

    onGetPropertyOwnerSuccess() {


    }

    preparePropertyOwnerDropdownData(ownerData) {

        var tempArray = ownerData;
        tempArray.map((data, index) => {

            tempArray[index].value = tempArray[index].firstname + ' ' + tempArray[index].lastname;
            tempArray[index].id = tempArray[index]._id;
        })
        
        return tempArray;
    }


    callAddOwnerScreen() {
        Actions.AddOwnerScreen();
    }

    callSavePropertyApi() {




    }

    onSavePropertySuccess() {

    }
    callBack() {

        Actions.pop();
    }
    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>Apply with Ownly</Text>
                <TouchableOpacity onPress={() => this.callBack()} style={CommonStyles.navBackRightImageView}>

                    <View >
                        <Image source={ImagePath.HEADER_BACK} />
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View >
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    callSaveAsDraft() {
        this.callSavePropertyApi();
    }

    setAddressInputType() {


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
                                <Text style={{ color: '#d1d1d1', padding: 5, fontSize: 16 }}>Applicant applying for the property</Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: '600', fontSize: 17 }}>{this.state.propertyAddress}</Text>
                            </View>
                        </View>
                        <View style={ApplySyncProfileScreenStyle.headerContainer}>
                            <View style={ApplySyncProfileScreenStyle.dotContainer}>
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                                <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
                            </View>

                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE', paddingBottom: 30 }}>
                            <Text style={{ color: 'black', fontSize: 25, fontWeight: '300' }}>Declaration</Text>
                        </View>

                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: '300' }}>Property Inspection</Text>
                            </View>
                            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                                Have you inspected this property?
                            </Text>
                            <View style={[ApplySyncProfileScreenStyle.dropDownViewStyle, { justifyContent: 'center', paddingLeft: 10 }]}>
                                {this.state.inspection_status ?
                                    <Text>Yes, I have inspected this property</Text> :
                                    <Text>I have not yet inspected this property</Text>
                                }
                            </View>

                        {!this.state.inspection_status ?
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingTop: 25 }}>
                                {this.state.agencyName} requires you to inspect the property before applying. If you have not already inspect the property click here to book inspection.
                        </Text>

                            <Text style={[ApplySyncProfileScreenStyle.labelStyle, { paddingTop: 12 }]}>
                                Preferred Commencement Date
                            </Text>
                            <View style={[ApplySyncProfileScreenStyle.dropDownViewStyle, { justifyContent: 'center', paddingLeft: 10 }]}>
                                <Text>{moment(this.state.inspection_date).format("MMM DD YYYY")}</Text>
                        </View>
                            </View>
                        :null}
                        </View>
                        <View style={{ height: 25, backgroundColor: '#F8F9FE' }}></View>
                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: '300' }}>Terms and Conditions</Text>
                            </View>
                            <View style={{ padding: 15, borderRadius: 5, borderColor: '#ccc', borderWidth: 1, shadowOpacity: 0.8, shadowColor: "#ccc", shadowRadius: 2, backgroundColor: Colors.WHITE, shadowOpacity: 0.5, shadowOffset: { height: 2, width: 0 } }}>
                                <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Privacy & Tenant Declaration</Text>
                                <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>1. Privacy - 1form</Text>
                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Current Application : </Text>
                                    1form collects the information you have entered into our system and discloses it to the real estate agent/manager (or their inspection scheduling service provider) for the current applcation (and may so same for furure applications).
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Future Application : </Text>
                                    1form may also use your personal information to promote the services of 1form, its related parties and selected third parties
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Other user(s) and disclosure(s): </Text>
                                    1form's Collection Statement and Privacy Policy further explains how 1form collects, uses and discloses personal information and how to access, correct or complain about the handling of personal information.
                                </Text>

                            </View>
                            <View style={{ justifyContent: 'center', margin: 25, alignItems: 'center' }}>
                                <Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 16 }}>Tenancy Privacy Statement / Collection</Text>
                                <Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 16 }}>Notice & Tenant Declaration</Text>
                            </View>

                            <View style={{ flexDirection: 'row', paddingLeft: 4, padding: 15, backgroundColor: 'white', flex: 1 }}>
                                <View style={{ flex: 0.15, padding: 10 }}>
                                    <CheckBox
                                        label={''}
                                        labelStyle={[ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle, { padding: 10, fontSize: 16 }]}
                                        checked={this.state.termsPolicy}
                                        checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                        uncheckedImage={ImagePath.UNCHECK}
                                    />
                                </View>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingBottom: 20 }}>
                                        By ticking this box I acknowlegde that I have Read, Understood and Agree with the above Tenancy Privacy Statement / Collection Notice & Tenant Declaration and I authorise the use of the image above to represent my digital signature for the purpose of this application
                                </Text>
                                </View>
                            </View>
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                        </View>
                        <View style={{ height: 25, backgroundColor: '#F8F9FE' }}></View>
                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: '300' }}>Tenancy Database</Text>
                                <View style={{ padding: 15 }}>
                                    <Text style={{ fontSize: 16 }}>Equifax's National Tenancy Database</Text>
                                    <Text style={{ fontSize: 16 }}>1300 563 826</Text>
                                    <Text style={{ fontSize: 16 }}>www.tenancydatabase.com.au</Text>
                                </View>

                                <View style={{ padding: 15 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>TICA</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>1902 220 346</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>www.tica.com.au</Text>
                                </View>


                                <View style={{ padding: 15 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>RP DATA</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>1300 734 318</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>www.rpdata.com</Text>
                                </View>

                                <View style={{ padding: 15 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>BARCLAY MIS</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>1300 883 916</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>www.barclaymis.com.au</Text>
                                </View>

                                <View style={{ padding: 15 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>TRA</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>02 9363 9244</Text>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>www.tradingreference.com</Text>
                                </View>

                                <View style={{ flexDirection: 'row', paddingLeft: 4, padding: 15, backgroundColor: 'white', flex: 1 }}>
                                    <View style={{ flex: 0.15, padding: 10 }}>
                                        <CheckBox
                                            label={''}
                                            labelStyle={[ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle, { padding: 10, fontSize: 16 }]}
                                            checked={this.state.access_tenancy_db}
                                            checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                            uncheckedImage={ImagePath.UNCHECK}

                                        />
                                    </View>
                                    <View style={{ flex: 0.9 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingBottom: 20 }}>
                                            I confirm that I have been notified of the tenancy Database contact details & the reasons for use.
                                </Text>
                                    </View>
                                </View>
                                {
                                    this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                }
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={() => this.callProceedToStepSeven()}>
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

            </View >
        );
    }
}
function mapStateToProps(state) {
    
    return {
        addPropertyReducer: state.addPropertyReducer
    }
}

export default DisplayApplySyncProfileScreenStepSix;

