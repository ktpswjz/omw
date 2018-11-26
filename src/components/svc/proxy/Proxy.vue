<template>
    <el-card class="proxy" :body-style="bodyStyle">
        <div class="title" slot="header">
            <div>
                <i class="el-icon-zhongzhuan"></i>
                <span style="padding-left: 3px;">转发服务</span>
            </div>
            <div>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span >刷新</span>
                    </div>
                    <el-button style="margin: 0px 2px; padding: 0px;" type="text" icon="el-icon-shuaxin" @click="doRefresh"/>
                </el-tooltip>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span>修改配置</span>
                    </div>
                    <el-button size="small" type="text" icon="el-icon-xiugai"
                               style="padding: 0px 5px; margin-right: 12px;font-size: large;"
                               @click="modifyServer"/>
                </el-tooltip>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span style="font-weight: bold;">
                            <span v-if="svcStatus === 1">启动中</span>
                            <span v-else-if="svcStatus === 2">运行中</span>
                            <span v-else-if="svcStatus === 3">停止中</span>
                            <span v-else>已停止</span>
                        </span>
                        <span v-if="this.isNotNullOrEmpty(svcStartTime)" style="color: lightgray;">
                            <br />
                            <span>启动时间:&nbsp;</span>
                            <span>{{svcStartTime}}</span>
                        </span>
                        <span v-if="this.isNotNullOrEmpty(svcError)" style="color: lightgray;">
                            <br />
                            <span>错误信息:&nbsp;</span>
                            <span style="color: red;">{{svcError}}</span>
                        </span>
                    </div>
                    <el-dropdown trigger="click">
                        <span class="status">
                            <i v-if="svcStatus === 1" class="el-icon-loading" style="color: #0000f0"/>
                            <i v-else-if="svcStatus === 2" class="el-icon-yunxingzhong" style="color: #00f000"/>
                            <i v-else-if="svcStatus === 3" class="el-icon-loading" style="color: #0000f0"/>
                            <i v-else class="el-icon-yitingzhi" style="color: #f00000"/>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="svcStatus === 0">
                                <el-button type="text" @click="startSvc">启动</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="svcStatus === 2">
                                <el-button type="text" @click="restartSvc">重启</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="svcStatus === 2">
                                <el-button type="text" @click="stopSvc">停止</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>
            </div>
        </div>
        <div>
            <server ref="server" class="server" />
            <el-collapse class="target" >
                <target title="http 转发列表"
                        :listUri="this.uris.proxyCfgHttpInfo"
                        :addUri="this.uris.proxyCfgHttpAdd"
                        :deleteUri="this.uris.proxyCfgHttpDelete"
                        :modifyUri="this.uris.proxyCfgHttpModify"/>
                <target title="https 转发列表"
                        :listUri="this.uris.proxyCfgHttpsInfo"
                        :addUri="this.uris.proxyCfgHttpsAdd"
                        :deleteUri="this.uris.proxyCfgHttpsDelete"
                        :modifyUri="this.uris.proxyCfgHttpsModify"/>
            </el-collapse>
        </div>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import Server from './Server'
    import Target from './Target'

    @Component({
        components: {
            server: Server,
            target: Target
        }
    })
    export default class Proxy extends BaseComponent {
        bodyStyle = {
            padding: '0px'
        }
        svcStatus = 0  // 0-已停止; 1-启动中; 2-运行中; 3-停止中
        svcStartTime = null
        svcError = ""

        modifyServer() {
            let server = this.$refs["server"];
            if(server) {
                server.doModify();
            }
        }

        doRefresh() {
            this.getStatus();
        }

        onSvcOpt(code, err, data) {

        }
        startSvc() {
            this.post(this.uris.proxySvcStart, null, this.onSvcOpt);
        }
        stopSvc() {
            this.post(this.uris.proxySvcStop, null, this.onSvcOpt);
        }
        restartSvc() {
            this.post(this.uris.proxySvcRestart, null, this.onSvcOpt);
        }

        onSocketNotify(id, data) {
            if(id === this.evts.socket.proxyStatus) {
                this.svcStatus = data.status;
                this.svcStartTime = data.startTime;
                this.svcError = data.error;
            }
        }

        onGetStatus(code, err, data) {
            if (code === 0) {
                this.svcStatus = data.status;
                this.svcStartTime = data.startTime;
                this.svcError = data.error;
            }
        }
        getStatus() {
            this.post(this.uris.proxySvcStatus, null, this.onGetStatus);
        }

        mounted() {
            this.getStatus();
            this.evtbus.on("socket", this.onSocketNotify);
        }
        beforeDestroy() {
            this.evtbus.off("socket", this.onSocketNotify);
        }
    }
</script>

<style scoped lang="scss">
    .proxy {
    }

    .title {
        display: flex;
        align-items: center;
        padding-right: 17px;

        div {
            display: flex;
            align-items: center;
        }
        div:first-child {
            flex: 1;
        }
    }

    .status {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: large;
    }

    .server {
        padding: 5px 0px 5px 10px;
    }
</style>