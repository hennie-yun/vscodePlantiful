<template>
  <keep-alive>
  <div>
      <nav class="navbar navbar-expand-custom navbar-mainbg">
        <a class="navbar-brand navbar-logo" href="/calendar" @click="toCalendar">plan + tiful</a>
  
        <button class="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation" @click="toggleNavigation">
          <i class="fas fa-bars text-white"></i>
        </button>
  
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto" id="navBar">
            <div class="hori-selector">
              <div class="left"></div>
              <div class="right"></div>
            </div>
  
            <li class="nav-item">
              <router-link to="/mypage" class="nav-link" @click="navigateTo('/mypage', $event)">마이페이지</router-link>
            </li>
  
            <li class="nav-item active">
              <router-link to="/calendar" class="nav-link" @click="navigateTo('/calendar', $event)">캘린더</router-link>
            </li>
  
            <li class="nav-item">
              <router-link to="/SubscribeBoardList" class="nav-link"
                @click="navigateTo('/SubscribeBoardList', $event)">구독</router-link>
            </li>
  
            <li class="nav-item">
              <router-link to="/chatlist" class="nav-link" @click="navigateTo('/chatlist', $event)">채팅</router-link>
            </li>
  
            <li class="nav-item">
              <router-link to="/concertlist" class="nav-link" @click="navigateTo('/concertlist', $event)">공모전</router-link>
            </li>
  
  
  
            <div class="nav-item"
              style="display: flex; align-items: center; margin-right: 20px; margin-left: 150px; margin-top: 10px;">
              <div style="display: flex;">
                <img :src="require('@/assets/image/checklist.png')" style=" margin-right: 10px; width: 40px; height: 40px;"
                  @click="openMenu($event)" :color="active ? 'primary' : undefined"
                  v-click-outside="{ handler: closeMenu, include }" />
  
  
  
                <div class="nav-bar-profile" style="margin-left: 5px;">
                  <img :src="'http://localhost:8181/members/plantiful/' + loginId" @error="replaceImg" @click="mypage"
                    style="width: 40px; border-radius: 50%; height: 40px;"  />
                </div>
  
                <div @click="logout">
                  <img :src="require('@/assets/image/logout.png')"
                    style="margin-left: 10px; margin-right: 5px; width: 40px; height: 40px;" />
                </div>
              </div>
            </div>
          </ul>
        </div>
      </nav>
      <div id="checkList" v-show="active" class="included">
        <div style="width=100%; height=100%;">
          <TodoHeader></TodoHeader>
          <TodoInput v-bind:propsdata="todoItems" v-on:addTodoItem="addOneItem"></TodoInput>
          <TodoList v-bind:propsdata="todoItems" v-on:removeItem="removeOneItem" v-on:toggleItem="toggleOneItem"></TodoList>
          <TodoFooter v-on:clearAll="clearAllItem"></TodoFooter>
        </div>
      </div>
    </div>
  </keep-alive>
  </template>
  
  <script>
  import TodoHeader from '../todolist/TodoHeader.vue'
  import TodoInput from '../todolist/TodoInput.vue'
  import TodoList from '../todolist/TodoList.vue'
  import TodoFooter from '../todolist/TodoFooter.vue'
  import img from '@/assets/image/profile-user.png';

  export default {
    components: {
      'TodoHeader': TodoHeader,
      'TodoInput': TodoInput,
      'TodoList': TodoList,
      'TodoFooter': TodoFooter,
    },
    data() {
      return {
        loginId: null,
        active: false,
        arr: [],
        activeLink: '',
        active: false,
        todoItems: [],
      }
    },
    beforeRouteLeave(to, from, next) {
      this.activeLink = to.path;
      next();
    },
    created() {
      this.activeLink = this.$route.path;
      let token = sessionStorage.getItem('token');
      this.loginId = sessionStorage.getItem('loginId');
      this.img = 'http://localhost:8181/members/plantiful/' + this.loginId;
      if (localStorage.length > 0) {
        for (var i = 0; i < localStorage.length; i++) {
          if (localStorage.key(i) !== 'loglevel:webpack-dev-server') {
            if(localStorage.key(i) !== 'activeTab') {
              let getItem = localStorage.getItem(localStorage.key(i))
              let obj = JSON.parse(getItem)
              this.todoItems.push(obj)
            }
          }
        }
        this.todoItems = this.todoItems.sort((a, b) => a.index - b.index)
      }
    },
    mounted() {
      this.initializeNavbar();
    },
  
    methods: {
      mypage(){
        location.href ="/mypage"
        localStorage.setItem("activeTab", '/mypage')
      },
      navigateTo(route, event) {        
        $(".active").removeClass("active");
        $(event).addClass("active");
        localStorage.setItem("activeTab", route)
        this.activeLink = route;
        this.$router.push(route);
      },
      toggleNavigation() {
        const navbarCollapse = document.getElementById('navbarSupportedContent');
        navbarCollapse.classList.toggle('show');
      },
      replaceImg(e) {
        e.target.src = img;
      },
  
      logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('loginId');
        localStorage.setItem('activeTab', '/calendar')
        location.href = '/login';
  
      },
      openMenu(value) {
        if (typeof value === 'boolean') {
          this.active = value
        } else {
          this.active = !this.active
          let div = document.getElementById("checkList")
          div.style.top = "0px"
          div.style.top = 150 + "px"
        }
  
      },
  
      include() {
        return [document.querySelector('.included')]
      },
  
      closeMenu() {
        this.active = false
      },
  
      addOneItem: function (todoItem) {
        var obj = { completed: false, item: todoItem.msg, index: todoItem.index }
        localStorage.setItem(todoItem.index, JSON.stringify(obj))
        this.todoItems.push(obj)
      },
  
      removeOneItem: function (todoItem, index) {
        this.todoItems.splice(index, 1)
        localStorage.removeItem(todoItem.index)
      },
  
      toggleOneItem: function (todoItem, index) {
        this.todoItems[index].completed = !this.todoItems[index].completed
        localStorage.removeItem(todoItem.item)
        localStorage.setItem(todoItem.item, JSON.stringify(todoItem))
      },
  
      clearAllItem: function () {
        var route = localStorage.getItem("activeTab")
        localStorage.clear()
        this.todoItems = []
        localStorage.setItem("activeTab", route)
      },
  
      initializeNavbar() {
        var activeTab = localStorage.getItem("activeTab")
        let tags = document.getElementsByClassName("nav-item")
        for(var i=0; i<tags.length; i++) {
          var href = tags[i].firstChild.getAttribute("href")
          if(href == activeTab) {
            tags[i].classList.add("active")
          } else {
            tags[i].classList.remove("active")
          }

        }

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
      },

      toCalendar() {
        localStorage.setItem("activeTab", "/calendar")
      }
    },
  };
  </script>
  
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  
  
  
  .navbar-logo {
    padding: 15px;
    color: #fff;
    font-family: 'TheJamsil5Bold';
    font-weight: 300;
    font-size: 25px;
  }
  
  .navbar-logo:hover {
    color: #ffe77a;
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
    color: #7AC6FF;
    background-color: transparent;
    transition: all 0.7s;
  }
  
  #navbarSupportedContent a:not(:only-child):after {
    content: "";
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
  
  @import "https://pro.fontawesome.com/releases/v5.10.0/css/all.css";
  @import 'https://fonts.googleapis.com/css2?family=Itim&display=swap';
  
  #checkList {
    font-family: 'Pretendard-Regular';
    font-weight: 400;
    border: 4px solid #7AC6FF;
    border-radius: 45px;
    max-width: 100%;
    width: 327px;
    height: auto;
    left: 75.3%;
    margin-top: -5%;
    overflow: hidden;
    text-align: center;
    background-color: white;
    white-space: pre;
    position: absolute;
    opacity: 1;
    z-index: 999;
  }
  
  
  input {
    border-style: groove;
    width: 100px;
  }
  
  button {
    border-style: groove;
  }
  
  .shadow {
    box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.03);
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