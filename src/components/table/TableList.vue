<template>
    <el-table v-loading="isSearching"
              aelement-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              :data="items"
              :border="border"
              :size="size"
              :stripe="true">
        <slot name="columns"></slot>
        <template slot="empty">
            <span v-if="isError" class="error">
                <i class="el-icon-kulian"></i>
                <div class="error-summary">{{errSummary}}</div>
                <div class="error-detail">{{errDetail}}</div>
            </span>
            <span v-else>暂无数据</span>
        </template>
    </el-table>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '@/components/BaseComponent'

    @Component({
        props: {
            uri: {
                type: String,
                default: ""
            },
            filter: {
                type: Object,
                default: null
            },
            border: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: ""
            },
        }
    })
    export default class TableList extends BaseComponent {
        errSummary = ""
        errDetail = ""
        isError = false
        isSearching = false
        items = []

        onSearched(code, err, data) {
            this.isSearching = false;

            if (code === 0) {
                this.isError = false;
                this.items = data;

                this.$emit("searched", data)
            }
            else if (code !== 20001) {
                this.isError = true;
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.items = [];

                this.$emit("searched", null)
            }
        }
        doSearch() {
            if(this.isNullOrEmpty(this.uri)) {
                return;
            }

            this.isError = false;
            this.isSearching = true;
            this.post(this.uri, this.filter, this.onSearched);
        }

        mounted() {
            this.doSearch();
        }
    }
</script>

<style scoped lang="scss">
    .error {
        color: red;

        i {
            font-size: xx-large;
        }
    }
    .error-summary {
        font-weight: bold;
    }
    .error-detail {
        font-style: italic;
    }
</style>