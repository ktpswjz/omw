import axios from 'axios'
import Store from '@/data/Store'
import Uris from '@/const/uris'
import BaseUrl from './BaseUrl'
import HttpHandler from './HttpHandler'

const baseUrl = BaseUrl.getUrl()
const uris = Uris.uris
const store = Store.create()

function post(uri, argument, handler, interceptor) {
    let token =  store.getApiToken();
    let config = {
        timeout: 30000,
        baseURL: baseUrl,
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
            "token": token
        }
    };
    let httpHandler = HttpHandler.create(handler);
    let http = axios.create(config);
    if(interceptor) {
        http.interceptors.response.use(interceptor,
            function (error) {
                return Promise.reject(error);
            });
    }

    http.post(uri, argument).then(httpHandler.onResponse).catch(httpHandler.onError);
}

function upload(uri, argument, handler, interceptor, uploadProgress) {
    let token =  store.getApiToken();
    let config = {
        timeout: 300000,
        baseURL: baseUrl,
        onUploadProgress: uploadProgress,
        headers: {
            "Content-Type": "multipart/form-data",
            "token": token
        }
    };
    let httpHandler = HttpHandler.create(handler);
    let http = axios.create(config);
    if(interceptor) {
        http.interceptors.response.use(interceptor,
            function (error) {
                return Promise.reject(error);
            });
    }

    http.post(uri, argument).then(httpHandler.onResponse).catch(httpHandler.onError);
}

// example
// uri: "/user/info"
// message: function(evt) {
//   console.log("data:", evt.data);
//   console.log("origin:", evt.origin);
//   console.log("origin:", evt.ports);
//   console.log("origin:", evt.source);
// }
// open: function(){ }
// close: function(){ }
//
function newSocket(uri, message, open, close) {
    let protocol = "ws";
    if(document.location.protocol === "https:") {
        protocol = "wss";
    }
    let url = protocol + "://" + store.getApiHost() + uri + "?token=" + store.getApiToken();
    try {
        let ws = new WebSocket(url);

        if(message) {
            ws.onmessage = message;
        }

        if(open) {
            ws.onopen = open;
        }

        if(close) {
            ws.onclose = close;
        }

        return ws;

    } catch (err) {
        console.log(err);
    }

    return null;
}

export default {
    store,
    uris,
    post,
    upload,
    baseUrl,
    newSocket
}

