<template>
    <el-collapse class="tomcat">
        <service v-for="(item, index) in items" :key="index" :info="item"/>
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
    export default class Tomcat extends BaseComponent {
        items = new Array()

        onGetList(code, err, data) {
            if (code === 0) {
                this.items = data;
            }
            else if (code !== 20001) {
                this.items = new Array();
            }
        }
        getList() {
            this.post(this.uris.svcTomcatList, null, this.onGetList);
        }

        mounted() {
            this.getList();
        }
    }
</script>

<style scoped lang="scss">
    .tomcat {

    }
</style>