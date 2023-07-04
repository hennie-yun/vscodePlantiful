<template>
  <NavBar  v-if="loginId != null" />
  <RouterView />
</template> 


<script>
import NavBar from '@/components/outline/nav.vue'

export default {
  name: 'app',
  components: { NavBar },
  data() {
    return {
      loginId: null,
   
    }
  },
  created() {
    this.loginId = sessionStorage.getItem('loginId')
    console.log(this.loginId);
  },
  methods: {
  
  }
}


</script>