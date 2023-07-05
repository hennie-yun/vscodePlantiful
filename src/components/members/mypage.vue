<template>
  <div id="mypage" style="display: flex; align-items: center;">
    <div class="container">
      <div class="middle">


        <div>
          <img :src="'http://localhost:8181/members/plantiful/' + email" @error="replaceImg"
            style="margin-top: -20px; margin-bottom:30px; width: 200px; border-radius: 50%; height: 200px;" />
        </div>

        <span class="info">{{ dto.nickname }}</span>

        <div>
          <p class="sub_info">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-envelope-fill"
              viewBox="0 0 16 16">
              <path
                d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
            </svg>
            {{ dto.email }}
          </p>
          <p class="sub_info">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
              class="bi bi-telephone-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
            </svg>
            {{ dto.phone }}
          </p>
          <p class="sub_info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-credit-card-fill" viewBox="0 0 16 16">
              <path
                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" />
            </svg>
            {{ paydto.paidamount }}
          </p>

        </div>
      </div>
    </div>


    <!-- <section class="container1">
      <button data-hover="내 정보 수정">
        <div> <img :src="require('@/assets/image/edit-info.png')" class="iconset" /></div>
      </button>
    </section>
    <section class="container1">
      <button data-hover="내 구독 목록">
        <div> <img :src="require('@/assets/image/press-button.png')" class="iconset" /></div>
      </button>
    </section>
    <section class="container1">
      <button data-hover="그룹만들기">
        <div> <img :src="require('@/assets/image/networking.png')" class="iconset" /></div>
      </button>
    </section>
    <section class="container1">
      <button data-hover="내 포인트">
        <div> <img :src="require('@/assets/image/cash-flow.png')" class="iconset" /></div>
      </button>
    </section> -->


    <div class="icon-container">
      <div class="icon-wrapper">
        <router-link to="/editinfo" class="link-style">
          <img :src="require('@/assets/image/edit-info.png')" class="iconset" />
          <p class="link-text">내 정보 수정</p>
        </router-link>

      </div>
      <div class="icon-wrapper">
        <router-link to="/SubscribeBoardMyList" class="link-style">
          <img :src="require('@/assets/image/press-button.png')" class="iconset" />
          <p class="link-text">내 구독 목록</p>
        </router-link>
      </div>
      <div class="icon-wrapper">
        <router-link to="/group" class="link-style">
          <img :src="require('@/assets/image/networking.png')" class="iconset" />
          <p class="link-text">그룹 만들기</p>
        </router-link>
      </div>
      <div class="icon-wrapper">
        <router-link to="/payment" class="link-style">
          <img :src="require('@/assets/image/cash-flow.png')" class="iconset" />
          <p class="link-text">포인트 관리</p>
        </router-link>
      </div>
    </div>

  </div>
</template>
  
<script>
import img from '@/assets/image/user (2).png';

export default {
  name: 'mypage',
  data() {
    return {
      email: this.$route.query.email,
      dto: {
        nickname: '',
        phone: '',
        email: ''
      },
      paydto: {
        paidamount: 0
      },


    }
  },

  created: function () {
    let token = sessionStorage.getItem('token')
    this.email = sessionStorage.getItem('loginId')
    console.log(this.email);
    const self = this;
    self.$axios.get('http://localhost:8181/members/getmember/' + self.email, { headers: { 'token': token } })
      .then(function (res) {
        if (res.status == 200) {
          self.dto = res.data.dto
          if (self.dto != null) {
            self.email = self.dto.email
            self.pwd = self.dto.pwd
            self.nickname = self.dto.nickname
            self.phone = self.dto.phone
            if (self.dto.img) {
              self.img = 'http://localhost:8181/members/plantiful/' + self.dto.email;
            }
          } else {
            alert('없는 아이디 혹은 만료된 세션 아이디입니다')
          }
        } else {
          alert('에러코드')
        }
      }),
      self.$axios.get('http://localhost:8181/payment/getcash/' + self.email)
  .then((res) => {
    if (res.status == 200) {
      if (res.data.paydto != null) {
        this.paydto = res.data.paydto;
        this.paidamount = this.paydto.paidamount;
      } else {
        
      }
    }
  });
},
  methods: {
    replaceImg(e) {
      e.target.src = img;
    }
  }
}
</script>

<style scoped> /* section.container1 {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: 10% auto;
   text-align: center;
 }

 button:hover {
   cursor: pointer;
 }

 button {
   background: transparent;
   outline: none;
   position: relative;
   padding: 15px 50px;
   overflow: hidden;
 }

 button:before {
   content: attr(data-hover);
   position: absolute;
   top: 1.1em;
   left: 0;
   width: 100%;
   text-transform: uppercase;
   letter-spacing: 3px;
   font-weight: 800;
   font-size: 0.8em;
   opacity: 0;
   transform: translate(-100%, 0);
   transition: all 0.3s ease-in-out;
 }

 button:hover:before {
   opacity: 1;
   transform: translate(0, 0);
 }

 button div {
   text-transform: uppercase;
   letter-spacing: 3px;
   font-weight: 800;
   font-size: 0.8em;
   transition: all 0.3s ease-in-out;
 } */

 .iconset {
   width: 30px;
   height: 30px;
   display: block;
   margin-left: auto;
   margin-right: auto;
 }

 .sub_info {
   font-family: 'Pretendard-Regular';
   font-weight: 400;
   margin-top: 15px;
   font-size: 17px;
 }

 .info {
   position: relative;
   padding-left: 20px;
   padding-right: 20px;
   /* border-bottom: 5px double #7ac5ff; */
   flex-direction: row;
   align-items: center;
   font-family: 'Pretendard-Regular';
   font-weight: 600;
   font-size: 30px;
   background: linear-gradient(to top, #c0e8f8 40%, transparent 40%);
 }

 .icon-container {
   margin-top: 5%;
 }

 .iconset {
   width: 30px;
   height: 30px;
   display: block;
   margin-left: auto;
   margin-right: auto;
 }

 .icon-wrapper {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: 50px 0;
   /* 수정된 부분 */
 }

 .container {
   width: 350px;
   height: 500px;
   border: 2px solid #7AC6FF;
   margin: 50px 20px;
   /* 수정된 부분 */
   border-radius: 12px;
   overflow: hidden;
   margin-left: 33%;
   margin-top: 7%;
 }

 div.middle {
   position: relative;
   text-align: center;
   top: 70px;
 }

 .link-style {
   text-decoration: none;
 }

 .link-style:hover,
 .link-style:focus {
   text-decoration: none;
 }

 .router-link-active .link-text {
   text-decoration: none;
 }

 .link-text {
   display: flex;
   align-items: center;
   justify-content: center;
   text-align: center;
   color: black;
   font-family: 'Pretendard-Regular';
   font-weight: 400;
   margin-top: 5px;

 }
</style>  