import { Model } from "./model.interface";


const AWS = require('aws-sdk');
const s3 = new AWS.S3();
var params = {
    Bucket: 'bucket',
    Fields: [
        key: 'key'
    ]
};
s3.createPresignedPost(params, function (err, data) {
    if (err) {
        console.error('Presigning post data encountered an error', err);
    } else {
        // data.url contains the upload form action
        // data.fields contains a hash of fields you must include in your upload form
        return data;
    }
});
class PreSignedUrl extends Model {

}