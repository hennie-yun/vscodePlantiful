<template>
    <div class="button-wrapper">
        <button class="clearAllBtn" v-on:click="clearTodo">Clear All
        </button>
    </div>
</template>
<script>
export default {
    methods: {
        clearTodo: function () {
            console.log("FOOTER HERE")
            this.$emit('clearAll')
        }
    }
}
</script>
<style scoped>
.button-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 5%;
    padding-top: 5%;
}

.button-wrapper button {
    border: none;
    background-color: transparent;
    padding: 5px 10px;
    color: #000;
    font-weight: bold;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    width: 100px;
}

.button-wrapper button::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: transparent;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
}


.button-wrapper button:hover::before {
    visibility: visible;
    background-color: #7AC6FF;
    transform: scaleX(1);
}


.button-wrapper button:hover {
    color: #7AC6FF;
}
</style>