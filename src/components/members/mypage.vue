<template>
    <div id="mypage" style="display: flex; align-items: center; flex-direction: column;">
      <div class="container">
        <div class="middle">
          <div>
            <img
              :src="'http://localhost:8181/members/plantiful/' + dto.email"
              @error="replaceImg"
              @click="imgedit"
              style="margin-top: -20px; margin-bottom:30px; width: 200px; border-radius: 50%; height: 200px;"
            />
          </div>
  
          <span class="info">{{ dto.nickname }}</span>
  
          <div>
            <p class="sub_info">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                class="bi bi-envelope-fill" viewBox="0 0 16 16">
                <!-- SVG path code -->
              </svg>
              {{ dto.email }}
            </p>
            <p class="sub_info">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                class="bi bi-telephone-fill" viewBox="0 0 16 16">
                <!-- SVG path code -->
              </svg>
              {{ dto.phone }}
            </p>
            <p class="sub_info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-credit-card-fill" viewBox="0 0 16 16">
                <!-- SVG path code -->
              </svg>
              {{ paydto.paidamount }}
            </p>
          </div>
        </div>
      </div>
  
      <section class="container1">
        <button data-hover="내 정보 수정">
          <div><img :src="require('@/assets/image/edit-info.png')" class="iconset" /></div>
        </button>
      </section>
      <section class="container1">
        <button data-hover="내 구독 목록">
          <div><img :src="require('@/assets/image/press-button.png')" class="iconset" /></div>
        </button>
      </section>
      <section class="container1">
        <button data-hover="그룹 만들기">
          <div><img :src="require('@/assets/image/networking.png')" class="iconset" /></div>
        </button>
      </section>
      <section class="container1">
        <button data-hover="내 포인트">
          <div><img :src="require('@/assets/image/cash-flow.png')" class="iconset" /></div>
        </button>
      </section>
    </div>
  </template>
    
<script>
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
                        this.paydto = res.data.paydto;
                        if (this.paydto != null) {
                            this.paidamount = this.paydto.paidamount;
                        }
                    }
                });
    },
}
</script>

<style scoped> 
section.container1 {
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
  }

  .iconset {
    width: 30px;
    height: 30px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
.sub_info{
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
     font-family:'Pretendard-Regular';
     font-weight: 600; 
     font-size:30px;
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

 }</style>  