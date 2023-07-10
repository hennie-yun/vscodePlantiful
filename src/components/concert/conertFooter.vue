<template>
    <div>
        <b-pagination v-model="currentPage" :total-rows="propsdata" align="center"
            :per-page="30" pills size="lg" class="my-3" @page-click="handleClick"
        ></b-pagination>
    </div>
    <div>
        <h3>출처: (재)예술경영지원센터 공연예술통합전산망(www.kopis.or.kr)</h3>
    </div>
</template>
<script>
export default {
    props : ['propsdata'],
    data() {
        return {
            currentPage : 1
        }
    },

    methods : {
        handleClick() {
            this.$emit('pageChanging', this.currentPage)
        }
    }
}
</script>
<style scoped>
    
</style>