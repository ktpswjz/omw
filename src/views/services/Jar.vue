<template>
    <div class="jar">
        <jarCfg  @refresh="doRefresh"/>
        <jarService ref="service" class="svc"/>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import JarCfg from '@/components/svc/jar/Cfg'
    import JarService from '@/components/svc/jar/Jar'

    @Component({
        components: {
            jarCfg: JarCfg,
            jarService: JarService
        }
    })
    export default class Jar extends BaseComponent {
        doRefresh() {
            this.$refs.service.doSearch();
        }
    }
</script>

<style scoped lang="scss">
    .jar {
        display: flex;
        align-items: start;
    }
    .jar:not(:first-child) {
        margin-left: 10px;
    }
    .jar:last-child {
        flex: 1;
    }

    .svc {
        display: inline-block;
        border-left: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        border-radius: 3px;
    }

</style>