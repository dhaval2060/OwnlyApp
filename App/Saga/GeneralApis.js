import API from '../Constants/APIUrls';
export default getRoleById = (token = '', id) => {
    
    return new Promise((resolve, reject) => {
        fetch(API.GET_ROLE_BY_ID + '?id=' + id, {
            method: 'get',
            headers: {
                'Authorization': token
            },
        })
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(e => {
                
                reject('Please check your internet connection\nand try again.')
            });
    });

    // return new Promise((resolve, reject)=>{
    //     fetch(
    //         'POST',
    //         API.GET_ROLE_BY_ID,
    //         {
    //             'Accept': 'application/json',
    //             'authorization': xauthtoken,
    //             'Content-Type': 'multipart/form-data',
    //         },
    //         [
    //             {
    //                 name: 'file',
    //                 filename: "download.png",
    //                 type: 'image/jpeg',
    //                 data: RNFetchBlob.wrap(imageData)
    //             },

    //         ]


    //     )
    //         .then((resp) => resp.json())
    //         .catch((e) => {
    
    //             //throw e;
    //         });
    // })
}

