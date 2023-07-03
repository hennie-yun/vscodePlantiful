<template>
  <div>
    <nav class="navbar navbar-expand-custom navbar-mainbg">
      <a class="navbar-brand navbar-logo" href="/">plan + tiful</a>
      <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation">
        <i class="fas fa-bars text-white"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <div class="hori-selector">
            <div class="left"></div>
            <div class="right"></div>
          </div>

          <li class="nav-item active">
            <router-link to="/calendar" class="nav-link">캘린더</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/SubscribeBoardList" class="nav-link">구독</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/chatlist" class="nav-link">채팅</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="">공모전</a>
          </li>

          <div class="nav-item"
            style="display: flex; align-items: center; margin-right: 20px; margin-left: 150px; margin-top: 10px;">
            <div style="display: flex;">
              <img :src="require('@/assets/image/checklist.png')"
                style=" margin-right: 10px; width: 40px; height: 40px;" />

              <div class="nav-bar-profile" style="margin-left: 5px;">
                <img :src="'http://localhost:8181/members/plantiful/' + loginId" style="width: 40px; border-radius: 50%; height: 40px;" />
              </div>


              <div style="display: flex;" @click="$emit('logout')">
                <img :src="require('@/assets/image/logout.png')"
                  style=" margin-left: 10px; margin-right: 5px;width: 40px; height: 40px;" />
              </div>
            </div>
          </div>
        </ul>
      </div>
    </nav>
  </div>
</template>



<script>
let str = '';

export default {

  data() {
    return {
      loginId: null,
      textTemp: str,
      active: false,
      arr: [],
      activeLink: '',
      
    }
  },

  created() {
  this.loginId = sessionStorage.getItem('loginId');
  console.log(this.loginId);
  },

methods: {
  initializeNavbar() {
    var tabsNewAnim = $('#navbarSupportedContent');
    // var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      "top": itemPosNewAnimTop.top + "px",
      "left": itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });

    $("#navbarSupportedContent").on("click", "li", function (e) {
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        "top": itemPosNewAnimTop.top + "px",
        "left": itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
    });
  }
},
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

/* i {
  margin-right: 10px;
} */

.navbar-logo {
  padding: 15px;
  color: #fff;
  font-family: 'TheJamsil5Bold';
  font-weight: 300;
  font-size: 25px;
}

.navbar-mainbg {
  background-color: #7AC6FF;
  padding: 0px;
}

#navbarSupportedContent {
  overflow: hidden;
  position: relative;
}

#navbarSupportedContent ul {
  padding: 0px;
  margin: 0px;
}

#navbarSupportedContent ul li a i {
  margin-right: 10px;
}

#navbarSupportedContent li {
  list-style-type: none;
  float: left;
}

#navbarSupportedContent ul li a {
  font-family: 'Pretendard-Regular';
  font-weight: 400;
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 20px 20px;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
}

/* 클릭하면 보이는 것임 */
#navbarSupportedContent>ul>li.active>a {
  color: #2E2E33;
  background-color: transparent;
  transition: all 0.7s;
}

#navbarSupportedContent a:not(:only-child):after {
  content: "\f105";
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 14px;
  font-family: "Font Awesome 5 Free";
  display: inline-block;
  padding-right: 3px;
  vertical-align: middle;
  font-weight: 900;
  transition: 0.5s;
}

#navbarSupportedContent .active>a:not(:only-child):after {
  transform: rotate(90deg);
}

.hori-selector {
  display: inline-block;
  position: absolute;
  height: 100%;
  top: 0px;
  left: 0px;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-top: 10px;
}

.hori-selector .right,
.hori-selector .left {
  position: absolute;
  width: 25px;
  height: 25px;
  background-color: #fff;
  bottom: 10px;
}

.hori-selector .right {
  right: -25px;
}

.hori-selector .left {
  left: -25px;
}

.hori-selector .right:before,
.hori-selector .left:before {
  content: '';
  position: absolute;
  width: 50px;
  height: 40px;
  border-radius: 30%;
  background-color: #7AC6FF;
}

.hori-selector .right:before {
  bottom: 0;
  right: -25px;
}

.hori-selector .left:before {
  bottom: 0;
  left: -25px;
}

@media (min-width: 992px) {
  .navbar-expand-custom {
    -ms-flex-flow: row nowrap;
    flex-flow: row nowrap;
    -ms-flex-pack: start;
    justify-content: flex-start;
  }

  .navbar-expand-custom .navbar-nav {
    -ms-flex-direction: row;
    flex-direction: row;
  }

  .navbar-expand-custom .navbar-toggler {
    display: none;
  }

  .navbar-expand-custom .navbar-collapse {
    display: -ms-flexbox !important;
    display: flex !important;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
  }
}

@media (max-width: 991px) {
  #navbarSupportedContent ul li a {
    padding: 12px 30px;
  }

  .hori-selector {
    margin-top: 0px;
    margin-left: 10px;
    border-radius: 0;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  .hori-selector .left,
  .hori-selector .right {
    right: 10px;
  }

  .hori-selector .left {
    top: -25px;
    left: auto;
  }

  .hori-selector .right {
    bottom: -25px;
  }

  .hori-selector .left:before {
    left: -25px;
    top: -25px;
  }

  .hori-selector .right:before {
    bottom: -25px;
    left: -25px;
  }
}
</style>
