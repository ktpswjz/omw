import Base64 from './Base64'

function Store() {
    let keys = new Array();
    const prefix = "server";

    const apiHost                   = KEY("ApiHost")
    const apiToken                  = KEY("ApiToken")
    const apiAccount                = KEY("ApiAccount")
    const apiAccountPassword        = KEY("ApiAccountPassword")
    const apiAutoLogin              = KEY("ApiAutoLogin")
    const apiAccountId              = KEY("ApiAccountID")
    const apiAccountType            = KEY("ApiAccountType")
    const apiRsaPublicKey           = KEY("ApiRsaPublicKey")

    const orgCode                   = KEY("OrgCode")
    const orgName                   = KEY("OrgName")

    this.setApiHost = function (v) {
        localStorage.setItem(apiHost, v);
    }
    this.getApiHost = function () {
        return localStorage.getItem(apiHost);
    }

    this.setApiToken = function (v) {
        localStorage.setItem(apiToken, v);
    }
    this.getApiToken = function () {
        return localStorage.getItem(apiToken);
    }

    this.setApiAccount = function (v) {
        localStorage.setItem(apiAccount, v);
    }
    this.getApiAccount = function () {
        return localStorage.getItem(apiAccount);
    }

    this.setApiAccountPassword = function (v) {
        localStorage.setItem(apiAccountPassword, Base64.encode(v));
    }
    this.getApiAccountPassword = function () {
        return Base64.decode(localStorage.getItem(apiAccountPassword));
    }

    this.setApiAutoLogin = function (v) {
        localStorage.setItem(apiAutoLogin, v);
    }
    this.getApiAutoLogin = function () {
        return localStorage.getItem(apiAutoLogin);
    }

    this.setApiAccountID = function (v) {
        localStorage.setItem(apiAccountId, v);
    }
    this.getApiAccountID = function () {
        return localStorage.getItem(apiAccountId);
    }

    this.setApiAccountType = function (v) {
        localStorage.setItem(apiAccountType, v);
    }
    this.getApiAccountType = function () {
        return localStorage.getItem(apiAccountType);
    }

    this.setApiRsaPublicKey = function (v) {
        localStorage.setItem(apiRsaPublicKey, v);
    }
    this.getApiRsaPublicKey = function () {
        return localStorage.getItem(apiRsaPublicKey);
    }


    this.setOrgCode = function (v) {
        localStorage.setItem(orgCode, v);
    }
    this.getOrgCode = function () {
        return localStorage.getItem(orgCode);
    }

    this.setOrgName = function (v) {
        localStorage.setItem(orgName, v);
    }
    this.getOrgName = function () {
        return localStorage.getItem(orgName);
    }

    function KEY(key) {
        let val = prefix + key;
        keys.push(val);
        return val;
    }

    this.clear = function () {
        for (let i = 0; i < keys.length; i++) {
            localStorage.removeItem(keys[i]);
        }
    }
}

function create() {
    return new Store();
}

export default {
    create
}