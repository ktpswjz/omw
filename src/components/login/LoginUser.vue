<template>
    <div class="login-user">
        <el-popover v-model="infoVisible" trigger="hover" placement="bottom-end">
            <div class="user-info" >
                <div class="row">
                    <el-button type="text" icon="el-icon-tuichudenglu" @click="logout">退出登录</el-button>
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

        get loginAccount() {
            return this.store.getApiAccount();
        }

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