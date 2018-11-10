<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import JsEncrypt from 'jsencrypt/bin/jsencrypt'

    @Component
    export default class BaseComponent extends Vue {
        isNullOrEmpty(val) {
            if(val === undefined || val === null || val === "") {
                return true
            }
            return false;
        }

        isNotNullOrEmpty(val) {
            if(this.isNullOrEmpty(val)) {
                return false
            }
            return true
        }

        redirectTo(path) {
            if(this.isNullOrEmpty(path)) {
                return;
            }
            this.$router.push({ path: path });
        }

        rsaEncrypt(data) {
            if(this.isNullOrEmpty(data)) {
                return data;
            }
            let rsaKey = this.store.getApiRsaPublicKey();
            if(this.isNullOrEmpty(rsaKey)) {
                return data;
            }

            let jsEncrypt = new JsEncrypt();
            jsEncrypt.setPublicKey(rsaKey);
            return jsEncrypt.encrypt(data);
        }

        // example
        // uri: "/user/info"
        // argument: {id: "111212323"}
        // handler: function(code, error, data){ }
        post(uri, argument, handler) {
            this.network.post(uri, argument, handler, this.onInterceptor);
        }

        // example
        // uri: "/user/info"
        // argument: {id: "111212323"}
        // handler: function(code, error, data){ }
        // uploadProgress: function(progressEvent) {
        //   let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        // }
        upload(uri, argument, handler, uploadProgress) {
            this.network.upload(uri, argument, handler, this.onInterceptor, uploadProgress);
        }

        onInterceptor(response) {
            if(response.data) {
                // 无效凭证，需要登录
                if(response.data.code === 20001) {
                    let path = "/";
                    let fromPath = this.$router.history.current.path;
                    if(fromPath) {
                        path = fromPath;
                    }
                    this.$router.push({ name: "Login", params: {backPath: path} });
                }
            }

            return response;
        }
    }
</script>
