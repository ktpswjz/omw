import {Base64} from 'js-base64';

function encode(value) {
    if(value) {
        if(value === "") {
            return value;
        }

        return Base64.encode(value);
    }

    return null;
}

function decode(value) {
    if(value) {
        if(value === "") {
            return value;
        }

        return Base64.decode(value);
    }

    return null;
}


export default {
    encode,
    decode
}
