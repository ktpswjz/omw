<template>
    <el-card body-style="padding: 8px 20px;">
        <div slot="header" class="header">
            <div>
                <i class="el-icon-iconfontzhuji" ></i>
                <span>主机信息</span>
            </div>
            <div >
                <el-tooltip placement="top">
                    <div slot="content">
                        <span>刷新</span>
                    </div>
                    <el-button style="padding: 3px 5px;" type="text" icon="el-icon-shuaxin" @click="getHostInfo"/>
                </el-tooltip>
            </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中...">
            <!-- <div class="item">
                <span>主机标识:</span>
                <span class="text">{{id}}</span>
            </div> -->
            <div class="item">
                <span>主机名称:</span>
                <span class="text">{{name}}</span>
            </div>
            <div class="item">
                <span>启动时间:</span>
                <span class="text">{{bootTime}}</span>
            </div>
            <div class="item">
                <span>系统时区:</span>
                <span class="text">{{timeZone}}</span>
            </div>
            <div class="item">
                <span>操作系统:</span>
                <span class="text">{{os}}</span>
            </div>
            <div class="item">
                <span>系统平台:</span>
                <span class="text">{{platform}}</span>
            </div>
            <div class="item">
                <span>平台版本:</span>
                <span class="text">{{platformVersion}}</span>
            </div>
            <div class="item">
                <span>内核版本:</span>
                <span class="text">{{kernelVersion}}</span>
            </div>
            <div class="item">
                <span>系统内存:</span>
                <span class="text">{{memory}}</span>
            </div>
            <div class="item">
                <span>处理器:</span>
                <span class="text">{{cpu}}</span>
            </div>
        </div>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'

    @Component
    export default class Host extends BaseComponent {
        bodyStyle = {
            padding: "5px 1px 5px 10px"
        }
        loading = false
        id = ""
        name = ""
        bootTime = ""
        os = ""
        platform = ""
        platformVersion = ""
        kernelVersion = ""
        cpu = ""
        memory = ""
        timeZone = ""

        onGetHostInfo(code, err, data) {
            this.loading = false
            if (code === 0) {
                this.id = data.id;
                this.name = data.name;
                this.bootTime = data.bootTime;
                this.os = data.os;
                this.platform = data.platform;
                this.platformVersion = data.platformVersion;
                this.kernelVersion = data.kernelVersion;
                this.cpu = data.cpu;
                this.memory = data.memory;
                this.timeZone = data.timeZone;
            }
        }
        getHostInfo() {
            this.loading = true
            this.post(this.uris.sysHostInfo, null, this.onGetHostInfo);
        }

        mounted() {
            this.getHostInfo();
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