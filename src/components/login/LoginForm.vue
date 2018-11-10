<template>
    <div class="login-form" v-loading="logging" element-loading-text="登录中...">
        <div class="title">
            <span>服务器管理平台</span>
            <span>1.0.1.0</span>
        </div>
        <div class="row">
            <el-input placeholder="请输入账号"
                      v-model="accountVal"
                      ref="accountVal"
                      :clearable="true"
                      :autofocus="true"
                      v-on:input="onInputChanged"
                      @keyup.enter.native="doLogin">
                <i slot="prepend" class="prepend el-icon-yonghu"/>
            </el-input>
        </div>
        <div class="row">
            <el-input placeholder="请输入密码"
                      v-model="passwordVal"
                      ref="passwordVal"
                      :clearable="true"
                      type="password"
                      v-on:input="onInputChanged"
                      @keyup.enter.native="doLogin">
                <i slot="prepend" class="prepend el-icon-mima"/>
            </el-input>
        </div>
        <div class="row" v-show="captchaRequired">
            <el-input placeholder="请输入验证码"
                      v-model="captchaVal"
                      ref="captchaVal"
                      :clearable="true"
                      v-on:input="onInputChanged"
                      @keyup.enter.native="doLogin">
                <i slot="prepend" class="prepend el-icon-yanzhengma"/>
            </el-input>
            <el-tooltip class="item" effect="dark" content="点击刷新验证码" placement="right" >
                <img :src="captchaImg" class="captcha-image" alt="获取验证码失败" @click="updateCaptcha"/>
            </el-tooltip>
        </div>
        <div class="error">
            <errorMessage :summary="errSummary" :detail="errDetail" />
        </div>
        <div >
            <el-button type="primary" class="btn" @click="doLogin">登 录</el-button>
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import axios from 'axios'
    import JsEncrypt from 'jsencrypt/bin/jsencrypt'
    import BaseComponent from '@/components/BaseComponent'
    import ErrorMessage from '@/components/ErrorMessage'

    @Component({
        components: {
            errorMessage: ErrorMessage
        }
    })
    export default class LoginForm extends BaseComponent {
        errSummary = ""
        errDetail = ""
        captchaImg = ""
        captchaRequired = false
        accountVal = ""
        passwordVal = ""
        captchaVal = ""

        rsaKey = ""

        logging = false
        backPath = "/";

        onInputChanged() {
            this.errSummary = "";
            this.errDetail = "";
        }

        onLogin(code, err, data, host) {
            this.logging = false;

            if(code === 0) {
                this.store.setApiHost(host);
                this.store.setApiToken(data.token);
                this.store.setApiAccount(data.account);
                this.redirectTo(this.backPath);
            }
            else {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.updateCaptcha();

                // 验证码无效
                if(code === 10001) {
                    this.$refs["captchaVal"].focus();
                    this.$refs["captchaVal"].select();
                }
                // 账号不存在
                else if(code === 10002) {
                    this.$refs["accountVal"].focus();
                }
                // 密码错误
                else if(code === 10003) {
                    this.$refs["accountVal"].focus();
                }
            }
        }
        onLoginResponse(response) {
            let host = "";
            if(response.data.code === 0) {
                if(response.request) {
                    var url = response.request.responseURL;
                    if(url) {
                        var start = url.indexOf("//");
                        if(start !== -1) {
                            var from = start + 2;
                            var end = url.indexOf("/", from);
                            if(end !== -1) {
                                host = url.substring(start + 2, end);
                            }
                            else {
                                host = url.substring(start + 2);
                            }
                        }
                    }
                }
                this.onLogin(0, "", response.data.data, host);
            }
            else {
                this.onLogin(response.data.code, response.data.error, null, host);
            }
        }
        onLoginError(error) {
            let err = {
                summary: "未知错误",
                detail: error.message
            };
            this.onLogin(-1, err, null, "");
        }
        doLogin() {
            let accountVal = this.accountVal.trim();
            if(this.isNullOrEmpty(accountVal)) {
                this.errSummary = "账号不能为空";
                this.$refs["accountVal"].focus();
                return;
            }

            let passwordVal = this.passwordVal;
            if(this.isNullOrEmpty(passwordVal)) {
                this.errSummary = "密码不能为空";
                this.$refs["passwordVal"].focus();
                return;
            }

            let captchaVal = this.captchaVal.trim();
            if(this.captchaRequired) {
                if(this.isNullOrEmpty(captchaVal)) {
                    this.errSummary = "验证码不能为空";
                    this.$refs["captchaVal"].focus();
                    return;
                }
            }

            let pwdType = "";
            let pwdVal = passwordVal;
            if(this.rsaKey !== null && this.rsaKey !== "") {
                let jsEncrypt = new JsEncrypt();
                jsEncrypt.setPublicKey(this.rsaKey);
                pwdVal = jsEncrypt.encrypt(passwordVal);
                pwdType = "rsa";
            }

            let argument = {
                account: accountVal,
                password: pwdVal,
                captchaId: this.captchaId,
                captchaValue: captchaVal,
                encryption: pwdType
            };

            let config = {
                timeout: 15000,
                baseURL: this.network.baseUrl,
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                }
            };
            let http = axios.create(config);

            this.logging = true;
            http.post(this.uris.authLogin, argument)
                .then(this.onLoginResponse)
                .catch(this.onLoginError);
        }

        onGetCaptcha(code, err, data) {
            if (code === 0) {
                this.captchaId = data.id;
                this.captchaImg = data.value;
                this.rsaKey = data.rsaKey;
                this.captchaRequired = data.required;
            }
            else {
                this.captchaImg = "";
            }
            this.isLoadingCaptcha = false;
        }
        getCaptcha() {
            let argument = {
                length: 5,
                width: 120,
                height: 40
            };

            this.isLoadingCaptcha = true;
            this.post(this.uris.authCaptcha, argument, this.onGetCaptcha);
        }
        updateCaptcha() {
            this.getCaptcha();
        }

        mounted() {
            this.getCaptcha();

            if(this.$route.params.backPath) {
                this.backPath = this.$route.params.backPath;
            }
        }
    }
</script>

<style scoped lang="scss">
    .login-form {
        padding: 5px;
    }

    .title {
        font-size: large;
        font-family: "Microsoft YaHei";
        padding-bottom: 10px;
    }

    .row {
        display: flex;
        align-items: center;
        padding: 3px 0px;

        .el-input {
            flex: 1;
        }
    }

    .error {
        padding: 0px;
        margin: 0px;
    }

    .btn {
        width: 100%;
        margin-top: 2px;
    }

    .prepend {
        text-align: center;
        width: 20px;
    }

    .captcha-image {
        margin-left: 5px;
        width: 120px;
        height: 40px;
        border: 0;
        border-radius: 3px;
        font-size: small;
        color: red;
        background-color: lightgray;
        cursor: pointer;
    }

</style>