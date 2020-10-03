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
    Modal,
    ScrollView,
    AsyncStorage
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
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

class ApplySyncProfileScreenStepSeven extends Component {
    constructor() {
        super();
        this.state = {
            propertyAdd: '',
            ownerData: [],
            errorMsg: '',
            errorOnTextField: '',
            isTypeAdreesManual: false,
            infoModal:false,
            roleName: ''
        };
        
    }

    componentWillMount() {
        this.setState({ propertyAddress: this.props.screenSixDetails.propertyAddress })
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
    callProceedToStepFinal() {
        
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                // var arr = {
                //     "property_id": this.props.screenSixDetails.property_id,
                //     "property_type": this.props.screenSixDetails.property_type,
                //     "number_bedroom": this.props.screenSixDetails.propertyDetail.number_of_bathroom,
                //     "preferred_comm_date": this.props.screenSixDetails.preferred_comm_date,
                //     "preferred_length_of_lease_years": this.props.screenSixDetails.preferred_length_of_lease_years,
                //     "preferred_length_of_lease_months": this.props.screenSixDetails.preferred_length_of_lease_months,
                //     "weekly_rent": this.props.screenSixDetails.weekly_rent,
                //     "monthly_rent": this.props.screenSixDetails.monthly_rent,
                //     "bond": this.props.screenSixDetails.bond,
                //     "why_propery_is_right_for_u": this.props.screenSixDetails.why_propery_is_right_for_u,
                //     "agency_name": this.props.screenSixDetails.agency_name,
                //     "property_manager_name": this.props.screenSixDetails.property_manager_name,
                //     "property_manager_email": this.props.screenSixDetails.property_manager_email,
                //     "members": this.props.screenSixDetails.members,
                //     "vehicles": this.props.screenSixDetails.vehicles,
                //     "pets": this.props.screenSixDetails.pets,
                //     "agent_specific": this.props.screenSixDetails.agent_specific,
                //     "need_help_moving_service": this.props.screenSixDetails.need_help_moving_service,
                //     "documentation_status": this.props.screenSixDetails.documentation_status,
                //     "document_id": this.props.screenSixDetails.document_id,
                //     "inspection_status": this.props.screenSixDetails.inspection_status,
                //     "inspection_date": this.props.screenSixDetails.inspection_date,
                //     "status": 0,
                //     "access_tenancy_db": this.props.screenSixDetails.access_tenancy_db,
                //     "created_by": userData.data._id


                // };
             
                
                var arr = {
                    access_tenancy_db: this.props.screenSixDetails.access_tenancy_db,
                    agency_name: this.props.screenSixDetails.agency_name,
                    agent_specific: this.props.screenSixDetails.agent_specific,
                    bond: Number(this.props.screenSixDetails.bond),
                    created_by: userData.data._id,
                    document_id: this.props.screenSixDetails.document_id,
                    documentation_status: this.props.screenSixDetails.documentation_status,
                    inspection_date: this.props.screenSixDetails.inspection_date,
                    inspection_status: this.props.screenSixDetails.inspection_status,
                    members: this.props.screenSixDetails.members,
                    monthly_rent: Number(this.props.screenSixDetails.monthly_rent),
                    need_help_moving_service: this.props.screenSixDetails.need_help_moving_service,
                    number_bedroom: Number(this.props.screenSixDetails.propertyDetail.number_of_bathroom),
                    // pets: [{ "breed": "Grinned", "registration_number": "Ethnographic", "type": 1, "typeVal": "Bird"}],
                    pets: this.props.screenSixDetails.pets,
                    preferred_comm_date: this.props.screenSixDetails.preferred_comm_date,
                    preferred_length_of_lease_months: Number(this.props.screenSixDetails.preferred_length_of_lease_months),
                    preferred_length_of_lease_years: Number(this.props.screenSixDetails.preferred_length_of_lease_years),
                    propertyId: this.props.screenSixDetails.property_id,
                    property_id: this.props.screenSixDetails.property_id,
                    property_manager_email: this.props.screenSixDetails.property_manager_email,
                    property_manager_name: this.props.screenSixDetails.property_manager_name,
                    property_type: this.props.screenSixDetails.property_type,
                    status: 0,
                    vehicles: this.props.screenSixDetails.vehicles,
                    weekly_rent: Number(this.props.screenSixDetails.weekly_rent),
                    why_propery_is_right_for_u: this.props.screenSixDetails.why_propery_is_right_for_u,



                    // access_tenancy_db: this.props.screenSixDetails.access_tenancy_db,
                    // agency_name: this.props.screenSixDetails.agency_name,
                    // agent_specific: this.props.screenSixDetails.agent_specific,
                    // bond: Number(this.props.screenSixDetails.bond),
                    // created_by: userData.data._id,
                    // document_id: [],
                    // documentation_status: this.props.screenSixDetails.documentation_status,
                    // inspection_date: this.props.screenSixDetails.inspection_date,
                    // inspection_status: this.props.screenSixDetails.inspection_status,
                    // members: [{ name: "test", age: 2, relationship: 2, be_on_lease: "1", email: "st@gdf.bfb" }],
                    // monthly_rent: Number(this.props.screenSixDetails.monthly_rent),
                    // need_help_moving_service: this.props.screenSixDetails.need_help_moving_service,
                    // number_bedroom: Number(this.props.screenSixDetails.propertyDetail.number_of_bathroom),
                    // pets: this.props.screenSixDetails.pets,
                    // preferred_comm_date: this.props.screenSixDetails.preferred_comm_date,
                    // preferred_length_of_lease_months: Number(this.props.screenSixDetails.preferred_length_of_lease_months),
                    // preferred_length_of_lease_years: Number(this.props.screenSixDetails.preferred_length_of_lease_years),
                    // propertyId: this.props.screenSixDetails.property_id,
                    // property_id: this.props.screenSixDetails.property_id,
                    // property_manager_email: this.props.screenSixDetails.property_manager_email,
                    // property_manager_name: this.props.screenSixDetails.property_manager_name,
                    // property_type: this.props.screenSixDetails.property_type,
                    // status: 0,
                    // vehicles: this.props.screenSixDetails.vehicles,
                    // weekly_rent: Number(this.props.screenSixDetails.weekly_rent),
                    // why_propery_is_right_for_u: this.props.screenSixDetails.why_propery_is_right_for_u,



                }

                
                APICaller('createPropertyApplication', 'POST', authToken, arr).then(data => {
                     if (data.code == 200) {
                        global.isEdit = false
                        global.propertyDetail = []
                        // const resetAction = StackActions.reset({
                        //     index: 0,
                        //     actions: [
                        //         NavigationActions.navigate({ routeName: 'NavScreen' })
                        //     ],
                        //     key: null // THIS LINE
                        // })
                        // this.props.navigation.dispatch(resetAction)
                        Actions.popTo('Dashboard');

                    }
                })
            }
        }).done();
        // Actions.ApplySyncProfileScreenFinalStep();

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

    if(!this.state.infoModal)
    {

    
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
                                <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
                            </View>

                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE', paddingBottom: 30 }}>
                            <Text style={{ color: 'black', fontSize: 25, fontWeight: '300' }}>Review & Send</Text>
                        </View>

                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>

                            <Text style={{ color: 'black', fontSize: 25, fontWeight: '300' }}>Review or Edit Application</Text>
                            <Text style={{ lineHeight: 23, fontSize: 16, fontWeight: '300', paddingTop: 15 }}>Not quite ready yet? You can use the review and edit options below before sending.</Text>
                            <Text style={{ lineHeight: 23, fontSize: 16, fontWeight: '300', paddingTop: 15 }}>Review Application before sending.</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    global.isEdit = true
                                    global.propertyDetail = this.props.screenSixDetails
                                    Actions.popTo('ApplySyncProfileScreenStepOne', { propertyDetail: this.props.screenSixDetails.propertyDetail })
                                }}
                            >
                                <Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 18, padding: 15, paddingLeft: 0 }}>View My Application</Text>
                            </TouchableOpacity>

                            <Text style={{ lineHeight: 23, fontSize: 16, fontWeight: '300', paddingTop: 15 }}>Edit Application Before sending.</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    global.isEdit = true
                                    global.propertyDetail = this.props.screenSixDetails
                                    Actions.popTo('ApplySyncProfileScreenStepTwo', { propertyDetail: this.props.screenSixDetails.propertyDetail })
                                }}>
                                <Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 18, padding: 15, paddingLeft: 0 }}>Edit Personal Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    global.isEdit = true
                                    global.propertyDetail = this.props.screenSixDetails
                                    Actions.popTo('ApplySyncProfileScreenStepOne', { propertyDetail: this.props.screenSixDetails.propertyDetail })
                                }}>
                                <Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 18, padding: 0, paddingLeft: 0 }}>Edit Property Details</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 35, backgroundColor: '#F8F9FE' }}></View>

                        <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>

                            <Text style={{ color: 'black', fontSize: 25, fontWeight: '300' }}>Send Application</Text>
                            <Text style={{ lineHeight: 23, fontSize: 16, fontWeight: '300', paddingTop: 15 }}>
                                You're nearly there! Just click the "Next : Send Application: button and you're done!!!.</Text>
                            <Text style={{ lineHeight: 23, fontSize: 16, fontWeight: '300', paddingTop: 15 }}>Your application will be sent to inspections.ire.manningham@raywhite.com
Please note : You will have a chance to print the application after you have sent it.
</Text>
                            <TouchableOpacity  onPress={()=>this.setState({infoModal:true})}>
                                <Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 18, padding: 15, paddingLeft: 0 }}>View our Personal Information Transfer Statement</Text>
                            </TouchableOpacity>

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
                    <TouchableOpacity onPress={() => this.callProceedToStepFinal()}>
                        <View style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                                {Strings.PUBLISH}
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
        else
            {
                return(
                  
                        <Modal
                          transparent={true}
                          animationType={"none"}
                          contentContainerStyle={{ flex: 1, backgroundColor: "red " }}
                          visible={this.state.infoModal}
                        >
                          <View style={{ margin: 25, backgroundColor: Colors.WHITE, flex: 1 }}>
                            <Text
                              style={{ padding: 10, paddingLeft:20, fontSize:25 }}
                              onPress={() => this.setState({ infoModal: false })}
                            >
                              x
                            </Text>
                            <ScrollView style={{ padding: 15 }}>
                              <Text style={{ fontSize: 14, padding: 10, textAlign:'justify' }}>
                              By submitting this application you acknowledge that you are passing your personal information to a property manager or real estate agent that might not have an existing relationship with PropertyComm. PropertyComm does not endorse this property manager or real estate agent. PropertyComm does not accept any responsibility or liability arising from any unauthorised use of your information.
                              </Text>
                              <View style={{ height: 25 }} />
                            </ScrollView>
                          </View>
                        </Modal>
                )
            }
    }
}
export default ApplySyncProfileScreenStepSeven;

