<template>
    <!-- 날짜 그냥 선택 -->
    <VueDatePicker v-model="date"></VueDatePicker>
    <!-- 날짜 범위 -->
    <VueDatePicker v-model="date" range />
</template>
  
<script>
import { ref, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


export default {
    components: { VueDatePicker },
    data() {
        return {
            date: null,
        };
    },
    setup() {
        const date = ref();

        // For demo purposes assign range from the current date
        onMounted(() => {
            const startDate = new Date();
            const endDate = new Date(new Date().setDate(startDate.getDate() + 3));
            date.value = [startDate, endDate];
        })
    }
}
</script>