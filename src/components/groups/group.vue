
<template lang="">
    <section :style="{backgroundColor: '#CEE2F1'}" class="vh-100 gradient-custom background" >
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-itmes-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card bg-white text-black" style="border-radius:1rem">
                    <div class="card-body p-5 text-center">
                        <div class="md-md-5 mt-md-4 pb-5">
                            <h2 class="fw-bold mb-2">Group</h2>
                            <br/>
                            <div class="form-outline form-white mb-4">
                                <input type="text" v-model="title" class="form-control form-contorl-lg" placeholder="그룹명을 입력하세요"/>
                                <input type="hidden" v-model="color"/>
                            </div>
                            <div class="form-outline form-white">
                                <span :style="{backgroundColor: '#3F48CC'}" class="dot" v-on:click="a(1)"></span>
                                <span :style="{backgroundColor: '#FFFD55'}" class="dot" v-on:click="a(2)"></span>
                                <span :style="{backgroundColor: '#8D2196'}" class="dot" v-on:click="a(3)"></span>
                                <span :style="{backgroundColor: '#ED87BD'}" class="dot" v-on:click="a(4)"></span>
                                <span :style="{backgroundColor: '#A1FB8E'}" class="dot" v-on:click="a(5)"></span>
                                <span :style="{backgroundColor: '#7E84F7'}" class="dot" v-on:click="a(6)"></span>
                            </div>
                            <button class="btn btn-primary btn-lg" style="border:none; background-color:#7AC6FF" v-on:click="register">그룹생성</button>
                            <button v-on:click="check">체크</button>
                            <div id="naver_id_login"></div>
                         
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
        const script = document.createElement('script')
        script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js'
        script.async = true
        script.charset = 'utf-8'
        document.head.appendChild(script)

        script.onload = () => {

            const naver_id_login=new window.naver_id_login("IiiFJKBOyzL3qvfXasPq", "http://localhost:8081/naver")
            const state = naver_id_login.getUniqState()
            naver_id_login.setButton("white",2,40)
            naver_id_login.setDomain("http://localhost:8181/api/naver")
            naver_id_login.setState(state)
            naver_id_login.setPopup()
            naver_id_login.init_naver_id_login()

            
        }
        
        
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
            alert(token)
            self.$axios.post('http://localhost:8181/schedulegroup', formData, {headers:{'token':token}})
            .then(function(res){
                if(res.status == 200){
                    alert(res.data.dto)
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
                    alert(this.color)
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
<style>
span {
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    height: 25px;
    width: 25px;
    margin-right: 5px;
}


.dot.active
{
    box-shadow: 0 0 0 4px #222;
}

</style>