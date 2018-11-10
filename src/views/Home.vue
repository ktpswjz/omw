<template>
  <div class="home">
      <div class="home-top" ref="top">
          <i class="el-icon-kongjianbujumianban logo"  @click="redirectTo('/')"/>
          <span class="title">
              <span>服务器管理平台</span>
              <span>1.0.1.0</span>
          </span>
          <loginUser />
      </div>
      <div class="home-body">
          <div class="home-body-left">
              <navigation :minHeight="navigationMinHeight" :defaultActive="defaultMenu"/>
          </div>
          <div class="home-body-right" ref="bodyRight" :style="bodyRightStyle">
              <router-view />
          </div>
      </div>
  </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import Navigation from '@/components/menu/Navigation'
    import LoginUser from '@/components/login/LoginUser'

    @Component({
        components: {
            navigation: Navigation,
            loginUser: LoginUser
        }
    })
    export default class Home extends BaseComponent {
        bodyMinHeight = 0
        navigationMinHeight = 0;
        defaultMenu = "/"

        get bodyRightStyle() {
            let minHeight = this.bodyMinHeight + "px";
            return {
                'min-height': minHeight
            };
        }

        updateBodyRightHeight() {
            let bodyRight = this.$refs["bodyRight"];
            if(bodyRight) {
                this.navigationMinHeight = bodyRight.offsetHeight;
            }
        }

        onSizeChanged() {
            let top = this.$refs["top"];
            if(!top) {
                return;
            }

            let clientHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;

            let topHeight = top.offsetHeight;
            let bodyMarginHeight = 0;
            let bodyPaddingHeight = 10;

            this.bodyMinHeight = clientHeight - topHeight - bodyMarginHeight - bodyPaddingHeight;
            this.$nextTick(this.updateBodyRightHeight);
        }

        mounted() {
            window.addEventListener("resize", this.onSizeChanged);
            this.onSizeChanged();
        }
        beforeDestroy() {
            window.removeEventListener("resize", this.onSizeChanged);
        }
    }
</script>

<style scoped lang="scss">
    .home {

    }

    .home-top {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0px 18px;
        background-color: #f8f8f8;
        border-bottom: 1px solid #e6e6e6;

        .logo {
            font-size: x-large;
            cursor: pointer;
            color: #606080;
        }
        .logo:hover {
            color: #409eff;
        }
        .title {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0px 5px;
            font-size: large;
            color: #3f3f3f;
        }
    }

    .home-body {
        display: flex;
        align-items: start;
    }
    .home-body-left {
        //width: 200px;
    }
    .home-body-right {
        flex: 1;
        padding: 5px 10px;
    }
</style>
