<template>
    <el-collapse-item class="service">
        <div class="title" slot="title" @click.stop="onHeadClick">
            <div>
                <span v-if="info.displayName === ''">{{info.name}}</span>
                <span v-else>{{info.displayName}}</span>
            </div>
            <div>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span >刷新</span>
                    </div>
                    <el-button style="margin: 0px; padding: 0px;" type="text" icon="el-icon-shuaxin" @click="doRefresh"/>
                </el-tooltip>

                <el-tooltip content="上传应用" placement="top">
                    <el-button style="margin: 0px 20px; padding: 0px;" type="text" icon="el-icon-upload" @click="showUploadDialog" />
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
            <div class="item">
                <span class="item-label">服务名称:</span>
                <span class="item-content">{{info.name}}</span>
            </div>
            <div class="item">
                <span class="item-label">应用路径:</span>
                <span class="item-content">{{info.appFolder}}</span>
            </div>
            <div class="item">
                <span class="item-label">访问地址:</span>
                <div class="item-content">
                    <div v-for="(url, index) in info.urls" :key="index">{{url}}</div>
                </div>
            </div>
        </div>
        <div class="apps">
            <el-card :body-style="bodyStyle" shadow="never">
                <div slot="header">
                    <div>
                        <span>应用程序</span>
                    </div>
                </div>
                <tableList class="content"
                           ref="tableList"
                           :filter="appFilter"
                           :uri="this.uris.svcTomcatAppList"
                           size="small"
                           :border="false" @searched="onAppSearched">
                    <template slot="columns">
                        <el-table-column
                                prop="appName"
                                label="应用名称"
                                align="right">
                        </el-table-column>
                        <el-table-column
                                prop="deployTime"
                                label="发布时间"
                                width="155px"
                                align="left">
                        </el-table-column>
                        <el-table-column width="65px">
                            <div class="btn" slot-scope="scope">
                                <el-button size="mini" type="danger" @click="deleteApp(scope.row)">删除</el-button>
                            </div>
                        </el-table-column>
                    </template>
                </tableList>
            </el-card>
        </div>

        <fileUpload v-model="dlgVisible"
                    width="500px"
                    labelWidth="65px"
                    accept=".war, .zip"
                    :title="dlgTitle"
                    :uri="this.uris.svcTomcatAppUpload"
                    :forms="getForms"
                    @onUploaded="doRefresh">
            <div class="form" slot-scope="scope">
                <span class="form-label">重启服务:</span>
                <el-checkbox class="item-content" v-model="autoRestart" :disabled="scope.uploading"/>
            </div>
        </fileUpload>
    </el-collapse-item>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import FileUpload from '@/components/dialog/FileUpload'
    import TableList from '@/components/table/TableList'

    @Component({
        components: {
            fileUpload: FileUpload,
            tableList: TableList
        },
        props: {
            info: {
                type: Object,
                request: true
            }
        }
    })
    export default class Service extends BaseComponent {
        svcStatus = 0  // 0-未安装; 1-运行中; 2-已停止
        dlgVisible = false
        bodyStyle = {
            padding: '0px'
        }
        appFilter = {
            name: this.info.name
        }
        autoRestart = false

        onHeadClick() {
            console.log("onHeadClick");
        }

        get dlgTitle() {
            return "上传并更新应用";
        }

        get getForms() {
            return [
                {
                    name: "name",
                    value: this.info.name
                },
                {
                    name: "restart",
                    value: this.autoRestart
                }
            ];
        }

        showUploadDialog() {
            this.dlgVisible = true;
        }

        onAppSearched(){

        }

        doSearchApp() {
            this.$refs.tableList.doSearch();
        }

        doRefresh() {
            this.doSearchApp();
            this.getSvcStatus();
        }

        onDeleteApp(code, err, data) {
            if(code === 0) {
                this.doSearchApp();
            }
        }
        deleteApp(data) {
            let argument = {
                serviceName: data.serviceName,
                appName: data.appName
            };

            this.post(this.uris.svcTomcatAppDelete, argument, this.onDeleteApp);
        }

        onSvcOpt(code, err, data) {
            if(code === 0) {
                this.svcStatus = data;
            }
        }
        startSvc() {
            let argument = {
                name: this.info.name
            };
            this.post(this.uris.svcStart, argument, this.onSvcOpt);
        }
        stopSvc() {
            let argument = {
                name: this.info.name
            };
            this.post(this.uris.svcStop, argument, this.onSvcOpt);
        }
        restartSvc() {
            let argument = {
                name: this.info.name
            };
            this.post(this.uris.svcRestart, argument, this.onSvcOpt);
        }
        getSvcStatus() {
            let argument = {
                name: this.info.name
            };
            this.post(this.uris.svcStatus, argument, this.onSvcOpt);
        }

        mounted() {
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
    }

    .content {
        border-top: 0.5px solid #ebeef5;
    }

    .item {
        display: flex;
        align-items: start;
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

    .apps {

    }
    .app {

    }
    .btn {
        .el-button {
            padding: 4px 6px 3px 6px;
            margin: 0px;
        }
        .el-button:not(:first-child) {
            margin-left: 5px;
        }
    }


    .form {
        display: flex;
        align-items: center;
        margin: 5px 0px;
    }
    .form-label {
        display: block;
        text-align: right;
        width: 65px;
    }
    .form-content {
        margin-left: 5px;
        flex: 1;
    }
</style>