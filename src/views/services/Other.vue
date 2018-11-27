<template>
    <div class="other">
        <otherInfo />
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'
    import OtherInfo from '@/components/svc/other/Other'

    @Component({
        components: {
            otherInfo: OtherInfo
        }
    })
    export default class Other extends BaseComponent {
        
    }
</script>

<style scoped lang="scss">
    .other {
        margin-top: 5px;
        border-left: 0.5px solid #ebeef5;
        border-right: 0.5px solid #ebeef5;
    }
</style>