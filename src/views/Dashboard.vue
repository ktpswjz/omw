<template>
    <div class="dashboard">
        <div class="row">
            <div class="col">
                <el-card class="cell" :body-style="bodyStyle" v-if="siteSetting.dashboard.tomcatVisible">
                    <div class="title" slot="header">
                        <div>
                            <i class="el-icon-tomcat"></i>
                            <span style="padding-left: 3px;">tomcat</span>
                        </div>
                    </div>
                    <tomcatInfo />
                </el-card>
                <proxy class="cell" v-if="siteSetting.dashboard.proxyVisible"/>
                <adminSite class="cell"
                           title="管理网站"
                           icon="el-icon-wangzhan"
                           :infoUri="this.uris.siteOmwInfo"
                           :uploadUri="this.uris.siteOmwUpload"/>
            </div>
            <div class="col" style="min-width: 40%;">
                <svcOmw class="cell" />
                <host class="cell" />
                <interface class="cell" />
            </div>
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import AdminSite from '@/components/site/fix/Site'
    import Proxy from '@/components/svc/proxy/Proxy'
    import Host from '@/components/sys/host/Host'
    import Interface from '@/components/sys/network/Interface'
    import SvcOmw from '@/components/svc/omw/Omw'
    import TomcatInfo from '@/components/svc/tomcat/Tomcat'
    import OtherInfo from '@/components/svc/other/Other'

    @Component({
        components: {
            adminSite: AdminSite,
            proxy: Proxy,
            host: Host,
            interface: Interface,
            svcOmw: SvcOmw,
            tomcatInfo: TomcatInfo,
            otherInfo: OtherInfo
        }
    })
    export default class Dashboard extends BaseComponent {
        bodyStyle = {
            padding: '0px'
        }
        siteSetting = {
            menuVisible: false,
            dashboard: {
                tomcatVisible: false,
                proxyVisible: false,
            }
        }

        onGetSetting(code, err, data) {
            if (code === 0) {
                this.siteSetting = data;
                this.onSizeChanged();
            }
        }
        getSetting() {
            this.post(this.uris.siteOmwSetting, null, this.onGetSetting);
        }

        mounted() {
            this.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .dashboard {
        padding-top: 5px;
    }

    .row {
        display: flex;
        align-items: start;
    }

    .col {

    }
    .col:first-child {
       flex: 1;
    }
    .col:not(:first-child) {
        margin-left: 8px;
    }

    .cell {

    }
    .cell:not(:first-child) {
        margin-top: 8px;
    }
</style>