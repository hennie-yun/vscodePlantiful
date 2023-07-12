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
            alert('만료된 세션 아이디입니다')
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

<style scoped> 
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
   margin-top: 4%;
 }

 .iconset {
   width: 50px;
   height: 50px;
   display: block;
   margin-left: auto;
   margin-right: auto;
 }

 div.middle {
   position: relative;
   text-align: center;
   top: 70px;
 }

.icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 70px 0;
  }

  .icon-wrapper .link-style {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
  }

  .icon-wrapper .link-style .link-text {
    margin-top: 10px;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    white-space: nowrap;
  }

  .icon-wrapper .link-style .iconset {
    transition: transform 0.3s;
    text-decoration: none;
  }

  .icon-wrapper .link-style:hover .iconset {
    transform: scale(0);
    text-decoration: none;
  }

  .icon-wrapper .link-style:hover .link-text {
    visibility: visible;
    opacity: 1;
    color :#7AC6FF;
    font-weight: bold;
    font-family: 'Pretendard-Regular';
    font-size : 18px;
  }
</style>  