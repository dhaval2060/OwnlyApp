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
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import WriteReviewScreenStyle from './WriteReviewScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-checkbox';
import StarRating from 'react-native-star-rating';
import {
    addReviewAPI,
    getRoleByID
} from "../../Action/ActionCreators";
import {
    reviewTextChange,
    showLoading,
    resetState,
    updateRating
} from "./WriteReviewAction";
import { EventRegister } from 'react-native-event-listeners'

class WriteReviewScreen extends Component {
    constructor() {
        super();
        this.state = {
            isTenantCreatePassword: false,
            isTenantPraivacyPolicy: false,
            propertyAdd: '',
            starCountExcelent: 0,
            starCountExcelentText: '',
            starCountGood: 0,
            starCountGoodText: '',
            starCountAvereg: 0,
            starCountAveregText: ''
        };
    }

    componentDidUpdate() {
        this.onAddReivewSuccess();
        
    }

    componentWillMount() {
        

        AsyncStorage.getItem('SyncittUserInfo').then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var _id = userData.data._id;
                var postData = {
                    user_id: this.props.reviewToId
                }
                // getRoleById(authToken,this.props.reviewToId).then(data=>{
                
                // },
                // err=>{
                
                // })
                this.props.getRoleByID(authToken, postData)
            }
        }).done();

    }

    closeAddProperty() {
        Actions.popTo('Dashboard');
    }


    onReviewTextChange(text) {

        this.props.reviewTextChange(text);

    }

    onExcelentStarRatingPress(rating) {
        if (rating <= 2) {
            this.setState({
                starCountExcelentText: 'Average'
            });
        }
        else if (rating >= 3 && rating <= 4) {
            this.setState({
                starCountExcelentText: 'Good'
            });
        }
        else {
            this.setState({
                starCountExcelentText: 'Excelent!'
            });
        }
        this.setState({
            starCountExcelent: rating
        });
    }
    onGoodStarRatingPress(rating) {

        if (rating <= 2) {
            this.setState({
                starCountGoodText: 'Average'
            });
        }
        else if (rating >= 3 && rating <= 4) {
            this.setState({
                starCountGoodText: 'Good'
            });
        }
        else {
            this.setState({
                starCountGoodText: 'Excelent!'
            });
        }
        this.setState({
            starCountGood: rating
        });
    }
    onAvgStarRatingPress(rating) {

        if (rating <= 2) {
            this.setState({
                starCountAveregText: 'Average'
            });
        }
        else if (rating >= 3 && rating <= 4) {
            this.setState({
                starCountAveregText: 'Good'
            });
        }
        else {
            this.setState({
                starCountAveregText: 'Excelent!'
            });
        }
        this.setState({
            starCountAvereg: rating
        });
    }


    callAddReview() {


        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {


                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    review_by: userData.data._id,
                    review_to: this.props.reviewToId,
                    comments: this.props.writeReviewReducer.reviewText,
                    review_by_role: userData.data.role_id,
                    quality_of_work: this.state.starCountAvereg,
                    punctaulity: this.state.starCountGood,
                    communication: this.state.starCountExcelent,

                }
                
                this.props.showLoading();
                this.props.addReviewAPI(authToken, postData);
            }
        }).done();



    }

    onAddReivewSuccess() {
        if (this.props.writeReviewReducer.writeReviewRes != '') {
            if (this.props.writeReviewReducer.writeReviewRes.code == 200) {
                EventRegister.emit('updateCounter', postData)
                this.props.updateRating('updated');
                Actions.popTo('Dashboard');
                let postData = {}
                this.props.reviewTextChange('');
            }
            else {
                alert(this.props.writeReviewReducer.writeReviewRes.message);
            }
            this.props.resetState();
        }
    }

    onTenantCreatePassword() {

        if (this.state.isTenantCreatePassword) {

            this.setState({ isTenantCreatePassword: false });
        }
        else {

            this.setState({ isTenantCreatePassword: true });
        }
    }

    onTenantPrivacyPolicy() {

        if (this.state.isTenantPraivacyPolicy) {

            this.setState({ isTenantPraivacyPolicy: false });
        }
        else {

            this.setState({ isTenantPraivacyPolicy: true });
        }
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />

                <Text style={CommonStyles.navBarTitleTextView}>{Strings.WRITE_REVIEW}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} style={CommonStyles.navRightImageView} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {

        
        return (
            <View style={{ flex: 1, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>
                {this.navBar()}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={WriteReviewScreenStyle.scrollViewContainerStyle}>
                    <View style={WriteReviewScreenStyle.addPropertyInputContainer}>

                        <Text style={WriteReviewScreenStyle.labelStyle}>
                            {Strings.WRITE_REVIEW_TEXT} working with {this.props.reviewToName}
                        </Text>

                        <TextInput style={WriteReviewScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            placeholder={Strings.WRITE_REVIEW_HINT}
                            onChangeText={this.onReviewTextChange.bind(this)}
                            value={this.props.writeReviewReducer.reviewText}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>Communication</Text>
                        <View>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                starSize={25}
                                starStyle={{ paddingRight: 2, paddingLeft: 2 }}
                                // emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                // starColor={Colors.STAR_COLOR}

                                fullStarColor={Colors.STAR_COLOR}
                                starColor={Colors.STAR_COLOR}
                                halfStarColor={Colors.STAR_COLOR}

                                rating={this.state.starCountExcelent}
                                selectedStar={(rating) => this.onExcelentStarRatingPress(rating)}
                            />
                            <Text style={{ padding: 8, textAlign: 'center', fontSize: 14, fontWeight: '500', color: Colors.RATING_TEXT_COLOR }}>{this.state.starCountExcelentText}</Text>
                        </View>
                    </View>

                    {this.props.navigation.state.params.isFrom == "TenantProfile" &&
                        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>

                            <Text style={{ fontSize: 18, fontWeight: '500' }}>Tenant management</Text>
                            <View>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    starSize={25}
                                    starStyle={{ paddingRight: 2, paddingLeft: 2 }}
                                    fullStarColor={Colors.STAR_COLOR}
                                    starColor={Colors.STAR_COLOR}
                                    halfStarColor={Colors.STAR_COLOR}
                                    rating={this.state.starCountGood}
                                    selectedStar={(rating) => this.onGoodStarRatingPress(rating)}
                                />
                                <Text style={{ padding: 8, textAlign: 'center', fontSize: 14, fontWeight: '500', color: Colors.RATING_TEXT_COLOR }}>{this.state.starCountGoodText}</Text>
                            </View>
                        </View>
                    }

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>

                        <Text style={{ fontSize: 18, fontWeight: '500' }}>Overall satisfaction</Text>
                        <View>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                starSize={25}
                                starStyle={{ paddingRight: 2, paddingLeft: 2 }}

                                fullStarColor={Colors.STAR_COLOR}
                                starColor={Colors.STAR_COLOR}
                                halfStarColor={Colors.STAR_COLOR}

                                rating={this.state.starCountAvereg}
                                selectedStar={(rating) => this.onAvgStarRatingPress(rating)}
                            />
                            <Text style={{ padding: 8, textAlign: 'center', fontSize: 14, fontWeight: '500', color: Colors.RATING_TEXT_COLOR }}>{this.state.starCountAveregText}</Text>
                        </View>
                    </View>

                </ScrollView>
                <View style={WriteReviewScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callAddReview()}>
                        <View style={WriteReviewScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={WriteReviewScreenStyle.proceedButtonTextStyle}>
                                Submit review
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        writeReviewReducer: state.writeReviewReducer
    }
}

export default connect(
    mapStateToProps,
    {
        reviewTextChange,
        showLoading,
        getRoleByID,
        resetState,
        addReviewAPI,
        updateRating
    }

)(WriteReviewScreen);


