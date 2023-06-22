<template>
    <div>
        <button @click="pay"> 결제하기 </button>
    </div>
</template>
<script>
export default {
    name : 'payment',
    methods: {
        pay(){
           const self = this;
           self.$axios.post("http://localhost:8181/kakaoPay")
           .then (function (res){
            if(res.status ==200){
                alert ('성공');
            }
           }); 
        }
    }
}
</script>
