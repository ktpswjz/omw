<template>
    <el-collapse class="jar" v-show="items.length > 0">
        <service v-for="(item, index) in items" :key="index" :svcInfo="item" @deleted="getList"/>
    </el-collapse>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import Service from './Service'

    @Component({
        components: {
            service: Service
        }
    })
    export default class Jar extends BaseComponent {
        items = new Array()

        doSearch() {
            this.getList();
        }

        onGetList(code, err, data) {
            if (code === 0) {
                this.items = data;
            }
            else if (code !== 20001) {
                this.items = new Array();
            }
        }
        getList() {
            this.post(this.uris.svcJarList, null, this.onGetList);
        }

        mounted() {
            this.getList();
        }
    }
</script>

<style scoped lang="scss">
    .jar {

    }
</style>