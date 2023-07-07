
<template lang="">
    <section  class="vh-100 gradient-custom background" >
        <!-- :style="{backgroundColor: '#CEE2F1'}" -->
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-itmes-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card bg-white text-black" style="border-radius:1rem; font-family: 'Pretendard-Regular';">
                    <div class="card-body p-5 text-center">
                        <div class="md-md-5 mt-md-4 pb-5">
                            <h2 class="fw-bold mb-2">Group</h2>
                            <br/>
                            <div class="form-outline form-white mb-4">
                                <input type="text" v-model="title" class="form-control form-contorl-lg" placeholder="그룹명을 입력하세요"/>
                                <input type="hidden" v-model="color"/>
                            </div>
                            <div class="form-outline form-white">
                                <span :style="{backgroundColor: '#f7a482'}" class="dot" v-on:click="a(1)"></span>
                                <span :style="{backgroundColor: '#add4a5'}" class="dot" v-on:click="a(2)"></span>
                                <span :style="{backgroundColor: '#d094e5'}" class="dot" v-on:click="a(3)"></span>
                                <span :style="{backgroundColor: '#e6c493'}" class="dot" v-on:click="a(4)"></span>
                                <span :style="{backgroundColor: '#ffc0cb'}" class="dot" v-on:click="a(5)"></span>
                                <span :style="{backgroundColor: '#98a6ff'}" class="dot" v-on:click="a(6)"></span>
                            </div>
                            <button class="btn btn-primary btn-lg" style="border:none; background-color:#7AC6FF" v-on:click="register">그룹생성</button>
                           
                         
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>
</template>

<script>
import axios from 'axios';
import $ from 'jquery'


 let span = document.getElementsByTagName('span');
export default {
    mounted() {
      
            
        
        
        
    },
    name: 'group',
    data(){
        return {
            title: '',
            color: '',
            selectedSpan: null
        }
    },
    methods: {
        register(){
            const self = this
            let formData = new FormData();
            formData.append('schedulegroup_title', this.title)
            formData.append('schedulegroup_color', this.color)
            let token = sessionStorage.getItem('token')
            self.$axios.post('http://localhost:8181/schedulegroup', formData, {headers:{'token':token}})
            .then(function(res){
                if(res.status == 200){
                        location.href = "/calendar"
                } else {
                    alert('그룹생성실패'+res.status)
                }
            })
        },
        a(col) {
            let spans = document.querySelectorAll('.dot')
            spans.forEach((el, index) => {
                el.onclick = () => {
                    
                    this.color = index+1
                    el.classList.add('active')
                   
                }
                el.classList.remove('active')
            })    
        },
        check(){
            location.href=""
            //     const self = this;
            //     let token = sessionStorage.getItem('token');
            //     alert(token)
            //     self.$axios.get('http://localhost:8181/api/naver/email', {headers:{'token':token}})
            //     .then(function(res){
                //         if(res != null){
        //             alert(res.data.email)
        //         }else{
            //             alert(res.status)
            //         }
            //     })
            // }
         
        },
   

},
}
</script>
<style scoped>
span {
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    height: 25px;
    width: 25px;
    margin-right: 5px;
}

.card bg-white text-black{
    font-family: 'Pretendard-Regular';
}


.dot.active
{
    box-shadow: 0 0 0 4px #222;
}

</style>