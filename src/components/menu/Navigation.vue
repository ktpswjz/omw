<template>
    <div class="navigation">
        <div class="btn" @click="menuCollapse = !menuCollapse">
            <span v-if="menuCollapse" class="icon">
                <i class="el-icon-sanshuxian" />
            </span>
            <span v-else class="icon">
                <i class="el-icon-sanhengxian" />
            </span>
        </div>
        <el-menu class="menu" :style="heightStyle"
                 :collapse="menuCollapse" :router="true" :default-active="defaultActive">
            <el-menu-item index="/">
                <i class="el-icon-menu"></i>
                <span slot="title">控制面板</span>
            </el-menu-item>

            <el-menu-item index="/service/tomcat">
                <i class="el-icon-tomcat"></i>
                <span slot="title">Tomcat</span>
            </el-menu-item>
        </el-menu>
    </div>

</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'

    @Component({
        props: {
            minHeight: {
                type: Number,
                default: 100
            },
            defaultActive: {
                type: String,
                default: ""
            }
        }
    })
    export default class Navigation extends BaseComponent {
        menuCollapse = false

        get heightStyle() {
            let minHeight = (this.minHeight - 25) + "px";
            return {
                'min-height': minHeight
            };
        }
    }
</script>

<style scoped lang="scss">
    .navigation {
        .btn {
            display: flex;
            align-items: center;
            height: 25px;
            background-color: #f8f8f8;
            border-right: 1px solid #e6e6e6;
            cursor: pointer;

            .icon {
                flex: 1;
                display: block;
                text-align: center;
            }
        }
        .menu {

        }
        .menu:not(.el-menu--collapse) {
            width: 160px;
        }
    }
</style>