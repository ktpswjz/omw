<template>
    <el-dialog :visible.sync="visible"
               :title="title"
               :top="top"
               :width="width"
               :append-to-body="true"
               :close-on-click-modal="false"
               @closed="handleInput(false)">
        <template slot="title">
            <slot name="title">{{title}}</slot>
        </template>
        <div class="body">
            <div class="item">
                <span class="item-label" :style="labelStyle">文件:</span>
                <el-input class="item-content" :size="size" ref="inputFile" v-model="selectedFile" placeholder="请选择文件" :readonly="true">
                    <el-button slot="append" icon="el-icon-more" @click="selectFile" :disabled="uploading"></el-button>
                </el-input>
            </div>

            <slot :uploading="uploading"></slot>

            <el-progress class="progress" v-show="uploadProgressVisible" :percentage="percentCompleted" :status="uploadStatus"/>
            <error-message class="content" :summary="errSummary" :detail="errDetail" :holder="false"/>
            <div>
                <span class="msg-status">{{statusMsg}}</span>
            </div>
        </div>
        <input class="input-file" ref="fileSelector" type="file" :accept="accept" v-on:input="onFileSelected"/>
        <span slot="footer">
            <el-button :size="size" @click="visible = false">关 闭</el-button>
            <el-button :size="size" type="primary" :disabled="uploading" @click="uploadFile">上 传</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import ErrorMessage from '@/components/ErrorMessage'

    @Component({
        components: {
            errorMessage: ErrorMessage
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: "",
            },
            width: {
                type: String,
                default: "50%",
            },
            top: {
                type: String,
                default: "15vh",
            },
            size: {
                type: String,
                default: "small"
            },
            forms: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            preUpload: {
                type: Function,
                default: function () {
                    return "";
                }
            },
            uri: {
                type: String,
                default: ""
            },
            accept: {
                type: String,
                default: ".zip, .tar, .gz"
            },
            labelWidth: {
                type: String,
                default: "auto"
            }
        },
        watch: {
            "value" : {
                handler: "onVisibleChanged"
            }
        }
    })
    export default class FileUpload extends BaseComponent {
        errSummary = ""
        errDetail = ""
        statusMsg = ""
        visible = false
        selectedFile = ""
        uploading = false
        uploadStatus = ""
        percentCompleted = 0
        uploadProgressVisible = false

        get labelStyle() {
            return "width: " + this.labelWidth + ";"
        }

        handleInput(value) {
            this.$emit('input', value);
        }

        onVisibleChanged(val) {
            this.visible = val;
            if(!val) {
                this.selectedFile = "";
                this.errSummary = "";
                this.errDetail = "";
                this.uploading = false;
                this.uploadProgressVisible = false;
                this.$refs.fileSelector.value = null;
            }
        }

        onFileSelected() {
            this.selectedFile = this.$refs.fileSelector.value;
        }
        selectFile() {
            this.$refs.fileSelector.click();
        }

        onUploadingFile(evt) {
            this.percentCompleted = Math.round( (evt.loaded * 100) / evt.total );
            if(evt.loaded === evt.total) {
                this.statusMsg = "上传完成， 正在发布...";
            }
        }
        onUploadedFile(code, err, data) {
            if (code === 0) {
                this.uploadStatus = "success";
                this.statusMsg = "上传完成， 发布成功";
                this.$nextTick(function () {
                    this.$emit("onUploaded");
                });
            }
            else {
                this.statusMsg = "";
                this.errSummary = err.summary ;
                this.errDetail = err.detail;
                this.uploadStatus = "exception";
            }
            this.uploading = false;
        }

        uploadFile() {
            if(this.selectedFile === "") {
                this.errSummary = "请选择文件";
                this.$refs.inputFile.select();
                return;
            }

            if(this.preUpload) {
                let error = this.preUpload();
                if(this.isNotNullOrEmpty(error)) {
                    this.errSummary = error;
                    return;
                }
            }

            let formData = new FormData();
            formData.append("file", this.$refs.fileSelector.files[0]);
            if(this.forms) {
                let count = this.forms.length;
                for(let i = 0; i < count; i++) {
                    let item = this.forms[i];
                    if(item) {
                        formData.append(item.name, item.value);
                    }
                }
            }

            let uri = this.uri;
            if(this.isNullOrEmpty(uri)) {
                return;
            }
            this.uploadProgressVisible = true;
            this.uploading = true;
            this.statusMsg = "正在上传...";
            this.errSummary = "";
            this.errDetail = "";
            this.upload(uri, formData, this.onUploadedFile, this.onUploadingFile);
        }
    }
</script>

<style scoped lang="scss">
    .body {

    }
    .progress {
        padding: 10px 0px 5px 0px;
        margin: 0px;
    }
    .input-file {
        display: none;
    }
    .msg-status {
        color: blue;
    }
    .item {
        display: flex;
        align-items: center;
    }
    .item-label {
        display: block;
        text-align: right;
    }
    .item-content {
        margin-left: 5px;
        flex: 1;
    }
</style>