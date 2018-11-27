<template>
    <div class="tomcat">
        <tomcatInfo />
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import TomcatInfo from '@/components/svc/tomcat/Tomcat'

    @Component({
        components: {
            tomcatInfo: TomcatInfo
        }
    })
    export default class Tomcat extends BaseComponent {
        
    }
</script>

<style scoped lang="scss">
    .tomcat {
        margin-top: 5px;
        padding: 0px;
        border-left: 0.5px solid #ebeef5;
        border-right: 0.5px solid #ebeef5;
    }
</style>