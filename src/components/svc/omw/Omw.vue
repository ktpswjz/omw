<template>
    <el-card :body-style="bodyStyle">
        <div slot="header" class="header">
            <div>
                <i class="el-icon-houtaifuwu" ></i>
                <span>后台服务</span>
            </div>
            <div >
                <el-tooltip placement="top">
                    <div slot="content">
                        <span>刷新</span>
                    </div>
                    <el-button style="padding: 2px 5px;" type="text" icon="el-icon-shuaxin" @click="getInfo"/>
                </el-tooltip>
            </div>
            <div >
                <el-tooltip v-show="canUpdate" placement="top">
                    <div slot="content">
                        <span>重启</span>
                    </div>
                    <el-button v-if="restarting" style="padding: 2px 10px;" type="text" icon="el-icon-loading"/>
                    <el-button v-else style="padding: 2px 10px;" type="text" icon="el-icon-restart" @click="restart"/>
                </el-tooltip>
            </div>
            <div >
                <el-tooltip v-show="canRestart && canUpdate" placement="top">
                    <div slot="content">
                        <span>上传</span>
                    </div>
                    <el-button style="padding: 2px 5px;" type="text" icon="el-icon-upload" @click="dlgVisible = true"/>
                </el-tooltip>
            </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中...">
            <div class="item">
                <span>服务名称:</span>
                <span class="text">{{info.name}}</span>
            </div>
            <div class="item">
                <span>启动时间:</span>
                <span class="text">{{info.bootTime}}</span>
            </div>
            <div class="item">
                <span>版本号:</span>
                <span class="text">{{info.version}}</span>
            </div>
        </div>

        <fileUpload v-model="dlgVisible"
                    width="500px"
                    title="上传并更新后台服务"
                    :uri="this.uris.svcOmwUpdate"
                    @onUploaded="onUploaded">
        </fileUpload>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import FileUpload from '@/components/dialog/FileUpload'

    @Component({
        components: {
            fileUpload: FileUpload
        }
    })
    export default class Omw extends BaseComponent {
        bodyStyle = {
            padding: "5px 1px 5px 20px"
        }
        loading = false
        canUpdate = false
        canRestart = false
        restarting = false
        info = {
            name: "",
            version: "",
            bootTime: "",
            remark: ""
        }
        dlgVisible = false

        onGetUpdateEnable(code, err, data) {
            if (code === 0) {
                this.canUpdate = data;
            }
        }
        getUpdateEnable() {
            this.post(this.uris.svcOmwUpdateEnable, null, this.onGetUpdateEnable);
        }

        onGetRestartEnable(code, err, data) {
            if (code === 0) {
                this.canRestart = data;
            }
        }
        getRestartEnable() {
            this.post(this.uris.svcOmwRestartEnable, null, this.onGetRestartEnable);
        }

        onUploaded() {
            this.sleep(2000);
            this.redirectTo("/login");
        }

        onRestart(code, err, data) {
            this.sleep(3000);
            this.restarting = false;
            if (code === 0) {
                this.redirectTo("/login");
            }
            else if (code !== 20001) {
            }
        }
        restart() {
            this.restarting = true;
            this.post(this.uris.svcOmwRestart, null, this.onRestart);
        }

        onGetInfo(code, err, data) {
            this.loading = false
            if (code === 0) {
                this.info.name = data.name;
                this.info.bootTime = data.bootTime;
                this.info.version = data.version;
                this.info.remark = data.remark;
            }
        }
        getInfo() {
            this.loading = true
            this.post(this.uris.svcOmwInfo, null, this.onGetInfo);
        }

        mounted() {
            this.getInfo();
            this.getUpdateEnable();
            this.getRestartEnable();
        }
    }
</script>

<style scoped lang="scss">
    .header {
        display: flex;
        align-items: center;

        div {
            display: flex;
            align-items: center;
        }

        div:first-child {
            flex: 1;

            i {
                width: 30px;
                text-align: center;
            }
        }
    }

    .item {
        display: flex;
        align-items: center;
        font-size: 13px;
    }
    .item:not(:first-child) {
        margin-top: 5px;
    }

    .text {
        font-weight: bold;
        margin-left: 3px;
    }
</style>