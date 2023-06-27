<template>
  <div>

    <button @click="authorize">Authorize with Naver</button>
  </div>
</template> 

<script>
import axios from 'axios';

export default {
  data(){
    return{

    }
  },
  created:function(){ 


  },
 
  methods: {
 
  authorize(){
    let clientId = "IiiFJKBOyzL3qvfXasPq"
    let clientSecret = "PtvyRoMmt_"
    const self = this
    self.$axios.get("http://localhost:8181/api/naver/go")
    .then(function(res){
      if(res.status == 200){
        console.log(res.data)
      } else {
        alert(res.status)
      }
    })
    location.href="http://localhost:8181/api/naver/login"
  }
  }
}   
    

</script>

<style lang="">
    
</style>