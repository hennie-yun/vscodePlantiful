<script>
  export default{
    data() {
      return {
        show : false
      }
    },
  }
</script>

<template>
  <transition name="modal" appear>
    <div class="modal">
    <!-- <div class="overlay" @click="$emit('close')"></div> -->
    <div class="overlay" @click="$emit('closemodal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
  </transition>
</template>

<style scoped>
  .modal,
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
}
.overlay {
  opacity: 0.5;
  background-color: black;
}
.modal-card {
  position: relative;
  max-width: 80%;
  margin: auto;
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  min-height: 500px;
  z-index: 10;
  opacity: 1;
}
</style>