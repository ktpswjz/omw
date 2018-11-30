<template>
    <el-card class="cfg" :body-style="bodyStyle">
        <div class="title" slot="header">
            <div>
                <span style="padding-left: 3px;">JAR服务信息</span>
            </div>
            <div>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span >刷新</span>
                    </div>
                    <el-button style="margin: 0px 10px; padding: 0px;" type="text" icon="el-icon-shuaxin" @click="doRefresh"/>
                </el-tooltip>

                <el-tooltip content="上传" placement="top">
                    <el-button style="margin: 0px 10px; padding: 0px;" type="text" icon="el-icon-upload" @click="showUploadDialog" />
                </el-tooltip>
            </div>
        </div>
        <div class="body" v-loading="loading" element-loading-text="加载中...">
            <div class="row">
                <span>程序包根路径：</span>
                <span>{{modelCfg.root}}</span>
            </div>
            <div class="row">
                <span>上传文件说明：</span>
                <span>{{modelCfg.remark}}</span>
            </div>
            <div class="row">
                <span>启动文件样例：</span>
                <span>
                    <pre class="code">#!/bin/sh
cd `dirname $0`
java -jar application.jar -Xmx1024m</pre>
                </span>
            </div>
            <div class="row">
                <span>信息文件样例：</span>
                <span>
                    <pre class="code">{
    "name": "COPD患者端服务",
    "version": "1.0.1.1",
    "remark": "监听端口18908"
}</pre>
                </span>
            </div>
            <div class="row">
                <span>压缩包文件夹：</span>
                <span>
                    <pre class="code">- copd.zip
  - application.jar
  - startup.sh
  - info.json</pre>
                </span>
            </div>
        </div>

        <fileUpload v-model="dlgVisible"
                    width="500px"
                    accept=".zip"
                    :title="dlgTitle"
                    :uri="this.uris.svcJarUpload"
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
    export default class Cfg extends BaseComponent {
        bodyStyle = {
            padding: '5px 20px'
        }
        modelCfg = {
            root: "",
            remark: ""
        }
        loading = false
        dlgVisible = false
        dlgTitle = "上传并安装服务"

        doRefresh() {
            this.getCfg();
            this.$emit("refresh");
        }

        showUploadDialog() {
            this.dlgVisible = true;
        }

        onUploaded() {
            this.$emit("refresh");
        }

        onGetCfg(code, err, data) {
            this.loading = false
            if (code === 0) {
                this.modelCfg.root = data.root;
                this.modelCfg.remark = data.remark;
            }
        }
        getCfg() {
            this.loading = true
            this.post(this.uris.svcJarCfg, null, this.onGetCfg);
        }

        mounted() {
            this.getCfg();
        }
    }
</script>

<style scoped lang="scss">
    .cfg {

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
    .body {

    }
    .row {
        display: flex;
        align-items: start;
        font-size: small;

        span:first-child {
            padding-right: 5px;
        }
        span:not(:first-child) {
            font-weight: bold;
            border-color: aquamarine;
        }
    }
    .row:not(:first-child) {
        margin-top: 10px;
    }
    .code {
        padding: 5px;
        margin: 0px;
        border: 1px solid #e6e6e6;
        border-radius: 3px;
        background-color: #f6f6f6;
    }
</style>