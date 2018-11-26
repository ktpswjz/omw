<template>
    <div class="login-user">
        <el-popover v-model="infoVisible" trigger="hover" placement="bottom-end">
            <div class="user-info" >
                <div class="row">
                    <el-button type="text" icon="el-icon-log-out" @click="logout">退出登录</el-button>
                </div>
            </div>
            <el-button class="user-account" type="text" slot="reference" >{{loginAccount}}</el-button>
        </el-popover>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'

    @Component
    export default class LoginUser extends BaseComponent {
        infoVisible = false
        loginAccount = ""

        onLogout(code, err, data) {
            if (code === 0) {
                this.store.clear();
                this.redirectTo("/login");
            }
        }
        logout() {
            this.infoVisible = false
            this.post(this.uris.authLogout, null, this.onLogout);
        }

        onGetLoginAccount(code, err, data) {
            if (code === 0) {
                this.loginAccount = data.name;
                this.openNotifySocket();
            }
        }
        getLoginAccount() {
            this.post(this.uris.authAccount, null, this.onGetLoginAccount);
        }

        onNotifyMessage(evt) {
            if(!evt.data) {
                return;
            }

            try {
                let msg = JSON.parse(evt.data);
                this.evtbus.fire("socket", msg.id, msg.data);
            }
            catch (e) {
                console.log(e);
            }
        }
        onNotifyOpen() {
            if(this.notifySocket) {
             }
        }
        onNotifyClose() {
        }

        openNotifySocket() {
            this.notifySocket = this.network.newSocket(this.uris.notifySubscribe,
                this.onNotifyMessage,
                this.onNotifyOpen,
                this.onNotifyClose);
        }
        closeNotifySocket() {
            if(this.notifySocket) {
                try{
                    this.notifySocket.close();
                }
                catch (e) {
                    console.log(e);
                }
            }
        }


        mounted() {
            this.loginAccount = this.store.getApiAccount();
            this.getLoginAccount();
        }
        beforeDestroy() {
            this.closeNotifySocket();
        }
    }
</script>

<style scoped lang="scss">
    .login-user {

    }

    .user-account {
        padding: 0px 5px;
    }

    .user-info {
        padding: 5px;
    }

    .row {
        display: flex;
        align-items: center;
    }
</style>