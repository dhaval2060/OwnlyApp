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
    Modal,
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

class ApplySyncProfileScreenStepSix extends Component {
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
            agencyName: '',
            
        };
        
    }


    componentWillMount() {
        this.setState({ propertyAddress: this.props.screenFiveDetails.propertyAddress })
        if (global.isEdit) {
            
            this.setState({
                inspection_status: global.propertyDetail.inspection_status,
                inspection_date: global.propertyDetail.inspection_date,
                termsPolicy: true,
                access_tenancy_db: global.propertyDetail.access_tenancy_db,
                agencyName: global.propertyDetail.agency_name
            })
        }
        else {
            this.setState({
                agencyName: this.props.screenFiveDetails.agency_name
            })
        }
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
        if (this.state.inspection_status != true && this.state.inspection_status != false) {
            this.setState({ errorMsg: 'Please select value', errorOnTextField: 1 })
        }
        else if (this.state.inspection_status == false && this.state.inspection_date == '') {
            this.setState({ errorMsg: 'Please select date', errorOnTextField: 2 })
        }
        else if (this.state.termsPolicy == '') {
            this.setState({ errorMsg: 'Please accept tenancy policy', errorOnTextField: 3 })
        }
        else if (this.state.access_tenancy_db == '') {
            this.setState({ errorMsg: 'Please confirm database access', errorOnTextField: 4 })
        }
        else {
            let screenFiveDetails = this.props.screenFiveDetails
            screenFiveDetails['inspection_status'] = this.state.inspection_status ? true : false;
            screenFiveDetails['inspection_date'] = this.state.inspection_date;
            screenFiveDetails['access_tenancy_db'] = this.state.access_tenancy_db;

            Actions.ApplySyncProfileScreenStepSeven({ screenSixDetails: screenFiveDetails });

        }

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
                                <Text style={{ color: '#d1d1d1', padding: 5, fontSize: 16 }}>You are applying for the property</Text>
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
                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={ApplySyncProfileScreenStyle.dropDownViewStyle}
                                data={inspectionData}
                                value={this.state.inspection_status ? 'Yes, I have inspected this property' : 'I have not yet inspected this property'}
                                placeholder={'Select Value'}
                                onChangeText={(val) => {
                                    if (val == 'I have not yet inspected this property') {
                                        this.setState({ errorMsg: '', inspection_status: false })
                                    }
                                    else {
                                        this.setState({ errorMsg: '', inspection_status: true, inspection_date: '' })
                                    }
                                }}

                            />

                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                            <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, paddingTop: 25 }}>
                                {this.state.agencyName} requires you to inspect the property before applying. If you have not already inspect the property click here to book inspection.
                        </Text>
                            {this.state.inspection_status == false &&
                                <View>
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
                                            date={this.state.inspection_date}
                                            onDateChange={(date) => { this.setState({ errorMsg: '', inspection_date: date }) }}
                                        />
                                    </View>
                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }
                                </View>

                            }
                        </View>
                        <View style={{ height: 25, backgroundColor: '#F8F9FE' }}></View>
                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: '300' }}>Terms and Conditions</Text>
                            </View>
                            <View style={{ padding: 15, borderRadius: 5, borderColor: '#ccc', borderWidth: 1, shadowOpacity: 0.8, shadowColor: "#ccc", shadowRadius: 2, backgroundColor: Colors.WHITE, shadowOpacity: 0.5, shadowOffset: { height: 2, width: 0 } }}>
                                <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Privacy & Tenant Declaration</Text>
                                <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>1. Privacy - PropertyComm</Text>
                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, textAlign:'justify', paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Current application : </Text>
                                    PropertyComm collects the information you have entered into our system and discloses it to the real estate agent/manager (or their inspection scheduling service provider) for the current application (and may so the same for future applications).
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Future applications : </Text>
                                    PropertyComm may also use your personal information to promote the services of PropertyComm, its related parties and selected third parties.
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Other use(s) and disclosure(s) : </Text>
                                    PropertyComm's Collection Statement and Privacy Policy further explains how PropertyComm collects, uses and discloses personal information and how to access, correct or complain about the handling of personal information.
                                </Text>


                                <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>2. Privacy - agent/manager</Text>
                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Assessing your application : </Text>
                                    The agent/ manager may also use or disclose your personal information to:
                                    <Text style={{padding:5}}>{"\n"}(a) assess your application information (e.g. contacting the landlord, your referees, etc.);</Text>
                                    <Text style={{padding:5}}>{"\n"}(b) assess your tenancy history (e.g. contacting bond authorities, financial institutions, tenancy databases, etc.);</Text>
                                    <Text style={{padding:5}}>{"\n"}(c) schedule your inspections (e.g. contacting scheduling providers);</Text>
                                    <Text style={{padding:5}}>{"\n"}(d) document and register your lease (e.g. contacting lawyers, tenancy databases, real estate institutes, etc.);</Text>
                                    <Text style={{padding:5}}>{"\n"}(e) help you move in and get connected (e.g. contacting tradespeople, connections services, utilities providers, etc.); and</Text>
                                    <Text style={{padding:5}}>{"\n"}(f) perform other services or activities.</Text>

                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Agent/manager privacy policy : </Text>
                                    The agent/manager may have its own privacy policy. You may request this from the agent/manager directly.
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, textAlign:'justify', paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>PropertyComm does not control the agent/manager or third parties : </Text>
                                    The agent/manager is separate from PropertyComm, so PropertyComm cannot and does not control the agent's/manager's processes or actions. Likewise, PropertyComm and the agent/manager do not control third parties who may receive information.
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Contacting the agent/manager : </Text>
                                    If you have any query, concern or special requirements about how the agent/manager will use or disclose your personal information (or how it has used or disclosed your personal information), you should contact the agent/manager directly. You should also contact the agent/manager directly if you wish to access, correct or delete the information held by them.
                                </Text>

                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23, textAlign:'justify', paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>Limiting use of your personal information : </Text>
                                    You can ask to limit how your information is used and/or disclosed. If your personal information is not provided to the agent/manager and/or you do not consent to the use of your personal information as specified above, the agent/manager may not be able to assist you with your application.
                                </Text>



                                <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>3. Your declaration</Text>
                                <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
                                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '400' }}>By submitting your application, you acknowledge and agree that : </Text>
                                    <Text style={{padding:5}}>{"\n"}(a) (<Text style={{fontWeight:'600'}}>you are applying for the Property</Text>) you are applying to lease the property listed on the application (Property) and you offer to rent the Property under a lease or rental agreement prepared on behalf of the Property owner;</Text>
                                    <Text style={{padding:5}}>{"\n"}(b) (<Text style={{fontWeight:'600'}}>you've told the truth</Text>) everything you have said and submitted in the application is true and up to date and you have not omitted any detail that might be relevant to assessing the application; </Text>
                                    <Text style={{padding:5}}>{"\n"}(c) (<Text style={{fontWeight:'600'}}>the truth is important</Text>) the agent/manager and Property owner rely on you telling the truth;</Text>
                                    <Text style={{padding:5}}>{"\n"}(d) (<Text style={{fontWeight:'600'}}>it's the Property owner's call</Text>) your application is subject to the Property owner's approval and the availability of the Property;</Text>
                                    <Text style={{padding:5}}>{"\n"}(e) (<Text style={{fontWeight:'600'}}>others named in the application have consented</Text>) where you have provided information identifying another person in this application, that person consents to the information being submitted;</Text>
                                    <Text style={{padding:5}}>{"\n"}(f) (<Text style={{fontWeight:'600'}}>the application may take time</Text>) it may take time to process your application (two business days or more);</Text>
                                    <Text style={{padding:5}}>{"\n"}(g) (<Text style={{fontWeight:'600'}}>you understand the rental agreement</Text>) you have been given an opportunity to review the lease or rental agreement and get advice or ask a question about any issue or aspect that you do not understand;</Text>
                                    <Text style={{padding:5}}>{"\n"}(h) (<Text style={{fontWeight:'600'}}>you will pay the rent and bond</Text>) you are able to pay the advertised rent and bond for the Property and will be able to do so for the life of the rental agreement;</Text>
                                    <Text style={{padding:5}}>{"\n"}(i) (<Text style={{fontWeight:'600'}}>defaults will have consequences</Text>) if you default under a rental agreement, the agent/manager may (subject to the law) terminate the lease and may disclose details of any such default to any person whom the agent/manager reasonably considers has an interest in receiving such information;</Text>
                                    <Text style={{padding:5}}>{"\n"}(j) (<Text style={{fontWeight:'600'}}>PropertyComm is not the agent/manager</Text>) you acknowledge that PropertyComm does not and cannot control the agent or property manager and you will not hold PropertyComm responsible for actions or omissions outside PropertyComm's control; and</Text>
                                    <Text style={{padding:5}}>{"\n"}(k) (<Text style={{fontWeight:'600'}}>you've double checked key details</Text>) you have reviewed, checked and approved the email address of the agent/manager;</Text>
                                    <Text style={{padding:5}}>{"\n"}(l) (<Text style={{fontWeight:'600'}}>you authorise PropertyComm to send the application</Text>) you authorise PropertyComm to send the application and its contents as described by PropertyComm.</Text>

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
                                        onChange={(val) => {
                                            if (this.state.termsPolicy) {
                                                this.setState({ errorMsg: '', termsPolicy: false })
                                            }
                                            else {
                                                this.setState({ errorMsg: '', termsPolicy: true })
                                            }
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 23,textAlign:'justify',  paddingBottom: 20 }}>
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
                            <View style={{ paddingTop: 20,textAlign:'justify',  paddingBottom: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: '300' }}>4. Tenancy Database</Text>
                                    <Text style={{padding:5,textAlign:'justify'}}>The agent/manager may utilise any of the following residential tenancy database companies to check the tenancy history of applicants. If you wish to contact these organisations, their details are below:</Text>
                                <View style={{ padding: 15 }}>
                                    <Text style={{ fontWeight: '600',fontSize: 16 }}>Equifax's National Tenancy Database</Text>
                                    <Text style={{ fontWeight: '600',fontSize: 16 }}>1300 563 826</Text>
                                    <Text style={{ fontWeight: '600',fontSize: 16 }}>www.tenancydatabase.com.au</Text>
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
                                            onChange={(val) => {
                                                if (this.state.access_tenancy_db) {
                                                    this.setState({ errorMsg: '', access_tenancy_db: false })
                                                }
                                                else {
                                                    this.setState({ errorMsg: '', access_tenancy_db: true })
                                                }
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.9 }}>
                                        <Text style={{ fontSize: 16, textAlign:'justify',fontWeight: '300', lineHeight: 23, paddingBottom: 20 }}>
                                        I acknowledge that I have chosen of my own free will to send my application to the agent/landlord/property manager listed in this application and their associated principals, agents and employees. I also acknowledge that I have reviewed, checked and approved the email address of the intended recipient being the agent/landlord/property manager and their associated principals, agents and employees and authorise PropertyComm.com to send all of the details contained in this application, including any documents that I attach, to this email address for the purposes of making an application for tenancy. I acknowledge that once the information contained in this application has been sent to this email address, that PropertyComm.com in no circumstance shall be liable for any damages arising out of or in any way connected with the manner in which this information is used. I also acknowledge that in no circumstance shall PropertyComm.com be liable for any damages arising out of or in any way connected with my use of PropertyComm.com and its associated websites.
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

                    <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                        <View style={ApplySyncProfileScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
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

            </View>
        );
    

    }
}
function mapStateToProps(state) {
    
    return {
        addPropertyReducer: state.addPropertyReducer
    }
}

export default ApplySyncProfileScreenStepSix;

