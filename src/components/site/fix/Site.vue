<template>
    <el-card class="site" :body-style="bodyStyle">
        <div class="header" slot="header">
            <div >
                <i v-if="icon !== ''" :class="icon" style="margin-right: 3px;"></i>
                <span style="padding-left: 3px;">{{title}}</span>
            </div>
            <div>
                <el-tooltip content="上传" placement="top">
                    <el-button style="padding: 1px 3px;" type="text" icon="el-icon-upload" @click="showUploadDialog" />
                </el-tooltip>
            </div>
        </div>

        <div class="body" v-loading="loading" element-loading-text="加载中...">
            <div class="item">
                <span class="item-label">访问地址:</span>
                <span class="item-content">
                    <a :href="info.url" target="_blank">{{info.url}}</a>
                </span>
            </div>
            <div class="item">
                <span class="item-label">发布时间:</span>
                <span class="item-content">{{info.deployTime}}</span>
            </div>
            <div class="item">
                <span class="item-label">版本号:</span>
                <span class="item-content">{{info.version}}</span>
            </div>
        </div>

        <fileUpload v-model="dlgVisible"
                    width="500px"
                    :title="dlgTitle"
                    :uri="uploadUri"
                    @onUploaded="getInfo">
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
        },
        props: {
            title: {
                type: String,
                detail: ""
            },
            icon: {
                type: String,
                default: ""
            },
            infoUri: {
                type: String,
                detail: ""
            },
            uploadUri: {
                type: String,
                detail: ""
            }
        }
    })
    export default class Site extends BaseComponent {
        bodyStyle = {
            padding: "0px"
        }
        dlgVisible = false
        loading = false
        info = {
            version: "",
            deployTime: "",
            url: ""
        }

        get dlgTitle() {
            return "上传" + this.title;
        }

        showUploadDialog() {
            this.dlgVisible = true;
        }

        onGetInfo(code, err, data) {
            this.loading = false
            if (code === 0) {
                this.info.deployTime = data.deployTime;
                this.info.version = data.version;
                this.info.url = data.url;
            }
            else {
                this.info.deployTime = "";
                this.info.version = "";
                this.info.url = "";
            }
        }
        getInfo() {
            this.loading = true
            this.post(this.infoUri, null, this.onGetInfo);
        }
        mounted() {
            this.getInfo();
        }
    }
</script>

<style scoped lang="scss">
    .site {

    }

    .header {
        display: flex;
        align-items: center;

        div {
            display: flex;
            align-items: center;
        }
        div:first-child {
            flex: 1;
        }
    }

    .body {
        padding: 5px 0px 5px 10px;
    }

    .item {
        display: flex;
        align-items: center;
        font-size: small;
    }
    .item:not(:first-child) {
        margin-top: 5px;
    }
    .item-label {
        display: block;
        width: 65px;
        text-align: right;
    }
    .item-content {
        margin-left: 10px;
        font-weight: bold;

        a:link {
            text-decoration: none;
        }
        a:visited {
            text-decoration: none;
        }
        a:hover {
            text-decoration: none;
        }
        a:active {
            text-decoration: none;
        }
    }
</style>