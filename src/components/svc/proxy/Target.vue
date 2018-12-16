<template>
    <el-collapse-item class="target">
        <div class="title" slot="title">
            <div>
                <span>{{title}}</span>
                <el-badge class="badge" type="primary" :value="itemCount" />
            </div>
            <div>
                <el-tooltip placement="top">
                    <div slot="content">
                        <span>添加</span>
                    </div>
                    <el-button size="small" type="text" icon="el-icon-jiajian"
                               style="padding: 0px 5px; margin-right: 10px;font-size: large;"
                               @click.stop="addItem"/>
                </el-tooltip>
            </div>
        </div>
        <tableList class="content"
                   ref="tableList"
                   :uri="listUri"
                   size="small"
                   :border="false" @searched="onSearched">
            <template slot="columns">
                <el-table-column
                        prop="domain"
                        label="域名"
                        align="right">
                </el-table-column>
                <el-table-column
                        prop="ip"
                        label="目标地址"
                        width="135px"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="port"
                        label="目标端口"
                        width="85px"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="version"
                        label="版本"
                        width="45px"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="disable"
                        label="已禁用"
                        width="65px"
                        align="left">
                    <div class="btn" slot-scope="scope">
                        <el-checkbox v-model="scope.row.disable" :disabled="true" />
                    </div>
                </el-table-column>
                <el-table-column width="100px">
                    <div class="btn" slot-scope="scope">
                        <el-button size="mini" @click="modifyItem(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
                    </div>
                </el-table-column>
            </template>
        </tableList>

        <el-dialog :title="dlgTitle"
                   width="350px"
                   v-loading="saving"
                   element-loading-text="保存中..."
                   :visible.sync="dlgVisible"
                   :append-to-body="true"
                   :close-on-click-modal="false">
            <div>
                <div class="row">
                    <span class="item-label">域名:</span>
                    <el-input class="item-content" size="mini" v-model="dataModel.domain" placeholder="域名，空表示全部" :disabled="domainEnable"/>
                </div>
                <div class="row">
                    <span class="item-label">目标地址:</span>
                    <el-input class="item-content" ref="ip" size="mini" v-model="dataModel.ip" placeholder="IP或名称"/>
                </div>
                <div class="row">
                    <span class="item-label">目标端口:</span>
                    <el-input class="item-content" ref="port" size="mini" v-model="dataModel.port" placeholder="端口号，1～65535"/>
                </div>
                <div class="row">
                    <span class="item-label">版本:</span>
                    <el-select class="item-content" size="mini" v-model="dataModel.version">
                        <el-option :value="0" label="0 - 默认"/>
                        <el-option :value="1" label="1 - 在TCP中添加PROXY头部"/>
                    </el-select>
                </div>
                <div class="row">
                    <span class="item-label">禁用:</span>
                    <el-checkbox class="item-content" v-model="dataModel.disable" />
                </div>
                <div class="row">
                    <span class="item-label">&nbsp;</span>
                    <error-message class="item-content" :summary="errSummary" :detail="errDetail"/>
                </div>
                <div class="row">
                    <span class="item-label">&nbsp;</span>
                    <div class="item-content">
                        <el-button size="small" type="primary" @click="save">保存</el-button>
                        <el-button size="small" @click="dlgVisible = false">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </el-collapse-item>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import ErrorMessage from '@/components/ErrorMessage'
    import TableList from '@/components/table/TableList'

    @Component({
        components: {
            errorMessage: ErrorMessage,
            tableList: TableList
        },
        props: {
            title: {
                type: String,
                default: ""
            },
            listUri: {
                type: String,
                default: ""
            },
            addUri: {
                type: String,
                default: ""
            },
            deleteUri: {
                type: String,
                default: ""
            },
            modifyUri: {
                type: String,
                default: ""
            }
        }
    })
    export default class Target extends BaseComponent {
        errSummary = ""
        errDetail = ""
        itemCount = 0
        dlgVisible = false
        dlgTitle = ""
        domainEnable = false
        saveUri = ""
        saving = false
        dataModel = {
            domain: "",
            ip: "",
            port: "",
            version: 0,
            disable: false
        }

        onUpdate(code, err, data) {
            this.saving = false;
            if (code === 0) {
                this.doSearch();
                this.dlgVisible = false;
            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
            }
        }

        save() {
            let uri = this.saveUri;
            if(this.isNullOrEmpty(uri)) {
                return;
            }
            if(this.isNullOrEmpty(this.dataModel.ip)) {
                this.errSummary = "目标地址为空";
                this.$refs.ip.focus();
                return;
            }
            let port = Number(this.dataModel.port);
            if(!(port > 0 && port < 65536)) {
                this.errSummary = "目标端口无效";
                this.$refs.port.focus();
                return;
            }

            this.errSummary = "";
            this.errDetail = "";
            this.saving = true;
            this.post(uri, this.dataModel, this.onUpdate);
        }

        addItem() {
            this.errSummary = "";
            this.errDetail = "";
            this.saving = false;
            this.dlgTitle = "添加转发项目";
            this.domainEnable = false;
            this.saveUri = this.addUri;
            this.dataModel.domain = "";
            this.dataModel.ip = "";
            this.dataModel.port = "";
            this.dataModel.version = 0;
            this.dataModel.disable = false;
            this.dlgVisible = true;
        }
        modifyItem(data) {
            this.errSummary = "";
            this.errDetail = "";
            this.saving = false;
            this.dlgTitle = "修改转发项目";
            this.domainEnable = true;
            this.saveUri = this.modifyUri;
            this.dataModel.domain = data.domain;
            this.dataModel.ip = data.ip;
            this.dataModel.port = data.port;
            this.dataModel.version = data.version;
            this.dataModel.disable = data.disable;
            this.dlgVisible = true;
        }
        deleteItem(data) {
            let uri = this.deleteUri;
            if(this.isNullOrEmpty(uri)) {
                return;
            }
            let argument = {
                domain: data.domain
            };

            this.errSummary = ""
            this.errDetail = ""
            this.post(uri, argument, this.onUpdate);
        }

        onSearched(data) {
            if(data) {
                this.itemCount = data.length;
            }
            else {
                this.itemCount = 0;
            }
        }

        doSearch() {
            this.$refs.tableList.doSearch();
        }
    }
</script>

<style scoped lang="scss">
    .target {
        padding: 0px;
        margin: 0px;
    }
    .title {
        display: flex;
        align-items: center;
        padding: 0px 0px 0px 20px;
        //background-color: #f9f9f9;

        div {
            display: flex;
            align-items: center;
        }
        div:first-child {
            flex: 1;
        }
    }
    .content {
        border-top: 0.5px solid #ebeef5;
    }
    .btn {
        display: flex;
        align-items: center;

        .el-button {
            padding: 5px 6px 3px 6px;
            margin: 0px;
        }
        .el-button:not(:first-child) {
            margin-left: 5px;
        }
    }
    .badge {
        margin-left: 5px;
    }

    .row {
        display: flex;
        align-items: center;
    }
    .row:not(:first-child) {
        margin-top: 8px;
    }
    .item-label {
        display: block;
        width: 75px;
        text-align: right;
    }
    .item-content {
        margin-left: 5px;
        flex: 1;
    }
</style>