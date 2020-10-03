import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Button,
  Modal,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage
} from "react-native";
import { PaymentCardTextField } from 'tipsi-stripe'


import { showLoading, resetState } from "../ProfileSettingComponent/UpdateImageAction";
import stripe from 'tipsi-stripe'
import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import ApplySyncProfileScreenStyle from "./SubscriptionScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Progress from "react-native-progress";

import APICaller, { GETAPICaller, documentUpload } from "../../../Saga/APICaller";
import IMAGEPATH from "../../../Constants/ImagesPath";


class SubscriptionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      is_subscription_cancelled: true,
      //loader
      cancelSubscriptionLoader: false,
      initialLoader: true,
      updateCreditCardLoader: false,
      subscribeModalLoader: false,
      paymentProcessLoader: false,
      //modal
      subscribeModal: false,
      updateCreditCardModal: false,
      subscriptionCancelModal: false,

      propertyAddress: "",
      option: undefined,
      status: undefined,
      days: [],
      errorOnTextField: "",
      document_id: [],
      label: "",
      amount_per_month: '',
      trial_period_days: "",
      documentation_status: false,
      uploadedDocumentDetails: [],
      stripe_plan_id: '',
      description_points: []
    };

  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidUpdate() { }

  componentWillUnmount() { }

  componentDidMount() {
    this.getUserDetails();
    stripe.setOptions({
      publishableKey: 'pk_test_kpzcl6wcferYLu6J73j9rwIi00yXh4xYoA',
      // merchantId: 'MERCHANT_ID', // Optional
      androidPayMode: 'test', // Android only
    })
  }


  cancelSubscription() {
    this.setState({ subscriptionCancelModal: false, cancelSubscriptionLoader: true })
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        // subscriptionPlanId
        let requestParams = {
          customer_id: userData.data._id,
          subscription_id: this.state.subscriptionPlanId
        }
        APICaller("cancelSubscription", "POST", authToken, requestParams).then(response => {
          console.log(response)
          this.getUserDetails()
        }, err => {
          // alert("Something went wrong. Please try again")
          this.setState({
            cancelSubscriptionLoader: false,
            initialLoader: false,
            paymentProcessLoader: false,
          })
        })
      }
    })

  }
  updateCreditCard() {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!this.state.reqEmail || this.state.reqEmail == '') {
      alert("Please enter email")
    } else if (!emailRegex.test(String(this.state.reqEmail).toLowerCase())) {
      alert("Please enter valid email")
    } else if (!this.state.reqValid) {
      alert("Please enter valid card details")
    } else {
      this.setState({ updateCreditCardLoader: true })
      const params = {
        // mandatory
        number: this.state.reqCardNumber,
        expMonth: this.state.reqMonth,
        expYear: this.state.reqYear,
        cvc: this.state.reqCVC
      }
      stripe.createTokenWithCard(params).then(data => {
        console.log(data, "tokentoken")
        AsyncStorage.getItem("SyncittUserInfo").then(value => {
          if (value) {
            var userData = JSON.parse(value);
            console.log(userData)
            var authToken = userData.token;
            // subscriptionPlanId
            // let url = "stripe_subscription?selected_plan_id=" + this.state.stripe_plan_id + "&email=" + this.state.reqEmail;
            // GETAPICaller(url, "GET", authToken, "").then(data => {
            //   console.log(data, "stripe_subscription")
            //   this.getUserDetails()
            // }, err => {
            //   console.log(err)
            // })
            this.setState({ subscriptionCancelModal: false })

            let params = "stripe_token=" + data.tokenId + "&card_id=" + data.card.cardId + "&stripe_customer_id=" + this.state.stripe_customer_id + "&exp_month=" + Number(this.state.reqMonth) + "&exp_year=" + Number(this.state.reqYear) + "&last4=" + String(this.state.reqCardNumber.substr(this.state.reqCardNumber.length - 4)) + "&brand=" + data.card.brand
            console.log(params, "paramsparams")
            GETAPICaller("update_stripe_card_details?" + params, 'GET', authToken, "").then(paymentRes => {
              console.log(paymentRes, "paymentRespaymentRes")
              if (paymentRes.code == 200) {
                this.getUserDetails()
              } else {
                alert("Request could not be processed. Please try again.")
              }
            }, err => {
              // alert("Something went wrong. Please try again")
              this.setState({
                cancelSubscriptionLoader: false,
                initialLoader: false,
                updateCreditCardModal: false,
                updateCreditCardLoader: false,
                paymentProcessLoader: false,
              })
            })
          }
        })

      })
    }
    // this.setState({ paymentProcessLoader: true })

  }
  subscribeUser() {
    // let timeout = setTimeout(() => {
    //   alert("Request csould not be processed. Please try again.")
    //   this.setState({
    //     subscribeModalLoader: false,
    //     cancelSubscriptionLoader: false,
    //     initialLoader: false,
    //     paymentProcessLoader: false,
    //   })
    // }, 15000);
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!this.state.reqEmail || this.state.reqEmail == '') {
      alert("Please enter email")
    } else if (!emailRegex.test(String(this.state.reqEmail).toLowerCase())) {
      alert("Please enter valid email")
    } else if (!this.state.reqValid) {
      alert("Please enter valid card details")
    } else {
      this.setState({ subscribeModalLoader: true })
      const params = {
        number: this.state.reqCardNumber,
        expMonth: this.state.reqMonth,
        expYear: this.state.reqYear,
        cvc: this.state.reqCVC
      }
      stripe.createTokenWithCard(params).then(data => {
        console.log(data, "tokentoken")
        AsyncStorage.getItem("SyncittUserInfo").then(value => {
          if (value) {
            var userData = JSON.parse(value);
            console.log(userData)
            var authToken = userData.token;
            // subscriptionPlanId
            // let url = "stripe_subscription?selected_plan_id=" + this.state.stripe_plan_id + "&email=" + this.state.reqEmail;
            // GETAPICaller(url, "GET", authToken, "").then(data => {
            //   console.log(data, "stripe_subscription")
            //   this.getUserDetails()
            // }, err => {
            //   console.log(err)
            // })
            this.setState({ subscriptionCancelModal: false })

            // let params = "selected_plan_id=" + this.state.stripe_plan_id + "stripe_token=" + data.tokenId + "&card_id=" + data.card.cardId + "&stripe_customer_id=" + this.state.stripe_customer_id + "&exp_month=" + Number(this.state.reqMonth) + "&exp_year=" + Number(this.state.reqYear) + "&last4=" + String(this.state.reqCardNumber.substr(this.state.reqCardNumber.length - 4)) + "&brand=" + data.card.brand
            let params = "stripe_token=" + data.tokenId + "&card_id=" + data.card.cardId + "&email=" + this.state.reqEmail + "&selected_plan_id=" + this.state.stripe_plan_id + "&exp_month=" + Number(this.state.reqMonth) + "&exp_year=" + Number(this.state.reqYear + 2000) + "&last4=" + String(this.state.reqCardNumber.substr(this.state.reqCardNumber.length - 4)) + "&brand=" + data.card.brand
            console.log(params, "paramsparams")
            GETAPICaller("stripe_subscription?" + params, 'GET', authToken, "").then(paymentRes => {
              console.log(paymentRes, "paymentRespaymentRes")
              if (paymentRes.code == 200) {
                this.getUserDetails()
                // clearTimeout(timeout)
              } else {
                alert("Request could not be prodcessed. Please try again.")
                // clearTimeout(timeout)
                this.setState({
                  subscribeModalLoader: false,
                  cancelSubscriptionLoader: false,
                  initialLoader: false,
                  paymentProcessLoader: false,
                })
              }
            }, err => {
              console.log(err, "err")
              // alert("Something went wrong. Please try again")
              // clearTimeout(timeout)
              this.setState({
                subscribeModalLoader: false,
                cancelSubscriptionLoader: false,
                initialLoader: false,
                paymentProcessLoader: false,
              })
            })
          }
        })

      }, err => {
        this.setState({
          subscribeModalLoader: false,
          cancelSubscriptionLoader: false,
          initialLoader: false,
          paymentProcessLoader: false,
        })
        // alert(JSON.stringify(err), "errerrerr")
      })
    }

  }
  getUserDetails() {
    this.props.showLoading();
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        GETAPICaller(
          "subscription_plan_list",
          "GET",
          authToken,
          ""
        ).then(data => {
          console.log(data, userData, "subscription_plan_list")
          if (data.code == 200) {
            this.setState({
              description_points: data.data[0] && data.data[0].description_points,
              label: data.data[0].label,
              cancelSubscriptionLoader: false,
              initialLoader: false,
              reqEmail: "",
              reqCardNumber: "",
              updateCreditCardLoader: false,
              updateCreditCardModal: false,
              subscribeModalLoader: false,
              reqCVC: "",
              reqMonth: "",
              reqYear: "",
              reqValid: false,
              subscribeModal: false,
              paymentProcessLoader: false,
              amount_per_month: data.data[0].amount_per_month,
              trial_period_days: data.data[0].trial_period_days,
              stripe_plan_id: data.data[0].stripe_plan_id
            })
            // if (data.data[0] && data.data[0].stripe_plan_id) {
            //   let url =
            //     "stripe_subscription?selected_plan_id=" + data.data[0].stripe_plan_id +
            //     "&email=" + userData.data.email;
            //   GETAPICaller(url, "GET", authToken, "").then(data => {
            //     console.log(data, "stripe_subscription")
            //   }, err => {
            //     console.log(err)
            //   })
            // }
          }
        },
          err => {
            // alert("Something went wrong. Please try again")
            this.setState({
              cancelSubscriptionLoader: false,
              initialLoader: false,
              paymentProcessLoader: false,
            })
          }
        );
      }
    })
    AsyncStorage.getItem("roleId")
      .then(roleId => {
        if (roleId) {
          AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
              if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                let postData = {
                  roleId: roleId,
                  userId: userData.data._id
                };


                APICaller("getUserDetails", "POST", authToken, postData).then(
                  data => {
                    console.log(data, "====>>>>>DATA")

                    this.props.resetState();
                    console.log(data.data.subscription_end_date, "subscription_end_datesubscription_end_date")
                    let date1 = new Date(data.data.subscription_end_date);
                    let date2 = new Date();
                    let dateDiff = Math.abs(date1 - date2)
                    const diffDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24)) ? Math.ceil(dateDiff / (1000 * 60 * 60 * 24)) : 0;

                    console.log(diffDays, "dateDiffdateDiff")
                    if (data.code == 200) {
                      this.setState({
                        is_subscription_cancelled: data.data.is_subscription_cancelled,
                        subscriptionPlanId: data.data.subscription_id,
                        isPlanActive: diffDays <= 0 ? false : true,
                        days: data.data.availability.days,
                        option: data.data.availability.option,
                        stripe_customer_id: data.data.stripe_customer_id,
                        status: data.data.availability.status
                      });
                    }
                  }, err => {
                    // alert("Something went wrong. Please try again")
                    this.setState({
                      cancelSubscriptionLoader: false,
                      initialLoader: false,
                      paymentProcessLoader: false,
                    })
                  }
                );
              }
            })
            .done();
        }
      })
      .done();
  }
  handleFieldParamsChange = (valid, params) => {
    if (valid) {
      this.setState({
        reqValid: valid,
        reqCardNumber: params.number,
        reqMonth: params.expMonth,
        reqYear: params.expYear,
        reqCVC: params.cvc
      })
    }
    else {
      this.setState({ reqValid: false })
    }
    console.log(`
      Valid: ${valid}
      Number: ${params.number || '-'}
      Month: ${params.expMonth || '-'}
      Year: ${params.expYear || '-'}
      CVC: ${params.cvc || '-'}
    `)
  }
  isPaymentCardTextFieldFocused = () => this.paymentCardInput.isFocused()

  focusPaymentCardTextField = () => this.paymentCardInput.focus()

  blurPaymentCardTextField = () => this.paymentCardInput.blur()

  resetPaymentCardTextField = () => this.paymentCardInput.setParams({})

  updateCreditCardModal() {
    return (
      <Modal visible={this.state.updateCreditCardModal} transparent={true} onRequestClose={() => { this.setState({ updateCreditCardModal: false }) }}>
        <View style={{ backgroundColor: Colors.TRANSLUCENT_BLACK_DARK, justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%', height: '100%' }}>
          <View style={{ width: '90%', backgroundColor: 'white', alignItems: 'center', borderRadius: 10 }}>
            <View style={{ width: '100%', justifyContent: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.GRAY, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Stripe</Text>
              <Text style={{ fontSize: 18, fontWeight: '400', marginTop: 10, color: Colors.GRAY_COLOR }}>Update Card Details</Text>
            </View>
            <View style={{ paddingVertical: 20, width: '100%', alignItems: 'center' }}>
              <View style={{ height: 50, width: '90%', borderRadius: 5, paddingLeft: 15, borderWidth: 1, justifyContent: 'center', borderColor: Colors.GRAY }}>
                <TextInput
                  placeholder={'Email'}
                  style={{ fontSize: 18 }}
                  value={this.state.reqEmail}
                  onChangeText={(val) => this.setState({ reqEmail: val })}
                />
              </View>
            </View>

            <View style={{ paddingBottom: 20, width: '100%', alignItems: 'center' }}>
              <PaymentCardTextField
                ref={(ref) => {
                  this.paymentCardInput = ref;
                }}
                style={styles.field}
                cursorColor={Colors.GRAY_COLOR}
                textErrorColor={Colors.STAUS_RED_COLOR}
                placeholderColor={'Card number'}
                // numberPlaceholder={...}
                // expirationPlaceholder={...}
                // cvcPlaceholder={...}
                disabled={false}
                onParamsChange={this.handleFieldParamsChange}
              />
              <TouchableOpacity onPress={() => this.updateCreditCard()} style={{ margin: 10, marginTop: 30, justifyContent: 'center', alignItems: 'center', height: 40, paddingHorizontal: 15, backgroundColor: Colors.TEXT_COLOR_SKY_BLUE, borderRadius: 5 }}>
                {!this.state.updateCreditCardLoader ?
                  <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.WHITE }}>Update Card Details</Text>
                  : <ActivityIndicator size='small' color={Colors.WHITE} />
                }

              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ updateCreditCardModal: false })} style={{ margin: 10, justifyContent: 'center', alignItems: 'center', height: 40, paddingHorizontal: 15, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  subscribeModal() {
    return (
      <Modal visible={this.state.subscribeModal} transparent={true} onRequestClose={() => { this.setState({ subscribeModal: false }) }}>
        <View style={{ backgroundColor: Colors.TRANSLUCENT_BLACK_DARK, justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%', height: '100%' }}>
          <View style={{ width: '90%', backgroundColor: 'white', alignItems: 'center', borderRadius: 10 }}>
            <View style={{ width: '100%', justifyContent: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: Colors.GRAY, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Stripe</Text>
              <Text style={{ fontSize: 18, fontWeight: '400', marginTop: 10, color: Colors.GRAY_COLOR }}>Standard Subscription</Text>
            </View>
            <View style={{ paddingVertical: 20, width: '100%', alignItems: 'center' }}>
              <View style={{ height: 50, width: '90%', borderRadius: 5, paddingLeft: 15, borderWidth: 1, justifyContent: 'center', borderColor: Colors.GRAY }}>
                <TextInput
                  placeholder={'Email'}
                  style={{ fontSize: 18 }}
                  value={this.state.reqEmail}
                  onChangeText={(val) => this.setState({ reqEmail: val })}
                />
              </View>
            </View>

            <View style={{ paddingBottom: 20, width: '100%', alignItems: 'center' }}>
              <PaymentCardTextField
                ref={(ref) => {
                  this.paymentCardInput = ref;
                }}
                style={styles.field}
                cursorColor={Colors.GRAY_COLOR}
                textErrorColor={Colors.STAUS_RED_COLOR}
                placeholderColor={'Card number'}
                // numberPlaceholder={...}
                // expirationPlaceholder={...}
                // cvcPlaceholder={...}
                disabled={false}
                onParamsChange={this.handleFieldParamsChange}
              />
              <TouchableOpacity onPress={() => this.subscribeUser()} style={{ margin: 10, marginTop: 30, justifyContent: 'center', alignItems: 'center', height: 40, paddingHorizontal: 15, backgroundColor: Colors.TEXT_COLOR_SKY_BLUE, borderRadius: 5 }}>
                {!this.state.subscribeModalLoader ?
                  <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.WHITE }}>Pay US ${this.state.amount_per_month}</Text>
                  : <ActivityIndicator size='small' color={Colors.WHITE} />
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ subscribeModal: false })} style={{ margin: 10, justifyContent: 'center', alignItems: 'center', height: 40, paddingHorizontal: 15, backgroundColor: Colors.WHITE, borderWidth: 1, borderColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ backgroundColor: 'white' }} >
          {/* <View style={{ width: '75%', borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, height: 50, alignSelf: 'center', marginTop: 50 }}>

          </View> */}
          <View style={{ elevation: 0, backgroundColor: 'white', borderRadius: 5, marginTop: 0, marginBottom: 0, shadowOpacity: 0.7, shadowColor: '#aaa', shadowOffset: { height: 0, width: 0 }, shadowRadius: 0 }}>
            <FlatList
              data={this.state.description_points}
              extraData={this.state}
              scrollEnabled={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ justifyContent: 'center', padding: 25, alignItems: 'center', backgroundColor: index % 2 == 1 ? Colors.LIGHT_SKY_BLUE : '' }}>
                    <View style={{ alignItems: 'flex-end' }}><Image source={IMAGEPATH.AMENITIES_CHECK_ICON} style={{ height: 30, marginRight: 8, width: 30 }} /></View>
                    <View style={{ flexDirection: 'row', padding: 10, }}>
                      <View style={{}}>
                        <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 16, fontWeight: '600' }}>{item.point}</Text>
                        <Text style={{ textAlign: 'center', fontSize: 15, color: Colors.GRAY_COLOR }}>{item.sub_point}</Text>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
{/* 
            <View style={{ paddingVertical: 20, alignItems: 'center', padding: 10 }}>

              {this.state.amount_per_month ? <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>${this.state.amount_per_month} p/m</Text> : null}
              <Text style={{ fontSize: 17, fontWeight: '600', color: Colors.GRAY_COLOR }}>{this.state.label}</Text>
            </View> */}

          </View>
          {/* {this.state.isPlanActive ? */}
            <TouchableOpacity style={{ width: '60%', borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, height: 40, alignSelf: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>FREE</Text>
            </TouchableOpacity>
            {/* : <TouchableOpacity onPress={() => { this.setState({ subscribeModal: true }) }} style={{ width: '60%', borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, height: 40, alignSelf: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>SUBSCRIBE</Text>
            </TouchableOpacity>
          }
          {this.state.subscriptionPlanId &&
            <TouchableOpacity onPress={() => { this.setState({ updateCreditCardModal: true }) }} style={{ paddingVertical: 20, alignItems: 'center', padding: 10, paddingBottom: 0 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>Update Credit Card</Text>
            </TouchableOpacity>
          }
          {!this.state.is_subscription_cancelled && this.state.subscriptionPlanId ?
            <TouchableOpacity onPress={() => { this.setState({ subscriptionCancelModal: true }) }} style={{ paddingVertical: 20, alignItems: 'center', paddingTop: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.GRAY }}>Cancel Subscription</Text>
            </TouchableOpacity>
            : null} */}
          <View style={{ height: 100 }} />
          <Modal visible={this.state.subscriptionCancelModal} transparent={true} onRequestClose={() => { this.setState({ subscriptionCancelModal: false }) }}>
            <View style={{ backgroundColor: Colors.TRANSLUCENT_BLACK_DARK, justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%', height: '100%' }}>
              <View style={{ height: '30%', width: '90%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                <Image source={IMAGEPATH.SYNCITTLOGO} resizeMode={'contain'} style={{ tintColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, marginBottom: 10, height: 50 }} />
                <Text style={{ textAlign: 'center', fontSize: 18, color: Colors.GRAY_COLOR, fontWeight: '600' }}>Would you like to cancel your subscription?</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.cancelSubscription()} style={{ margin: 10, marginTop: 30, justifyContent: 'center', alignItems: 'center', height: 50, width: 100, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.WHITE }}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({ subscriptionCancelModal: false })} style={{ margin: 10, marginTop: 30, justifyContent: 'center', alignItems: 'center', height: 50, width: 100, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.WHITE }}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {this.updateCreditCardModal()}
          {this.subscribeModal()}
        </ScrollView>
        {
          this.state.initialLoader || this.state.cancelSubscriptionLoader || this.state.paymentProcessLoader ?
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
    updateUserImageReducer: state.updateUserImageReducer
  }
}

export default connect(
  mapStateToProps,
  {
    showLoading,
    resetState
  }
)(SubscriptionScreen);

const styles = StyleSheet.create({
  field: {
    width: '90%',
    color: '#449aeb',
    borderColor: Colors.GRAY,
    borderWidth: 1,
    height: 50,
    borderRadius: 5,
  }
})
