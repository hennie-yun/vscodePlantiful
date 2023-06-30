<template>
  <div>
    
    <button v-on:click="token">네이버 연동하기</button>
  </div>
</template>

<script>



export default {
  name: 'naver',
 

  data(){
    return {
     
    }
  },
  mounted() {
    
    
    
  },
  methods: {
    token(){
      var link = document.location.href.split("?")[1]
      const code = link.split("=")[1].split("&")[0]
      const state = link.split("&")[1].split("&")[0].split("=")[1]
    
      console.log(code)
      console.log(state)
      let formData = new FormData()
      formData.append("code", code)
      formData.append("state", state)
     
      this.$axios.get('http://localhost:8181/api/naver/callback', formData)
      .then(function(res){
        alert(res.data)
      })

    }  
    }
  
  

};
</script>
<style scoped>
@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 00;
    font-style: normal;
}
</style>