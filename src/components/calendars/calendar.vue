<template>
  <div>
    <div class="" style="display: flex; height: 100vh;">
      <div class="sidebar" style="width: 20%; padding: 2%; border: none; background-color: ivory;">
        <div class="group_info" style="height: 50%;">
          <router-link to="/group">그룹 만들기</router-link>
          <h3>그룹 정보</h3>
          <div style="padding-top: 5%;" v-if="selectedGroup">
            <div>
              <h5>그룹 이름: {{ selectedGroup.schedulegroup_num.schedulegroup_title }}</h5>
            </div>
            <div style="padding-top: 5%;">
              <h6>참가자 ▽</h6>
              <div>
                <ul>
                  <li v-for="email in selectedGroupEmails" :key="email">
                    {{ email }}
                  </li>
                </ul>
              </div>
            </div>
            <div style="padding-top: 40%; display: flex; justify-content: space-evenly;">
              <button class="invite_btn" @click="toggleInviteForm">초대하기</button>
              <button class="delparty_btn" style="border: solid 1px darkgray; margin-right: 15%"
                v-if="selectedGroupEmails.length === 1" @click="delParty">그룹삭제</button>
              <button class="delparty_btn" style="border: solid 1px darkgray; margin-right: 15%" v-else
                @click="outParty">나가기</button>
            </div>
          </div>
        </div>

        <div class="group_list" style="height:50%">
          <div>
            <h3>그룹 리스트</h3>
          </div>
          <div>
            <ul>
              <li v-for="group in groups" :key="group.schedulegroup_num" style="display: flex; justify-content: center;">
                <input type="checkbox" :id="group.schedulegroup_num" :value="group.schedulegroup_num" checked
                  style="margin-right: 20px;" @change="toggleGroupSchedule(group)" />
                <label :for="group.schedulegroup_num">
                  {{ group.schedulegroup_title }}
                  <button class="grouplist_btn" :value="group.schedulegroup_num"
                    @click="getGroupParty(group.schedulegroup_num)"
                    :style="{ color: groupColors[group.schedulegroup_color] }">▶</button>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="calendar-con" style="width: 75%; padding: 2%; padding-left: 5%;">
        <FullCalendar ref="fullCalendar" :options="calendarOptions" />
      </div>
    </div>
    <!-- 초대 폼 -->
    <transition name="slide">
      <div v-if="showInviteForm" class="invite-form">
        <button class="calendar_btn" style="float: right;" @click="xbtn">X</button>
        <h3>그룹 초대하기</h3>
        <p>{{ selectedGroup.schedulegroup_num.schedulegroup_title }}</p>
        <div>
          <label for="emailInput">이메일:</label>
          <input type="text" style="width:65%;" id="email" v-model="newEvent.email" />
        </div>
        <button @click="inviteToGroup(selectedGroup.schedulegroup_num)" style="padding-top: 6%;">
          초대 보내기
        </button>
      </div>
    </transition>




    <!--  일정 추가/수정/삭제 코드 -->
    <div v-if="showEventForm" class="head-event-form">

      <div class="event-form">
        <div class="form-row form-buttons">

          <button class="calendar_btn" @click="xbtn">X</button>
        </div>

        <div class="form-row">
          <label for="title">제목</label>
          <div class="input-wrapper">
            <input type="text" id="title" v-model="newEvent.title" :class="{ 'error': !newEvent.title }" />
            <!-- <div v-if="!newEvent.title" class="error-message">제목을 입력하시오.</div> -->
          </div>
        </div>

        <div class="form-row">
          <label for="start">시작 날짜</label>
          <input type="date" id="start" v-model="newEvent.start" />

        </div>
        <div class="form-row">

          <label for="end">종료 날짜</label>
          <input type="date" id="end" v-model="newEvent.end" />

        </div>

        <div class="form-row">

          <label for="startTime">시작 시간</label>

          <input type="time" id="startTime" v-model="newEvent.startTime" />

        </div>
        <div class="form-row">

          <label for="endTime">종료 시간</label>

          <input type="time" id="endTime" v-model="newEvent.endTime" />

        </div>

        <div class="form-row">

          <label for="info">일정 내용</label>

          <textarea id="info" v-model="newEvent.info"></textarea>

        </div>

        <div class="form-row"> <label for="group_num">개인/그룹</label> <select id="group_num" v-model="newEvent.group_num">
            <option value="0" default>개인 일정</option>
            <option v-for="group in groups" :value="group.schedulegroup_num" :key="groupschedulegroup_num">
              {{ group.schedulegroup_title }} </option>
          </select>
         </div>

        <!-- <div class="form-row">
                  <label for="notification">알림 설정</label>
                  <select id="notification" v-model="newEvent.alert">
                                                                                                                                                                 <option value="0">알림 없음</option>

                                                                                                                                                                 <option value="30">30분 전</option>

                                                                                                                                                                 <option value="60">1시간 전</option>

                                                                                                                                                                 <option value="custom">사용자 설정</option>
                                                                                                                                                              </select>
                  <input type="time" id="customTime" v-model="newEvent.alert" v-if="newEvent.alert === 'custom'" />
              </div> -->



        <div class="form-row" v-if="newEvent.start == newEvent.end">
          <label for="isLoop">일정 반복 여부</label>
          <input type="radio" id="isLoop" v-model="newEvent.isLoop" value="1" />반복 안 함
          <input type="radio" id="isLoop2" v-model="newEvent.isLoop" value="2" />반복 설정
        </div>

        <div class="form-row" v-if="newEvent.isLoop === '2'">
          <label for="day">반복 요일</label>
          <select id="day" v-model="newEvent.day">
            <option value="1">월요일</option>
            <option value="2">화요일</option>
            <option value="3">수요일</option>
            <option value="4">목요일</option>
            <option value="5">금요일</option>
            <option value="6">토요일</option>
            <option value="0">일요일</option>
          </select>
        </div>

        <div class="form-row form-buttons">

          <button v-if="isNewEvent" class="calendar_btn" @click="addEvent">일정 추가</button>

          <button v-else class="calendar_btn" @click="updateEvent">수정</button>

          <button v-if="!isNewEvent" class="calendar_btn" @click="deleteEvent">삭제</button>

        </div>

      </div>
    </div>
  </div>


  <!-- 일정 공유 -->
  <div v-if="shareEvent" class="share-event-form">
    <div class="form-content">
      <div class="shareform-row">
        <h5 style="text-align: center;">일정 공유</h5>
      </div>
      <div class="shareform" style="display: flex; justify-content: center; align-items: center;">
        <div style="display: flex; align-items: center;">

          <button class="share-btn" @click="copyUrl"><img :src="require('@/assets/image/url.png')"
              style="margin-right: 10px; width:50px" />url복사</button>
        </div>
        <div style="display: flex; align-items: center;">

          <button class="share-btn" @click="shareKakao"><img :src="require('@/assets/image/kakaotalk.png')"
              @click="shareKakao" style="margin-right: 10px; width: 50px;" />카카오톡 공유</button>
        </div>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <button class="share-btn" @click="cancel">아니오</button>
      </div>
    </div>
  </div>

  <!-- sns 공유 -->
  <div v-if="snsEvent" class="share-event-form">
    <div class="form-content">
      <div class="shareform-row">
        <h5 style="text-align: center;">sns 연동</h5>
      </div>
      <div class="shareform" style="display: flex; justify-content: center; align-items: center;">
        <div style="display: flex; align-items: center;">

          <button class="share-btn" @click="naver"><img :src="require('@/assets/image/naver.png')"
              style="margin-right: 10px; width:50px" />naver</button>
        </div>
      </div>
      <div style="display: flex; align-items: center;">
        <button class="share-btn" @click="kakao"><img :src="require('@/assets/image/kakaotalk.png')" @click="kakao"
            style="margin-right: 10px; width: 50px;" />카카오톡</button>
      </div>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 10px;">
      <button class="share-btn" @click="cancel2">아니오</button>
    </div>
</div>


<router-view />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import axios from 'axios';


export default {

  mounted() {

  },

  components: {
    FullCalendar
  },
  name: 'calendar',
  data() {
    return {
     code: '',
      access_token: '',
      isNewEvent: true,
      showEventForm: false,
      shareEvent: false,
      snsEvent: false,
      group_num: 0,
      groupTitle: '',
      list: [],
      items: [],
      groups: [],
      checkedGroups: [],
      selectedGroup: null,
      selectedGroupEmails: [],
      members: [],
      showInviteForm: false,
      inviteEmail: '',
      invitelist: [],
      inviteall: [],
      newEvent: {
        id: 0,
        title: '',
        start: '',
        end: '',
        startTime: '00:00:00',
        endTime: '00:00:00',
        info: '',
        alert: '00:00',
        isLoop: 1,
        day: null,
      },

      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: '',
          center: 'title',
          right: 'today prev,next',
        },
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        // locale: 'ko',
        events: [], // 이벤트 데이터를 추가할 배열
        eventSources: [{
          events: this.getFilteredEvents,
          color: '',
          textColor: 'white',
          startEditable: true,
          durationEditable: true,
        }],
        eventResize: this.handleEventResize
      }
    }
  },

  // 페이지 시작- 실행되는 함수
  //로그인 한 사람의 일정 보여주기
   created() {
    // 전부 체크된 상태로 시작하도록 checkedGroups 배열 초기화
    this.checkedGroups = this.groups.map(group => group.schedulegroup_num);
    const self = this;
    let token = sessionStorage.getItem('token');
    this.email = sessionStorage.getItem('loginId');

    self.groupColors = {
      1: '#3F48CC',
      2: '#FFFD55',
      3: '#8D2196',
      4: '#ED87BD',
      5: '#A1FB8E',
      6: '#7E84F7',
    };

    self.$axios
      .get("http://localhost:8181/groupparty/email/" + self.email, {
        headers: { token: token },
      })
      .then(function (res) {
        if (res.status == 200) {
          const grouplist = res.data.list;
          self.items = grouplist;
          console.log(self.items)
          // self.groups = grouplist.map((item) => ({
          //   group_num: item.schedulegroup_num,
          //   group_color: item.schedulegroup_color,
          //   group_title: item.schedulegroup_title
          // }));
          self.groups = grouplist.map((item) => item.schedulegroup_num);
          console.log(self.groups);
          self.colors = self.groups.map((group) => self.groupColors[group.group_color] || 'blue');

          self.$axios
            .get("http://localhost:8181/schedules/email/" + self.email, {
              headers: { token: token },
            })
            .then(function (res) {
              if (res.status === 200) {
                const reslist = res.data.list;
                reslist.forEach(function (item) {
                  const groupColor = item.group_num && self.groupColors[item.group_num.schedulegroup_color] || 'blue';
                  const textColor = (item.group_num && item.group_num.schedulegroup_color === 2) ? 'black' : '';
                  const existingEvent = self.calendarOptions.events.find(event => event.schedule_num === item.schedule_num);
                  if (!existingEvent) {
                    if (item.isLoop === 2) {
                      self.calendarOptions.events.push({
                        schedule_num: item.schedule_num,
                        group_num: item.group_num,
                        title: generateTitle(item),
                        start: item.start,
                        end: dayjs(item.end).add(1, 'day').format('YYYY-MM-DD'),
                        color: (item.group_num && item.group_num.group_num === item.schedulegroup_num) ? groupColor : '#7AC6FF',
                        display: 'block',
                        daysOfWeek: item.day,
                        textColor: textColor
                      });
                    } else {
                      self.calendarOptions.events.push({
                        schedule_num: item.schedule_num,
                        group_num: item.group_num,
                        title: generateTitle(item),
                        start: item.start,
                        end: dayjs(item.end).add(1, 'day').format('YYYY-MM-DD'),
                        color: (item.group_num && item.group_num.group_num === item.schedulegroup_num) ? groupColor : '#7AC6FF',
                        display: 'block',
                        textColor: textColor
                      });
                    }
                  }
                });

                function generateTitle(item) {
                  let title = item.title;
                  if (item.startTime || item.endTime) {
                    title += ' ' + (item.startTime ? item.startTime : '') + ' ~' + (item.endTime ? ' ' + item.endTime : '');
                  }
                  return title !== null ? title : '';
                }

              } else {
                alert("에러코드: " + res.status);
              }
            });
        } else {
          alert("에러코드: " + res.status);
        }


        // groupparty에 schedulegruop_num 값으로 shcedule조회
        self.items.forEach(item => {
          const group_num = item.schedulegroup_num.schedulegroup_num;
          console.log(group_num);

          self.$axios.get("http://localhost:8181/schedules/group_num/" + group_num)
            .then(response => {
              const groupnums = response.data.list
              console.log(groupnums);
              groupnums.forEach(function (item) {
                const groupColor = item.group_num && self.groupColors[item.group_num.schedulegroup_color] || 'blue';
                const textColor = (item.group_num && item.group_num.schedulegroup_color === 2) ? 'black' : '';

                // 이미 추가된 일정인지 확인
                const existingEvent = self.calendarOptions.events.find(event => event.schedule_num === item.schedule_num);
                if (!existingEvent) {
                  if (item.isLoop === 2) {
                    self.calendarOptions.events.push({
                      schedule_num: item.schedule_num,
                      group_num: item.group_num,
                      title: generateTitle(item),
                      start: item.start,
                      end: dayjs(item.end).add(1, 'day').format('YYYY-MM-DD'),
                      color: (item.group_num && item.group_num.group_num === item.schedulegroup_num) ? groupColor : '#7AC6FF',
                      display: 'block',
                      daysOfWeek: item.day,
                      textColor: textColor
                    });
                  } else {
                    self.calendarOptions.events.push({
                      schedule_num: item.schedule_num,
                      group_num: item.group_num,
                      title: generateTitle(item),
                      start: item.start,
                      end: dayjs(item.end).add(1, 'day').format('YYYY-MM-DD'),
                      color: (item.group_num && item.group_num.group_num === item.schedulegroup_num) ? groupColor : '#7AC6FF',
                      display: 'block',
                      textColor: textColor
                    });
                  }
                }
              });

              function generateTitle(item) {
                let title = item.title;
                if (item.startTime || item.endTime) {
                  title += ' ' + (item.startTime ? item.startTime : '') + ' ~' + (item.endTime ? ' ' + item.endTime : '');
                }
                return title;
              }
            })
            .catch(error => {
              console.error(error);
            });
        });



      });

    self.$axios.get("http://localhost:8181/invite")
      .then(response => {
        this.inviteall = response.data.list;
        console.log(this.inviteall)
      })

    //초대받은 사람의 자동 초대 가입 
    self.$axios.get("http://localhost:8181/invite/email/" + self.email, { headers: { token: token } })
      .then(response => {
        const invitelist = response.data.list;

        console.log(invitelist);
        invitelist.forEach(item => {
          const invitenum = item.invitenum;
          console.log(invitenum);
        });
        if (invitelist.length > 0) {
          const formData = new FormData();
          invitelist.forEach(item => {
            console.log(self.items)
            const groupnum = item.groupnum.schedulegroup_num;
            console.log(groupnum)
            // 중복 여부 확인을 위한 변수
            let isDuplicate = false;

            // self.items 배열의 schedulegroup_num.schedulegroup_num 값과 비교하여 중복 여부 확인
            self.items.forEach(item => {
              if (item.schedulegroup_num.schedulegroup_num === groupnum) {
                isDuplicate = true;
                console.log(isDuplicate)
                return; // 중복이면 더 이상 진행하지 않고 종료
              }
            });

            if (!isDuplicate) {
              formData.append('schedulegroup_num', groupnum);
              formData.append('member_email', self.email);
            }
          });

          if (formData.has('schedulegroup_num')) {
            self.$axios.post("http://localhost:8181/groupparty", formData)
              .then(response => {
                const invitemember = response.data.dto;
                console.log(invitemember.schedulegroup_num);
              })
              .catch(error => {
                console.error(error);
              });

          }
        }
        invitelist.forEach(item => {
          const invitenum = item.invitenum;
          console.log(invitenum);
          self.$axios.delete("http://localhost:8181/invite/invite_num/" + invitenum)
            .then(function (res) {
              if (res.status == 200) {
                location.reload();
              } else {
                alert("에러코드:" + res.status);
              }
            })

        })

      });

  },

  methods: {
     toggleInviteForm() {
      this.showInviteForm = !this.showInviteForm;
    },


    //그룹 초대
    inviteToGroup(schedulegroup_num) {
      const groupnum = schedulegroup_num.schedulegroup_num;
      const email = this.newEvent.email;

      const formData = new FormData();
      formData.append('groupnum', groupnum);
      formData.append('email', email);

      // 중복 여부를 확인하기 위한 GET 요청
      axios.get("http://localhost:8181/invite")
        .then(response => {
          this.inviteall = response.data.list;
          console.log(this.inviteall);

          // 중복 여부 확인
          const isEmailDuplicate = this.inviteall.some(item => item.email.email === email);
          const isGroupnumDuplicate = this.inviteall.some(item => item.groupnum.schedulegroup_num === groupnum);

          if (isEmailDuplicate && isGroupnumDuplicate) {
            alert("이미 초대된 email 입니다."); // 중복인 경우 알림 표시
            this.showInviteForm = false;
            return;
          }

          // 중복이 아닌 경우 POST 요청으로 전송
          this.$axios.post("http://localhost:8181/invite", formData)
            .then(response => {
              const invitemember = response.data.dto;
              this.showInviteForm = false;
              alert("초대 메세지 전송 완료")
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    },




    // 그룹정보에 표시 될 정보 저장
    getGroupParty(schedulegroup_num) {
      const self = this;
      self.$axios.get("http://localhost:8181/groupparty/schedulegroup_num/" + schedulegroup_num)
        .then(response => {
          const groupData = response.data.list;
          this.selectedGroup = groupData[0]; // 첫 번째 그룹 정보 
          this.selectedGroupEmails = groupData.map(item => item.member_email.email);

          console.log(this.selectedGroup)
          console.log(this.selectedGroupEmails)
          console.log(this.selectedGroup.groupparty_num)

        })
        .catch(error => {
          console.error(error);
        });
    },
    //체크상태확인
    toggleGroupSchedule(group) {
      const groupId = group.schedulegroup_num;

      if (this.checkedGroups.includes(groupId)) {
        this.checkedGroups = this.checkedGroups.filter(checkedGroup => checkedGroup !== groupId);
      } else {
        this.checkedGroups.push(groupId);
      }

      // 체크된 그룹의 일정 보이거나 숨기기
      this.calendarOptions.events.forEach(event => {
        if (event.group_num && event.group_num.schedulegroup_num === groupId) {
          event.display = this.checkedGroups.includes(groupId) ? 'none' : 'block';
        }
      });
    },

    //그룹에 한명일때 삭제
    delParty() {
      const self = this;
      const grouppartynum = this.selectedGroup.groupparty_num;
      self.$axios.delete("http://localhost:8181/groupparty/groupparty_num/" + grouppartynum)
        .then(function (res) {
          if (res.status == 200) {
            location.reload();
          } else {
            alert("에러코드:" + res.status);
          }
        })
    },
    //그룹 나가기
    outParty() {
      const self = this;
      const selectedGroupSchedulegroupNum = this.selectedGroup.schedulegroup_num.schedulegroup_num;
      let grouppartyNum = null;

      for (let i = 0; i < self.items.length; i++) {
        const item = self.items[i];
        const itemSchedulegroupNum = item.schedulegroup_num.schedulegroup_num;

        if (itemSchedulegroupNum === selectedGroupSchedulegroupNum) {
          grouppartyNum = item.groupparty_num;
          break;
        }
      }

      console.log(grouppartyNum);

      self.$axios.delete("http://localhost:8181/groupparty/outparty/" + grouppartyNum)
        .then(function (res) {
          if (res.status == 200) {
            location.reload();
          } else {
            alert("에러코드:" + res.status);
          }
        })
    },

    
// 카카오 스케줄 일정 연동
kakao(){
 
 /*
  this.$axios.get("http://localhost:8181/api/kakao/add", schedule_num)
  .then(function(res){
    console.log(res.data)
  })
  */


  let token = sessionStorage.getItem('token');
this.$axios.get("http://localhost:8181/api/kakao/token", {headers:{"token":token}})
.then(function(res){

  console.log(res.data.kakaotoken)
  

  
})



  /*
  let formData = new FormData();
formData.append('email', sessionStorage.getItem('loginId'));
formData.append('group_num', self.newEvent.group_num);
formData.append('title', self.newEvent.title);
formData.append('start', self.newEvent.start);
formData.append('end', dayjs(self.end).format('YYYY-MM-DD'));
formData.append('startTime', self.startTime);
formData.append('endTime', self.endTime);
formData.append('info', self.info);
formData.append('alert', self.alert);
formData.append('isLoop', self.isLoop);
formData.append('day', self.day);
*/


  //location.href = "/login"
 // res.data null이면 카카오 로그인하러 가기로 이동 

},

// 네이버 스케줄 일정 연동
naver(){




  this.$axios.get("http://localhost:8181/api/naver/oauth")
  .then(function(res){
    console.log("oauth성공!!")
   // location.href=encodeURIComponent(res.data)
  })
  
 // window.location.href = "http://localhost:8181/api/naver/oauth"
   const clientId = "IiiFJKBOyzL3qvfXasPq"
   const redirectURI = encodeURIComponent("http://localhost:8181/api/naver/callback");
  
   const state = this.generateRandomState()
   const naverAuthURL = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id='+clientId+'&redirect_uri='+redirectURI+'&state='+state;

  window.location.href = naverAuthURL


  this.$axios.get("http://localhost:8181/api/naver/tokenprovider/", {headers:{"token": token}})
  .then(function(res){
    console.log(res.data)
  })
 
  // this.$axios.get(naverAuthURL)
  // .then(function(res){
  //   console.log(res.data)
  // })

  // this.$axios.get("http://localhost:8181/api/naver/oauth")
  // .then(function(res){
  //   console.log(res.data)
    
  //   let url = encodeURIComponent(res.data)
  //   console.log(url)
  //  
  // })

},

// state 생성
generateRandomState() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let state = "";

      for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        state += characters.charAt(randomIndex);
      }

      return state;
    },


//카카오톡 메세지
shareKakao() {
const self = this;
Kakao.Link.sendDefault({
objectType: 'feed',
content: {
title: '일정:   ' + self.kakaoShareTitle,
description: '날짜:  ' + self.kakaoShareDescription + '   시간:  ' + self.kakaoShareTime,
imageUrl: 'https://images.squarespace-cdn.com/content/v1/5ca4dc7716b6402eeb189bc0/48bb2da5-f85b-4b1a-a378-66a844509e46/Plantiful-Secondary2-Black.png?format=150w',
link: {
webUrl: 'https://localhost:8081'
}
},
// social: {
//   likeCount: 257,
//   commentCount: 257,
//   sharedCount: 257,
// },
// buttons: [{
//   title: 'KOSTA로 이동',
//   link: {
//     mobileWebUrl: 'https://edu.kosta.or.kr/lectures/courseInfo/993',
//     webUrl: 'https://edu.kosta.or.kr/lectures/courseInfo/993'
//   }
// }]
installTalk: true,
});
window.location.reload();
},
copyUrl() {
const url = window.location.href;
navigator.clipboard.writeText(url)
.then(() => {
// 복사 성공 시 처리할 내용
alert("URL이 복사되었습니다.");
})
.catch((error) => {
// 복사 실패 시 처리할 내용
console.error("URL 복사에 실패했습니다.", error);
});
},
//날짝 클릭하면 입력 폼 나옴
handleDateClick(arg) {
this.showEventForm = true;
this.isNewEvent = true,
this.newEvent = {
schedule_num: 0,
title: '',
start: dayjs(arg.date).format('YYYY-MM-DD'),
end: dayjs(arg.date).format('YYYY-MM-DD'),
startTime: '',
endTime: '',
info: '',
isLoop: 1,
day: null
};
},


//일정 추가
addEvent() {
const self = this;
const formData = new FormData();
if (self.newEvent.end == 0) {
self.newEvent.end = self.newEvent.start;
};

      formData.append('email', sessionStorage.getItem('loginId'));
      formData.append('group_num', self.newEvent.group_num);
formData.append('title', self.newEvent.title);
formData.append('start', self.newEvent.start);
formData.append('end', dayjs(self.newEvent.end).format('YYYY-MM-DD'));
formData.append('startTime', self.newEvent.startTime);
formData.append('endTime', self.newEvent.endTime);
formData.append('info', self.newEvent.info);
formData.append('alert', self.newEvent.alert);
formData.append('isLoop', self.newEvent.isLoop);
formData.append('day', self.newEvent.day);

// 카카오톡에 데이터 전송
this.$axios.post("http://localhost:8181/api/kakao/form", formData)
.then(res => {
  console.log(res.data)
})


// 데이터 전송
self.$axios.post("http://localhost:8181/schedules", formData)
.then(response => {
  
  // 저장된 이벤트 변수에 저장
  const savedEvent = response.data.dto;
  self.kakaoShareTitle = savedEvent.title;
  self.kakaoShareDescription = savedEvent.start;
  self.kakaoShareTime = savedEvent.startTime;
  // 캘린더에 저장된 이벤트 추가
  self.calendarOptions.events.push({
    title: savedEvent.title,
    start: savedEvent.start,
    end: dayjs(savedEvent.end).format('YYYY-MM-DD'),
    daysOfWeek: savedEvent.day,
    display: 'block', // 시간 표시 설정
    // startEditable: true, // 시작 시간 편집 가능 설정
    // durationEditable: true, // 종료 시간 편집 가능 설정
  });

  
  // 입력된 값들 초기화
  self.newEvent = {
    title: '',
    start: '',
    end: '',
    startTime: '',
    endTime: '',
    // alert: '',
    info: '',
    isLoop: 1,
day: null
};
self.$refs.fullCalendar.getApi().refetchEvents();

// self.$router.go(0);
self.showEventForm = false;
self.shareEvent = true;



})

.catch(error => {
console.error(error);
});

},

//폼 취소
cancel() {
this.showEventForm = false;
this.shareEvent = false;
this.snsEvent = true;


},

cancel2(){

  this.snsEvent = false;
  this.showEventForm = false;
      window.location.reload();
},

    xbtn() {
      this.showEventForm = false;
      this.shareEvent = false;
    },

//일정 클릭 상세보기
    handleEventClick(arg) {
      this.showEventForm = true;
      this.isNewEvent = false;
      const event = arg.event;
      const schedule_num = event.extendedProps.schedule_num;
      this.schedule_num = schedule_num;
      const self = this;
      self.$axios.get("http://localhost:8181/schedules/schedule_num/" + schedule_num)
        .then(response => {
          const scheduleData = response.data.dto;
          console.log(scheduleData);
          // 조회된 데이터를 폼에 보여주기
          self.newEvent = {
            title: scheduleData.title,
            start: scheduleData.start,
            end: scheduleData.end,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            info: scheduleData.info || '',
            isLoop: scheduleData.isLoop,
            day: scheduleData.day,
            group_num: scheduleData.group_num
          };


        })
        .catch(error => {
          console.error(error);
        });
    },

//수정
updateEvent() {
const self = this;
const formData = new FormData();
if (self.newEvent.end == 0) {
self.newEvent.end = self.newEvent.start;
};
formData.append('schedule_num', self.schedule_num);
formData.append('title', self.newEvent.title);
formData.append('start', self.newEvent.start);
formData.append('end', dayjs(self.newEvent.end).format('YYYY-MM-DD'));
formData.append('startTime', self.newEvent.startTime);
formData.append('endTime', self.newEvent.endTime);
formData.append('info', self.newEvent.info);
formData.append('alert', self.newEvent.alert);
if (self.newEvent.isLoop === '2') {
// 반복하는 일정인 경우
formData.append('isLoop', '2');
formData.append('day', self.newEvent.day); // 요일 정보 추가
} else {
// 반복하지 않는 일정인 경우
formData.append('isLoop', '1');
formData.append('day', null); // 요일 정보 null로 설정
}

// 데이터 전송
self.$axios.put("http://localhost:8181/schedules", formData)
.then(function (res) {
if (res.status == 200) {
let dto = res.data.dto;
if (dto != null) {
self.title = dto.title;
self.start = dto.start;
self.end = dto.end;
self.startTime = dto.startTime;
self.endTime = dto.endTime;
self.info = dto.info;
self.isLoop = dto.isLoop;
self.day = dto.day;
}

self.showEventForm = false; // 폼 닫기
self.event = null; // 선택한 이벤트 초기화
location.reload();

}
});
},
//삭제
deleteEvent() {
const self = this;
// 선택한 이벤트 가져오기
const schedule_num = self.schedule_num; // 이벤트의 schedule_num 값 가져오기
self.$axios.delete("http://localhost:8181/schedules/" + schedule_num)
.then(function (res) {
if (res.status === 200) {
self.showEventForm = false; // 폼 닫기
self.event = null; // 선택한 이벤트 초기화
window.location.reload();
} else {
alert("에러코드:" + res.status);
}
}
)
}
}

}

</script>

<style scoped>
body {
  font-family: 'Pretendard-Regular', sans-serif;
}

:root {
  --fc-border-color: black;
  --fc-daygrid-event-dot-width: 5px;
}

.fc-direction-ltr {
  height: 95vh;

}

.calendar_con {
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
  border-radius: 45px;

}

.fc .fc-toolbar-title {
  font-family: 'Pretendard-Regular', sans-serif;
  font-weight: 600;
}

.calendar_btn {
  border: 1px solid black;
  border-radius: 10px;
}

.calendar_btn {
  border: 1px solid black;
  border-radius: 5px;
}

.head-event-form {

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.share-event-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  /* 원하는 폼의 높이로 설정하세요 */
  position: absolute;
  background-color: white;
  border-radius: 10px;
  width: 320px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.share-btn {
  margin: 0 5px;
  padding: 8px 16px;
  background-color: #7AC6FF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.event-form {
  background-color: #fff;
  padding: 20px;
  width: 34s0px;
  border-radius: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-row label {
  width: 100px;
  font-weight: bold;
}

.form-row input[type="text"],
.form-row input[type="date"],
.form-row input[type="time"],
.form-row select {
  flex: 1;
  padding: 5px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
}

.form-buttons button {
  padding: 5px 10px;
  background-color: #9adaf6;
  color: white;
  border: none;
  cursor: pointer;
}

.fc .fc-daygrid-day.fc-day-today {
  background-color: #ffffe1;
}

.fc-event fc-event-start fc-daygrid-event fc-daygrid-block-event fc-h-event {
  border-radius: 10px;
}


.fc-daygrid-day-number {
  text-decoration: none;
  color: black;
}

.fc-col-header-cell-cushion {
  text-decoration: none;
  color: black;
}

/* /* .fc-event-title.fc-sticky{
white-space: normal;
/* } 이벤트 내용 잘릴 때 */

.error {
  border: 1px solid red;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.error-message {
  position: absolute;
  color: rgb(240, 179, 179);
  margin-left: 35px;
}


.naver {
  padding: 0.6em 1em;
  border-radius: 0.25em;
  font-size: 0.8rem;
  margin-top: 0.7em;
  display: flex;
  align-items: center;
  font-weight: 400;
  box-shadow: var(--shadow-1);
  background-color: #03C75A;
  color: white;
}

.naver img {
  height: 0.9rem;
  margin-right: 0.7em;
  margin-left: 0.2em;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.invite-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  height: 200px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #eefffb;
  z-index: 100;

}

.group_info {
  padding-top: 10%;
}

.group_list {
  padding-top: 10%;
}

.invite_btn {
  border: solid 1px darkgray;
  margin-left: 15%;
  border-radius: 5px;

}

.delparty_btn {
  border: solid 1px darkgray;
  margin-right: 15%;
  border-radius: 5px;
}

.grouplist_btn {
  margin-left: 10px;
}

</style>
<style>
.fc .fc-button-primary {
  background-color: #7AC6FF;
  border-color: #16212c61;
  color: var(--fc-button-text-color);
}

.fc-event {
  cursor: pointer;
}

</style>



