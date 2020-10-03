import axios from 'axios';
// import AppData from '../../config';
import { AsyncStorage } from 'react-native'
import { BASE_URL, GOOGLE_MAP_API_KEY } from '../Constants/APIUrls';
const staticPath = BASE_URL;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
global.cancel = '';
const APICaller = (endPoint, method, token, body) =>
    fetch(BASE_URL + endPoint, {
        method: method,
        headers: {
            // 'Content-Type': 'application/json',
            // 'User-Agent': 'iOS',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify(body)
    }).then(res => res.json())


export const documentUpload = (endpoint, token, body, id) =>
    fetch(BASE_URL + endpoint, {
        method: 'POST',
        headers: {
            'Accept': "application/x-www-form-urlencoded",
            'Authorization': token
        },
        body: body
    }).then(res => res.json())

export const GETAPICaller = (endPoint, method, token, body) =>
    fetch(BASE_URL + endPoint, {
        method: 'GET',
        headers: {
            // 'Content-Type': 'application/json',
            // 'User-Agent': 'iOS',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'authorization': token
        }
    }).then(res => res.json()).catch(err => {
        console.log(err, "errerr")
    })
// export const GETAPICaller = (endPoint, method, token, body) =>
//     fetch(BASE_URL + endPoint, {
//         method: 'GET',
//         headers: {
//             // 'Content-Type': 'application/json',
//             // 'User-Agent': 'iOS',
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'authorization': token
//         }
//     }).then(res => res.json())

export const GetLocation = (searchVal) =>
    fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" + GOOGLE_MAP_API_KEY + "&input=" + searchVal + "&components=country:au", {
        method: 'GET',
        headers: {
            // 'Content-Type': 'application/json',
            // 'User-Agent': 'iOS',
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())


export const GetLatLong = (placeId) =>
    fetch("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId + "&key=" + GOOGLE_MAP_API_KEY, {
        method: 'GET',
        headers: {
            // 'Content-Type': 'application/json',
            // 'User-Agent': 'iOS',
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())


export default APICaller
