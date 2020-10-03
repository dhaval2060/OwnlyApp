//import Moment from 'moment';
import { PermissionsAndroid } from 'react-native';

async function requestGalleryPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        'title': 'BUCKiTDREAM',
        'message': 'BUCKiTDREAM needs access to your external storage '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the gallery")
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}
async function requestContactPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'BUCKiTDREAM',
        'message': 'BUCKiTDREAM needs access to your Contacts '
      }


    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the gallery")
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}


const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};


/*const formatDreamDate = (commentDate) => {

  // commentDate = Moment().subtract(2,'days');

  var result = Moment(commentDate).fromNow();
  var words = result.split(' ');
  var firstWord = words[0];
  var secondWord = words[1];


  // 1-59m, 1-24h, 1-6d, 1-51w, 1-Xy


  var formattedDate = '';

  if (firstWord == 'in' && secondWord == 'a') {
    formattedDate = '1m';
  }
  else if (firstWord == 'a' && secondWord == 'few') {
    formattedDate = '1m';
  }
  else if (secondWord == 'minutes' || secondWord == 'minute') {
    if (firstWord == 'a') {
      firstWord = '1';
    }
    formattedDate = firstWord + 'm';
  }
  else if (secondWord == 'hours' || secondWord == 'hour') {
    if (firstWord == 'an') {
      firstWord = '1';
    }
    formattedDate = firstWord + 'h';
  }
  else if (secondWord == 'days' || secondWord == 'day') {
    if (firstWord == 'a') {
      firstWord = '1';
    }
    formattedDate = firstWord + 'd';
  }
  else if (secondWord == 'months' || secondWord == 'month') {
    var numberOfWeeks = Moment().diff(commentDate, 'week');
    formattedDate = numberOfWeeks + 'w';
  }
  else if (secondWord == 'years' || secondWord == 'year') {
    if (firstWord == 'a') {
      firstWord = '1';
    }
    formattedDate = firstWord + 'y';
  }
  else {
    formattedDate = result;
  }

  return formattedDate;
};*/

export { validateEmail,  requestGalleryPermission, requestContactPermission };