<template>
    <div class="server">
        <div class="body" style="display: inline;">
            <div class="row">
                <span class="label">启用:</span>
                <span class="content">
                    <el-checkbox v-model="enable" :disabled="true"/>
                </span>
            </div>
            <div class="row">
                <span class="label">http:</span>
                <span class="content">{{http}}</span>
            </div>
            <div class="row">
                <span class="label">https:</span>
                <span class="content">{{https}}</span>
            </div>
        </div>

        <el-dialog title="修改转发服务配置"
                   width="350px"
                   v-loading="saving"
                   element-loading-text="保存中..."
                   :visible.sync="dlgVisible"
                   :close-on-click-modal="false">
            <div style="display: inline;">
                <div class="row">
                    <span class="label">启用:</span>
                    <span class="content">
                    <el-checkbox v-model="dataModel.enable"/>
                </span>
                </div>
                <div class="row">
                    <span class="label">http:</span>
                    <div class="content">
                        <el-input size="mini" v-model="dataModel.http.ip" placeholder="IP地址"/>
                        <el-input size="mini" v-model="dataModel.http.port" placeholder="端口号"/>
                    </div>
                </div>
                <div class="row">
                    <span class="label">https:</span>
                    <div class="content">
                        <el-input size="mini" v-model="dataModel.https.ip" placeholder="IP地址"/>
                        <el-input size="mini" v-model="dataModel.https.port" placeholder="端口号"/>
                    </div>
                </div>
                <div class="row">
                    <span class="label">&nbsp;</span>
                    <error-message class="content" :summary="errSummary" :detail="errDetail"/>
                </div>
                <div class="row">
                    <span class="label">&nbsp;</span>
                    <div class="content">
                        <el-button size="small" type="primary" @click="save">保存</el-button>
                        <el-button size="small" @click="dlgVisible = false">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import ErrorMessage from '@/components/ErrorMessage'

    @Component({
        components: {
            errorMessage: ErrorMessage
        }
    })
    export default class Server extends BaseComponent {
        errSummary = ""
        errDetail = ""
        enable = false
        http = ""
        https = ""
        dataModel = {
            enable: this.enable,
            http: {
                ip: "",
                port: "80"
            },
            https: {
                ip: "",
                port: "443"
            }
        }
        dlgVisible = false
        saving = false

        doModify() {
            this.dlgVisible = true;
        }

        onGetServerInfo(code, err, data) {
            if (code === 0) {
                this.enable = data.enable;
                if(this.isNullOrEmpty(data.http.ip)) {
                    this.http = "*:" + data.http.port;
                }
                else {
                    this.http = data.http.ip + ":" + data.http.port;
                }
                if(this.isNullOrEmpty(data.https.ip)) {
                    this.https = "*:" + data.https.port;
                }
                else {
                    this.https = data.https.ip + ":" + data.https.port;
                }

                this.dataModel = data;
            }
            else if (code !== 20001) {
                this.enable = false;
                this.http = "";
                this.https = ""
            }
        }
        getServerInfo() {
            this.post(this.uris.proxyCfgServerInfo, null, this.onGetServerInfo);
        }

        onSave(code, err, data) {
            this.saving = false;
            if (code === 0) {
                this.enable = data.enable;
                if(this.isNullOrEmpty(data.http.ip)) {
                    this.http = "*:" + data.http.port;
                }
                else {
                    this.http = data.http.ip + ":" + data.http.port;
                }
                if(this.isNullOrEmpty(data.https.ip)) {
                    this.https = "*:" + data.https.port;
                }
                else {
                    this.https = data.https.ip + ":" + data.https.port;
                }

                this.dataModel = data;
                this.dlgVisible = false;
            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
            }
        }
        save() {
            this.errSummary = ""
            this.errDetail = ""
            this.saving = true
            this.post(this.uris.proxyCfgServerUpdate, this.dataModel, this.onSave);
        }

        mounted() {
            this.getServerInfo();
        }
    }
</script>

<style scoped lang="scss">
    .server {

    }
    .body {
        font-size: small;
    }
    .row {
        display: flex;
        align-items: center;

        div {
            display: flex;
            align-items: center;
        }
    }
    .row:not(:first-child) {
        margin-top: 5px;
    }

    .label {
        display: block;
        width: 65px;
        text-align: right;
        color: #696969;
    }
    .content {
        margin-left: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;

        div {
        }
        div:not(:first-child) {
            margin-left: 5px;
        }

        .el-input {
            width: 125px;
        }
        .el-input:not(:first-child) {
            width: 75px;
        }
    }
</style>