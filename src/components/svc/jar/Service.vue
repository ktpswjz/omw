<template>
    <el-collapse-item class="service">
        <div class="title" slot="title" @click.stop="onHeadClick">
            <div>
                <span v-if="info.name === ''">{{info.service}}</span>
                <span v-else>{{info.name}}</span>
            </div>
            <div>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span >刷新</span>
                    </div>
                    <el-button style="margin: 0px 10px; padding: 0px;" type="text" icon="el-icon-shuaxin" @click="doRefresh"/>
                </el-tooltip>

                <el-tooltip content="卸载中..." placement="top" v-if="deleting">
                    <el-button style="margin: 0px 10px; padding: 0px;" type="text" icon="el-icon-loading" />
                </el-tooltip>
                <el-tooltip content="卸载" placement="top" v-else>
                    <el-button style="margin: 0px 10px; padding: 0px;" type="text" icon="el-icon-xiezai" @click="deleteSvc" />
                </el-tooltip>

                <el-tooltip content="上传" placement="top">
                    <el-button style="margin: 0px 10px; padding: 0px;" type="text" icon="el-icon-upload" @click="showUploadDialog" />
                </el-tooltip>

                <el-tooltip placement="top">
                    <div slot="content">
                        <span v-if="svcStatus === 1">运行中</span>
                        <span v-else>已停止</span>
                    </div>
                    <el-dropdown trigger="click">
                        <span class="status">
                            <i v-if="svcStatus === 1" class="el-icon-yunxingzhong" style="color: #00f000"/>
                            <i v-else class="el-icon-yitingzhi" style="color: #f00000"/>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="svcStatus === 0 || svcStatus === 2">
                                <el-button type="text" @click="startSvc">启动</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="svcStatus === 1">
                                <el-button type="text" @click="restartSvc">重启</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="svcStatus === 1">
                                <el-button type="text" @click="stopSvc">停止</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>
            </div>
        </div>
        <div class="content">
            <div class="item" v-show="this.isNotNullOrEmpty(info.service)">
                <span class="item-label">服务名称:</span>
                <span class="item-content">{{info.service}}</span>
            </div>
            <div class="item" v-show="this.isNotNullOrEmpty(info.version)">
                <span class="item-label">版本号:</span>
                <span class="item-content">{{info.version}}</span>
            </div>
            <div class="item" v-show="this.isNotNullOrEmpty(info.deployTime)">
                <span class="item-label">发布时间:</span>
                <span class="item-content">{{info.deployTime}}</span>
            </div>
            <div class="item" v-show="this.isNotNullOrEmpty(info.remark)">
                <span class="item-label">说备注明:</span>
                <span class="item-content">{{info.remark}}</span>
            </div>
        </div>

        <fileUpload v-model="dlgVisible"
                    width="500px"
                    accept=".zip"
                    :title="dlgTitle"
                    :uri="this.uris.svcJarUpload"
                    :forms="getForms"
                    @onUploaded="onUploaded">
        </fileUpload>
    </el-collapse-item>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import FileUpload from '@/components/dialog/FileUpload'

    @Component({
        components: {
            fileUpload: FileUpload
        },
        props: {
            svcInfo: {
                type: Object,
                request: true
            }
        }
    })
    export default class Service extends BaseComponent {
        svcStatus = 0  // 0-未安装; 1-运行中; 2-已停止
        dlgVisible = false
        deleting = false

        info = {
            service: "",
            name: "",
            version: "",
            remark: "",
            deployTime: ""
        }

        onHeadClick() {
            console.log("onHeadClick");
        }

        get dlgTitle() {
            if(this.isNotNullOrEmpty(this.info.name)) {
                return "上传并更新" + this.info.name;
            }
            else {
                return "上传并更新" + this.info.service;
            }
        }

        get getForms() {
            return [
                {
                    name: "name",
                    value: this.info.service
                }
            ];
        }

        showUploadDialog() {
            this.dlgVisible = true;
        }

        doRefresh() {
            this.getSvcStatus();
            this.getInfo();
        }

        onUploaded() {
            this.getSvcStatus();
            this.getInfo();
        }

        onSvcOpt(code, err, data) {
            if(code === 0) {
                this.svcStatus = data;
            }
            else if(code !== 20001) {
                this.error(err);
            }
        }
        startSvc() {
            let argument = {
                name: this.info.service
            };
            this.post(this.uris.svcStart, argument, this.onSvcOpt);
        }
        stopSvc() {
            let argument = {
                name: this.info.service
            };
            this.post(this.uris.svcStop, argument, this.onSvcOpt);
        }
        restartSvc() {
            let argument = {
                name: this.info.service
            };
            this.post(this.uris.svcRestart, argument, this.onSvcOpt);
        }
        getSvcStatus() {
            let argument = {
                name: this.info.service
            };
            this.post(this.uris.svcStatus, argument, this.onSvcOpt);
        }

        onDeleteSvc(code, err, data) {
            this.deleting = false;
            if(code === 0) {
                this.$emit("deleted");
            }
            else if(code !== 20001) {
                this.error(err);
            }
        }
        deleteSvc() {
            let argument = {
                name: this.info.service
            };
            this.deleting = true;
            this.post(this.uris.svcJarUninstall, argument, this.onDeleteSvc);
        }

        onGetInfo(code, err, data) {
            if (code === 0) {
                this.info.name = data.name;
                this.info.version = data.version;
                this.info.remark = data.remark;
                this.info.deployTime = data.deployTime;
            }
            else if (code !== 20001) {
            }
        }
        getInfo() {
            let argument = {
                name: this.info.service
            };
            this.post(this.uris.svcJarInfo, argument, this.onGetInfo);
        }


        mounted() {
            if(this.svcInfo) {
                this.info.service = this.svcInfo.service;
                this.info.name = this.svcInfo.name;
                this.info.version = this.svcInfo.version;
                this.info.remark = this.svcInfo.remark;
                this.info.deployTime = this.svcInfo.deployTime;
            }

            this.getSvcStatus();
        }
    }
</script>

<style scoped lang="scss">
    .service {
    }
    .title {
        display: flex;
        align-items: center;
        padding: 0px 15px 0px 20px;
        cursor: default;

        div {
            display: flex;
            align-items: center;
        }
        div:first-child {
            flex: 1;
        }
    }
    .status {
        font-size: large;
        cursor: pointer;
        margin-left: 10px;
    }

    .content {
        border-top: 0.5px solid #ebeef5;
    }

    .item {
        display: flex;
        align-items: center;
        margin-top: 3px;
    }

    .item-label {
        display: block;
        width: 75px;
        text-align: right;
    }
    .item-content {
        margin-left: 5px;
        flex: 1;
        font-weight: bold;
    }
</style>