<template>
    <div class="clearAllContainer">
        <p class="clearAllBtn" v-on:click="clearTodo">Clear All
        </p>
    </div>
</template>
<script>
export default {
    methods : {
        clearTodo : function() {
            console.log("FOOTER HERE")
            this.$emit('clearAll')
        }
    }
}
</script>
<style>
    

    .clearAllContainer {
        width : 8.5rem;
        height: 50px;
        line-height: 50px;
        background-color: #DB4467;
        border: 1px solid #2c3e50;
        border-radius: 5px;
        margin: 0 auto;
    }

    .clearAllBtn {
        color: #2c3e50;
        display: block;
        margin: 0 auto;
    }

    
</style>