<template>
    <el-card body-style="padding: 8px 20px;">
        <div slot="header" class="header">
            <div>
                <i class="el-icon-setting" ></i>
                <span>监听端口</span>
            </div>
            <div >
                <el-tooltip placement="top">
                    <div slot="content">
                        <span>刷新</span>
                    </div>
                    <el-button style="padding: 3px 5px;" type="text" icon="el-icon-shuaxin" @click="doSearch"/>
                </el-tooltip>
            </div>
        </div>

        <tableList class="content"
                   ref="tableList"
                   :uri="this.uris.sysListenPortList"
                   size="small"
                   :border="false">
            <template slot="columns">
                <el-table-column
                        prop="address"
                        label="地址"
                        align="right">
                </el-table-column>
                <el-table-column
                        prop="port"
                        label="端口"
                        width="85px"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="protocol"
                        label="协议"
                        width="65px"
                        align="left">
                </el-table-column>
            </template>
        </tableList>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import TableList from '@/components/table/TableList'

    @Component({
        components: {
            tableList: TableList
        }
    })
    export default class Listening extends BaseComponent {
        bodyStyle = {
            padding: "5px 1px 5px 10px"
        }

        doSearch() {
            this.$refs.tableList.doSearch();
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
    .content {
        //border-top: 0.5px solid #ebeef5;
    }
</style>