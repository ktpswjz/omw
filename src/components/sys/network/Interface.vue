<template>
    <el-card :body-style="bodyStyle">
        <div slot="header" class="header">
            <div>
                <i class="el-icon-wangqia" ></i>
                <span>网卡信息</span>
            </div>
            <div>
                <el-select v-model="nic" value-key="name" placeholder="请选择网卡" class="selector" size="mini">
                    <el-option v-for="(item, index) in nics"
                               :key="index"
                               :value="item"
                               :label="item.name">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中...">
            <div v-if="nic !== null">
                <div class="item">
                    <span>网卡名称:</span>
                    <span class="text">{{nic.name}}</span>
                </div>
                <div class="item">
                    <span>最大传输单元:</span>
                    <span class="text">{{nic.mtu}}</span>
                </div>
                <div class="item">
                    <span>MAC地址:</span>
                    <span class="text">{{nic.macAddr}}</span>
                </div>
                <div class="item">
                    <span>IP地址:</span>
                    <span class="text" >
                        <div v-for="(addr, index) in nic.ipAddrs" :key="index" v-if="isIpV4(addr)">{{addr}}&nbsp;</div>
                    </span>
                </div>
                <div class="item">
                    <span>状态:</span>
                    <span class="text" v-for="(flag, index) in nic.flags" :key="index">
                        {{flag}}&nbsp;
                    </span>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'

    @Component
    export default class Interface extends BaseComponent {
        bodyStyle = {
            padding: "5px 1px 5px 20px"
        }
        loading = false
        nics = new Array(0)
        nic = null

        isIpV4(ip) {
            if(ip.indexOf(":") === -1) {
                return true;
            }
            return false;
        }

        onGetInterfaces(code, err, data) {
            this.loading = false
            this.nics = new Array(0);
            this.nic = null;

            if (code === 0) {
                let count = data.length;
                for (let i = 0; i < count; i++) {
                    if(this.isNullOrEmpty(data[i].macAddr)) {
                        continue;
                    }
                    this.nics.push(data[i])
                }

                if (this.nics.length > 0) {
                    this.$nextTick(function(){
                        this.nic = this.nics[this.nics.length-1];
                    });
                }
            }
        }
        getInterfaces() {
            this.loading = true
            this.post(this.uris.sysNetworkInterfaceList, null, this.onGetInterfaces);
        }

        mounted() {
            this.getInterfaces();
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

            .el-select {
                width: 120px;
                margin: 0px;
                padding: 0px;
            }
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
        align-items: start;
        font-size: 13px;
        overflow: hidden;
    }
    .item:not(:first-child) {
        margin-top: 5px;
    }

    .text {
        font-weight: bold;
        margin-left: 3px;
    }
</style>