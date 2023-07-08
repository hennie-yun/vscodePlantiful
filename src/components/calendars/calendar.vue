<template>
  <div>
    <div class="" style="display: flex; height: 100vh;">
      <div class="sidebar">
        <!-- 오늘 할 일 -->
        <div class="sidebar-today">
          <h4 style="color:gray;">오늘 할 일</h4>
          <ul class="sidebar-list">
            <li v-for="schedule in sortedSchedules" :key="schedule.schedule_num"
              style="display:flex; justify-content: space-evenly;">
              <div style="display:flex">
                <span v-if="schedule.startTime !== null && schedule.startTime !== 'null'">{{ schedule.startTime }}</span>
                <span style="width:150px">{{ schedule.title }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="sidebar-groupinfo">
          <div style="display:flex; justify-content:center">
            <h4 style="position:absolute; color:gray;">그룹 정보</h4>
            <div class="button-container" style="margin-right: -185px; margin-top: 0px;" v-if="selectedGroup">
              <button class="invite_btn" @click="toggleInviteForm" style="width:25px">
                <img :src="require('@/assets/image/invite.png')" style="width:23px;" />
              </button>
              <button class="delparty_btn" style="width:25px; margin-left:25%" v-if="selectedGroupEmails.length === 1"
                @click="showDeleteForm = true">
                <img :src="require('@/assets/image/delgroup.png')" style="width:20px;" />
              </button>
              <button class="outparty_btn" style="width:25px;  margin-left:25%" v-else @click="showOutForm = true">
                <img :src="require('@/assets/image/outgroup.png')" style="width:17px;" />
              </button>


            </div>
          </div>
          <div v-if="selectedGroup">
            <div class="sidebar-groupinfo-name">
              <span>그룹명</span>
              <span>{{ selectedGroup.schedulegroup_num.schedulegroup_title }}</span>
            </div>
            <div class="sidebar-groupinfo-users">
              <span>참여인원 {{ selectedGroupEmails.length }}명</span>
              <span style="margin-right: 10px;">
                <button @click="showEmailList = !showEmailList">
                  <img :src="require('@/assets/image/groupdown.gif')" style="width:20px;" />
                </button>
              </span>
            </div>
            <transition name="fade">
              <ul class="sidebar-list" v-if="showEmailList" style="height: 110px; font-size: 1rem;">
                <li v-for="email in selectedGroupEmails" :key="email">
                  {{ email }}
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <div class="sidebar-grouplist">
          <div class="sidebar-grouplist-title">
            <h4 style="position:absolute; color:gray; padding-top:0">그룹 리스트</h4>
            <router-link to="/group" class="sidebar-grouplist-link">+</router-link>
          </div>
          <div class="sidebar-list-group">
            <ul style="list-style-type: none;">
              <li v-for="group in groups" :key="group.schedulegroup_num" style="margin-top:0px">
                <div style="display:flex; justify-content:space-around; align-items: center; position: relative;">
                  <span style="float: left; position: absolute; margin-left: -135px;">
                    <input type="checkbox" :id="group.schedulegroup_num" :value="group.schedulegroup_num" checked
                      @change="toggleGroupSchedule(group)" /></span>
                  <span><label :for="group.schedulegroup_num" style="margin-right: -100px;">{{ group.schedulegroup_title
                  }}</label></span>
                  <span class="grouplist_btn"><button class="grouplist_btn" :value="group.schedulegroup_num"
                      @click="getGroupParty(group.schedulegroup_num)"
                      :style="{ color: groupColors[group.schedulegroup_color] }">●</button></span>

                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 그룹 삭제,나가기 확인 -->
      <div v-if="showDeleteForm" class="centered-form">
        <div class="delete-form" style="margin-top: 25px;">
          <p style="font-size: larger; font-weight: 600;">그룹을 삭제하시겠습니까?</p>
          <div class="delete-buttons">
            <button class="delete-button" @click="delParty">네</button>
            <button class="cancel-button" @click="xbtn">아니오</button>
          </div>
        </div>
      </div>
      <div v-if="showOutForm" class="centered-form">
        <div class="delete-form" style="margin-top: 25px;">
          <p style="font-size: larger; font-weight: 600;">그룹을 나가시겠습니까??</p>
          <div class="delete-buttons">
            <button class="delete-button" @click="outParty">네</button>
            <button class="cancel-button" @click="xbtn">아니오</button>
          </div>
        </div>
      </div>


      <div class="calendar-con">
        <FullCalendar ref="fullCalendar" :options="calendarOptions" />
      </div>
    </div>




    <!-- 초대 폼 -->
    <transition name="slide">
      <div v-if="showInviteForm" class="invite-form">
        <div>
          <button class="calendar_btn"
            style="float: right; float: right; border: none; font-size: 18px; margin-right: 13px;"
            @click="xbtn">X</button>
        </div>
        <h3 style="display:flex; justify-content: center; color: darkslategray;">그룹 초대하기</h3>
        <div style="display:flex; justify-content: center; font-size: 1.2em;">
          <span>{{ selectedGroup.schedulegroup_num.schedulegroup_title }}</span><span
            :style="{ color: groupColors[selectedGroup.schedulegroup_num.schedulegroup_color] }"
            style="margin-left: 10px;">●</span>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 10px;">
          <label for="emailInput">
            <img :src="require('@/assets/image/invite.png')" style="width:30px; margin-right: 10px; " />
          </label>
          <input type="text" style="width:65%; border:1px solid gray; border-radius: 5px; padding-left: 5px;" id="email"
            v-model="newEvent.email" placeholder=" ex) plantiful@plantiful.com" />
        </div>
        <div style="display: flex; justify-content: center;">
          <button @click="inviteToGroup(selectedGroup.schedulegroup_num)" class="invite-msg">
            초대
          </button>
        </div>
      </div>
    </transition>




    <!--  일정 추가/수정/삭제 코드 -->
    <div v-if="showEventForm" class="head-event-form">

      <div class="event-form">
        <div class="form-row form-buttons">

          <button class="form-xbtn" @click="xbtn" style="padding: 0px 10px; background-color: transparent; color: black;
            border: none; cursor: pointer; font-size:20px">X</button>
        </div>

        <div class="form-row" style="margin-top: -25px;">
          <label for="title" style="postion:absolute;"><img :src="require('@/assets/image/formtitle.png')"
              style="width:32px;" /></label>
          <div class="input-wrapper" style="width:100%">
            <input type="text" id="title" v-model="newEvent.title" class="title-input"
              style="border-radius: 5px; padding-left:5px;" :class="{ 'error': !newEvent.title }" placeholder="제목" />
          </div>
        </div>

        <div class="form-row">
          <label for="start" style="position:absolute; margin-left: 9px;">
            <img :src="require('@/assets/image/formcalendar.png')" style="width:26px;" />
          </label>
          <input type="date" id="start" v-model="newEvent.start" class="date-input"
            style="margin-left:17%; border-radius: 5px;" />
          <label for="end"> ~</label>
          <input type="date" id="end" v-model="newEvent.end" class="date-input"
            style="margin-right:4%; border-radius: 5px;" />
        </div>

        <div class="form-row">
          <label for="startTime"> </label>
          <input type="time" id="startTime" v-model="newEvent.startTime" @change="roundTimeToFiveMinutes"
            class="time-input" style="margin-left:15%; border-radius: 5px;" />
          <label for="endTime"> ~</label>
          <input type="time" id="endTime" v-model="newEvent.endTime" @change="roundTimeToFiveMinutes" class="time-input"
            style="margin-right:4%; border-radius: 5px;" />
        </div>

        <div class="form-row">
          <label for="info" style="position:absolute; margin-left:10px;">
            <img :src="require('@/assets/image/forminfo.png')" style="width:27px;" /></label>
          <textarea id="info" v-model="newEvent.info" class="textarea-input"
            style="border-radius: 5px; height:60px; padding-left: 5px;" placeholder="일정 내용"></textarea>
        </div>

        <div class="form-row">
          <label for="group_num" style="position:absolute; margin-left:10px;">
            <img :src="require('@/assets/image/formgroup.png')" style="width:27px;" /></label>
          <select id="group_num" v-model="newEvent.group_num" class="select-input"
            style="margin-left: 17.2%; margin-right: 3.6%; border-radius: 5px;" :disabled="!isReadOnly">
            <option value="">개인 일정</option>
            <option v-for="group in groups" :value="group.schedulegroup_num" :key="group.schedulegroup_num"> {{
              group.schedulegroup_title }}
            </option>
          </select>
        </div>



        <div class="form-row" style="height: 40px;">
          <label for="isLoop" style="position:absolute; margin-left:10px;">
            <img :src="require('@/assets/image/formrepeat.png')" style="width:28px;" /></label>
          <input type="radio" id="isLoop" v-model="newEvent.isLoop" value="1" class="radio-input" style="margin-left:18%;"
            checked />
          <label for="isLoop">반복 안 함</label>
          <input type="radio" id="isLoop2" v-model="newEvent.isLoop" value="2" class="radio-input" />
          <label for="isLoop2">반복 설정</label>
          <div class="form-row" v-if="newEvent.isLoop === '2'">
            <label for="day"></label>
            <select id="day" v-model="newEvent.day" class="select-input" style="width: 70px; margin-top: 10px; height: 30px; 
            text-align: center; border-radius: 5px;">
              <option value="1">월요일</option>
              <option value="2">화요일</option>
              <option value="3">수요일</option>
              <option value="4">목요일</option>
              <option value="5">금요일</option>
              <option value="6">토요일</option>
              <option value="0">일요일</option>
            </select>
          </div>
        </div>



        <div class="form-row form-buttons">
          <button v-if="isNewEvent && newEvent.title.trim() !== ''" class="calendar_btn fixed-button" @click="addEvent"
            style="margin-right:17px">
            등록
          </button>

          <button v-else-if="!isNewEvent" class="calendar_btn" @click="updateEvent">수정</button>

          <button v-if="!isNewEvent" class="calendar_btn" @click="deleteEvent">삭제</button>

        </div>

      </div>
    </div>
  </div>


  <div v-if="shareEvent || snsEvent" class="share-event-form">
    <div class="form-content">
      <div class="shareform-top">
        <button @click="cancel" style="margin-right: 10px; color:gray;">
          X
        </button>
      </div>
      <div class="shareform-row">
        <div class="shareform-left">
          <div class="shareform-title">일정 공유</div>
          <div style="display: flex; justify-content: space-evenly;">
            <button class="share-btn" @click="copyUrl" style="display: grid;">
              <img :src="require('@/assets/image/url.png')" style="margin-right: 10px; width: 40px" />
              <span style="font-size: 14px;">URL 복사</span>
            </button>
            <button class="share-btn" @click="shareKakao" style="display: grid;">
              <img :src="require('@/assets/image/kakaotalk.png')" style="width: 40px; border-radius: 29px;" />
              <span style="font-size: 14px;">메세지 전송</span>
            </button>
          </div>
        </div>
        <div class="shareform-divider"></div>
        <div class="shareform-right">
          <div class="shareform-title">소셜 캘린더 연동</div>
          <div style="display: flex; justify-content: space-evenly;">
            <button class="share-btn" @click="naver" style="display: grid;">
              <img :src="require('@/assets/image/naver.webp')"
                style="margin-right: 10px; width: 40px; border-radius: 8px;" />
              <span style="font-size: 14px;">네이버 캘린더</span>
            </button>
            <button class="share-btn" @click="kakao" style="display: grid;">
              <img :src="require('@/assets/image/kakaotalk.png')"
                style="margin-right: 10px; width: 40px; border-radius: 8px;" />
              <span style="font-size: 14px;">카카오 캘린더</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>






  <div v-if="showShareForm" class="centered-form">
    <div class="delete-form" style="margin-top: 25px;">
      <p style="font-size: larger; font-weight: 600;">그룹을 삭제하시겠습니까?</p>
      <div class="delete-buttons">
        <button class="delete-button" @click="delParty">네</button>
        <button class="cancel-button" @click="xbtn">아니오</button>
      </div>
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

  computed: {

    

    sortedSchedules() {
      return this.uniqueSchedules.sort((a, b) => {
        // startTime을 오름차순으로 정렬합니다.
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        // startTime이 없는 경우 뒤로 보냅니다.
        if (!a.startTime && b.startTime) {
          return 1;
        }
        if (a.startTime && !b.startTime) {
          return -1;
        }
        return 0;
      });
    }
  },

  components: {
    FullCalendar
  },
  data() {
    return {
      state: this.$route.query.state,
      code: this.$route.query.code,
      access_token: '',
       isNewEvent: true,
      showEventForm: false,
      showShareForm: false,
      showDeleteForm: false,
      showOutForm: false,
      shareEvent: false,
      snsEvent: false,
      showEmailList: false,
      groupTitle: '',
      reslist: [],
      list: [],
      items: [],
      groups: [],
      uniqueSchedules: [],
      filteredSchedules: [],
      checkedGroups: [],
      selectedGroup: null,
      selectedGroupEmails: [],
      selectedGroupSchedules: [],
      startSchedules: [],
      todayschedules: [],
      filteredList: [],
      filterdgroupnumlist: [],
      members: [],
      partylist: [],
      showInviteForm: false,
      inviteEmail: '',
      invitelist: [],
      inviteall: [],
      newEvent: [{
        id: 0,
        group_num: '',
        title: '',
        start: '',
        end: '',
        startTime: '00:00',
        endTime: '00:00:',
        info: '',
        alert: '00:00',
        isLoop: 1,
        day: 1
      }],

      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: '',
          center: 'title',
          right: 'today prev,next',
        },
        editable: true,
        dayMaxEvents: true,
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
        eventResize: this.handleEventResize,
        eventDrop: this.handleEventDrop
      }
    }
  },




  // 페이지 시작- 실행되는 함수
  //로그인 한 사람의 일정 보여주기
   created() {
   

    this.code = this.$route.query.code
    this.state = this.$route.query.state
    console.log(this.code)
    console.log(this.state)

    let kakaocode = sessionStorage.getItem('kakaocode')
    if (kakaocode == this.code) {
      this.getKakaoToken()
      sessionStorage.removeItem('kakaocode')
    }

    let navercode = sessionStorage.getItem('navercode')
    let naverstate = sessionStorage.getItem('naverstate')
    if(navercode !== undefined && navercode === this.code){
      if(naverstate !== undefined && naverstate === this.state)
      this.executeNaverCode(navercode, naverstate)
      sessionStorage.removeItem('navercode')
      sessionStorage.removeItem('naverstate')
    }



    
    // 전부 체크된 상태로 시작하도록 checkedGroups 배열 초기화
    this.checkedGroups = this.groups.map(group => group.schedulegroup_num);
    const self = this;
    let token = sessionStorage.getItem('token');
    this.email = sessionStorage.getItem('loginId');

    self.groupColors = {
     1: '#f7a482',
      2: '#add4a5',
      3: '#d094e5',
      4: '#e6c493',
      5: '#ffc0cb',
      6: '#98a6ff',
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
           if (grouplist == undefined) {
            alert("로그아웃")
            location.href = "/login"
            return;
          }
          self.groups = grouplist.map((item) => item.schedulegroup_num);
          console.log(self.groups);
          self.colors = self.groups.map((group) => self.groupColors[group.group_color] || '#7AC6FF');

          self.$axios
            .get("http://localhost:8181/schedules/email/" + self.email, {
              headers: { token: token },
            })
            .then(function (res) {
              if (res.status === 200) {
                self.reslist = res.data.list;
                console.log(self.reslist)

                self.reslist.forEach(function (item) {
                  const groupColor = item.group_num && self.groupColors[item.group_num.schedulegroup_color] || '#7AC6FF';
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
                    const startTime = item.startTime !== null && item.startTime !== 'null' ? item.startTime : '';
                    const endTime = item.endTime !== null && item.endTime !== 'null' ? item.endTime : '';
                    if (startTime !== '' && endTime !== '') {
                      title += ' ' + startTime + ' ~ ' + endTime;
                    } else if (startTime !== '' || endTime !== '') {
                      title += ' ' + startTime + endTime;
                    }
                  }
                  return title;
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
                self.groupnums = groupnums
                const currentDate = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'YYYY-MM-DD' 형식으로 가져옴
                console.log(self.groupnums)
                self.filteredSchedules = self.reslist.filter(item => {
                  const startDate = item.start;
                  const endDate = item.end;
                  return startDate <= currentDate && endDate >= currentDate;
                });
                console.log(self.filteredSchedules)
                self.filteredSchedules = self.filteredSchedules.concat(
                  self.groupnums.filter(item => {
                    const startDate = item.start;
                    const endDate = item.end;
                    return startDate <= currentDate && endDate >= currentDate;
                  })
                );
                self.uniqueSchedules = self.filteredSchedules.filter((item, index, array) => {
                  return array.findIndex(obj => obj.schedule_num === item.schedule_num) === index;
                });

                console.log(self.uniqueSchedules);

                console.log(self.filteredSchedules)
              });

              function generateTitle(item) {
                let title = item.title;
                if (item.startTime || item.endTime) {
                  const startTime = item.startTime !== null && item.startTime !== 'null' ? item.startTime : '';
                  const endTime = item.endTime !== null && item.endTime !== 'null' ? item.endTime : '';
                  if (startTime !== '' && endTime !== '') {
                    title += ' ' + startTime + ' ~ ' + endTime;
                  } else if (startTime !== '' || endTime !== '') {
                    title += ' ' + startTime + endTime;
                  }
                }
                return title;
              }


            })
            .catch(error => {
              console.error(error);
            });

        });

        self.$axios.get("http://localhost:8181/groupparty")
          .then(function (res) {
            if (res.status == 200) {
              self.partylist = res.data.list;
              console.log(self.partylist)
            }
          })

        //초대받은 사람의 자동 초대 가입 
        self.$axios.get("http://localhost:8181/invite/email/" + self.email, { headers: { token: token } })
          .then(response => {
            console.log(self.email)
            self.invitelist = response.data.list;
            self.invitelist.forEach(item => {
              const invitenum = item.invitenum;
              console.log(invitenum);
            });
            if (self.invitelist.length > 0) {
              const formData = new FormData();
              self.invitelist.forEach(item => {
                console.log(self.items)
                const schedulegroupnum = item.groupnum.schedulegroup_num;
                // 중복 여부 확인을 위한 변수
                let isDuplicate = false;
                console.log(isDuplicate)
                // self.items 배열의 schedulegroup_num.schedulegroup_num 값과 비교하여 중복 여부 확인
                self.items.forEach(item => {
                  console.log(item.schedulegroup_num.schedulegroup_num)
                  if (item.schedulegroup_num.schedulegroup_num === schedulegroupnum) {

                    isDuplicate = true;
                    console.log(isDuplicate)
                    return; // 중복이면 더 이상 진행하지 않고 종료
                  }
                });

                if (!isDuplicate) {
                  formData.append('schedulegroup_num', schedulegroupnum);
                  formData.append('member_email', self.email);
                }
              });

              if (formData.has('schedulegroup_num')) {
                self.$axios.post("http://localhost:8181/groupparty", formData)
                  .then(response => {
                    const invitemember = response.data.dto;
                    console.log(invitemember);
                  })
                  .catch(error => {
                    console.error(error);
                  });

              }
            }
            self.invitelist.forEach(item => {
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

        //오늘 일정 보이기
        // const startDate = new Date().toISOString().split('T')[0];
        // const currentDate = new Date(); // 현재 날짜와 시간
        // const startDate = currentDate.toLocaleDateString('ko-KR'); // 로컬 시간대를 기준으로 날짜를 문자열로 변환
        // const currentDate = new Date(); // 현재 날짜와 시간
        // const year = currentDate.getFullYear(); // 년도
        // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1 필요), 두 자리로 패딩
        // const day = String(currentDate.getDate()).padStart(2, '0'); // 일, 두 자리로 패딩
        // const formattedDate = `${year}-${month}-${day}`;





      });






  },




  methods: {

    // kakao 스케줄 연동할때 시간 5분 차이로 설정할 것!!!!
    getKakaoToken() { // id값으로 분류하는것 추가!!
      let token = sessionStorage.getItem('token')
      this.$axios.get("http://localhost:8181/api/kakao/member", {headers:{"token":token}})
      .then((res)=>{
        let id = res.data.id
        console.log(id)
        if(id==1){
          console.log("코드 확인:"+this.code)
          this.$axios.get("http://localhost:8181/api/kakao/token", {headers:{"authorization_code":this.code}})
          .then(function(res){
            console.log(res.data)
          })
      } 
    })
    },
    
    
    kakaoscheduleadd(access_token){
      const self = this
      console.log(self.code)
      this.$axios.get('http://localhost:8181/api/kakao/add', {headers:{"access_token":access_token}})
    .then((res)=>{
      console.log(res.data)
    })
    },




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
          console.log(this.partylist)
          console.log(email)
          // 중복 여부 확인
          const isEmailDuplicate = this.inviteall.some(item => item.email.email === email);
          const isGroupnumDuplicate = this.inviteall.some(item => item.groupnum.schedulegroup_num === groupnum);
          // const isPartyemailDuplicate = this.partylist.some(item => item.member_email.email === email);
          // const isPartygroupnumDuplicate = this.partylist.some(item => item.schedulegroup_num.schedulegroup_num === groupnum);

          if (isEmailDuplicate && isGroupnumDuplicate) {
            alert("이미 초대된 email 입니다. invite"); // 초대 테이블 중복인 경우 알림 표시
            this.showInviteForm = false;
            return;
          }


          // partylist 배열을 순회하면서 조건에 해당하는 항목을 찾기
          for (let i = 0; i < this.partylist.length; i++) {
            const item = this.partylist[i];

            if (item.member_email.email === email && item.schedulegroup_num.schedulegroup_num === groupnum) {
              // 조건에 해당하는 항목을 찾았을 때 추가 작업 수행
              alert('이미 가입된 이메일 입니다.')
              return;
            }

          } if (isEmailDuplicate == true) {
            alert("다른 그룹의 가입을 대기 중입니다.")
            return;
          }
          // else if (isPartyemailDuplicate && isPartygroupnumDuplicate) {
          //   console.log(isPartyemailDuplicate)
          //   alert("이미 초대된 email 입니다. gruopparty"); // 그룹 파티 중복인 경우 알림 표시
          //   this.showInviteForm = false;
          //   return;
          // }

          // 중복이 아닌 경우 POST 요청으로 전송
          this.$axios.post("http://localhost:8181/invite", formData)
            .then(response => {
              const inviteflag = response.data.flag;
              if (inviteflag == false) {
                alert("유효하지 않은 회원입니다.")
              } else {
                this.showInviteForm = false;
                alert("초대 메세지 전송 완료")
              }
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
      this.showDeleteForm = true;
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
      this.showOutForm = true;
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

      let token = sessionStorage.getItem('token')
      this.$axios.get("http://localhost:8181/api/kakao/member", { headers: { "token": token } })
        .then((res) => {
          let id = res.data.id
          if (id == 1) { // 비동기 함수를 callback 새 페이지에 하고 다시 캘린더로 돌아와서
            if (this.code === undefined) { // 받아온 this.code값이 없을때는 코드 요청
              const redirect_uri = 'http://localhost:8182/calendar'
              const clientId = 'd54083f94196531e75d7de474142e52e';
              const Auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=talk_calendar`; // 코드값


              window.location.href = Auth_url;

            } else { // 받아온 this.code값이 있을때는
              console.log(this.code)
              // 세션에 KakaoToken()함수가 있는지 확인용

              sessionStorage.setItem('kakaocode', this.code)

            }
          } else {
            location.href = '/login'
          }
        })





  // var auth = function(){
  //   setTimeout(function(){
  //     const redirect_uri = 'http://localhost:8182/calendar';
  //     const clientId = 'd54083f94196531e75d7de474142e52e';
  //     const Auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=talk_calendar`;
  //     window.location.href = Auth_url;
  //     console.log("callback"+this.code)
  
  //   }, 0);
  // };
  // auth(function(){
  //   console.log('aaa')
  //   if(this.code != null){
  //     this.$axios.get("http://localhost:8181/api/kakao/token", {headers:{"authorization_code":this.code}})
  //     .then(function(res){
  //       console.log("data"+res.data)
     


  // const redirect_uri = 'http://localhost:8182/calendar';
  // const clientId = 'd54083f94196531e75d7de474142e52e';
  // const Auth_url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=talk_calendar`;
  // window.location.href = Auth_url;
  // console.log(this.code)
  
 // this.getKakaoToken()



  /*
  let token = sessionStorage.getItem('token')
  console.log(token)

  // 토큰 요청
this.$axios.get("http://localhost:8181/api/kakao/token", {headers:{"token":token}})
.then(function(res){
  console.log(res.data.access_token) 
})
*/

/*
// 톡캘린더 스케줄 연동
this.$axios.get("http://localhost:8181/api/kakao/add",)
.then(function(res){
  console.log(res.data)
  // alert(res.data)
})
*/

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
    naver() {


      const clientId = "IiiFJKBOyzL3qvfXasPq"
      const redirectURI = encodeURIComponent("http://localhost:8182/calendar");

      const state = this.generateRandomState()
      const naverAuthURL = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&state=' + state;

  window.location.href = naverAuthURL

  let formData = new FormData()
  formData.append('state', state)
  formData.append('code', this.code)
  this.$axios.get("http://localhost:8181/api/naver/callback", formData)
  .then((res)=> {
    console.log(res.data)
  })

      /*this.$axios.get("http://localhost:8181/api/naver/tokenprovider/", {headers:{"token": token}})
      .then(function(res){
        console.log(res.data)
      })
     */
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
   executeNaverCode(code, state) {
      let formData = new FormData()
      formData.append('state', state)
      formData.append('code', code)
      this.$axios.get("http://localhost:8181/api/naver/callback", formData)
        .then((res) => {
          console.log(res.data)
        }).catch((error) => {
          console.log(error)
        })

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
imageUrl: 'https://previews.123rf.com/images/gustavofrazao/gustavofrazao1610/gustavofrazao161000313/64284988-%EB%85%B8%ED%8A%B8%EB%B6%81-%EB%B0%B0%EA%B2%BD%EC%9C%BC%EB%A1%9C-%EB%82%98%EB%AC%B4-%ED%81%90%EB%B8%8C%EC%97%90-%EC%93%B0%EC%97%AC%EC%A7%84-%EA%B3%84%ED%9A%8D.jpg',
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


//url복사
copyUrl() {
const url = window.location.href;
navigator.clipboard.writeText(url)
.then(() => {
// 복사 성공 시 처리할 내용
          this.shareEvent = false;
          this.snsEvent = true;
alert("URL이 복사되었습니다.");
})
.catch((error) => {
// 복사 실패 시 처리할 내용
console.error("URL 복사에 실패했습니다.", error);
});
},
   //날짝 클릭하면 입력 폼 나옴
    handleDateClick(arg) {
      this.isReadOnly = true;
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
          day: 1,
          group_num: ''
        };
    },



    //일정 추가
    addEvent() {
      const self = this;
      const formData = new FormData();
      if (self.newEvent.end == 0) {
        self.newEvent.end = self.newEvent.start;
      };
      if (self.newEvent.isLoop === 1) {
        self.newEvent.day = '';
      }

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


      
          // 네이버에 데이터 전송
          console.log(">>>>>>>>>>> naver")
          this.$axios.post('http://localhost:8181/api/naver/calendar', formData)
            .then(function (res) {
              console.log("naver에 전송"+res.data)
            })
          console.log(">>>>>>>>>>> kakao")
          //카카오에 데이터 전송
          this.$axios.post('http://localhost:8181/api/kakao/form', formData)
            .then(function (res) {
              console.log("kakao에 전송" + res.data)
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
            // color: (item.group_num && item.group_num.group_num === item.schedulegroup_num) ? groupColor : '#7AC6FF',
            group_num: savedEvent.group_num
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
            day: '',
          };
          self.$refs.fullCalendar.getApi().refetchEvents();

          // self.$router.go(0);
          self.showEventForm = false;
          location.reload();

          // 네이버에 데이터 전송
          // console.log(">>>>>>>>>>> naver")
          // this.$axios.post('http://localhost:8181/api/naver/calendar', formData)
          //   .then(function (res) {
          //   })
          //   console.log(">>>>>>>>>>> kakao")
          //        //카카오에 데이터 전송
          // this.$axios.post('http://localhost:8181/api/kakao/form', formData)
          //   .then(function (res) {
          //   })

        })

        .catch(error => {
          console.error(error);
        });

    },


    shareaddEvent() {
      const self = this;
      const formData = new FormData();
      if (self.newEvent.end == 0) {
        self.newEvent.end = self.newEvent.start;
      };
      if (self.newEvent.isLoop === 1) {
        self.newEvent.day = '';
      }

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
            // color: (item.group_num && item.group_num.group_num === item.schedulegroup_num) ? groupColor : '#7AC6FF',
            group_num: savedEvent.group_num
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
            day: '',
          };
          self.$refs.fullCalendar.getApi().refetchEvents();

          // self.$router.go(0);
          self.showEventForm = false;
          self.shareEvent = true;
          location.reload();


        })

        .catch(error => {
          console.error(error);
        });
    },

//폼 취소
cancel() {
this.showEventForm = false;
this.shareEvent = true;
this.snsEvent = true;
      location.reload();
},

cancel2(){

  this.snsEvent = false;
  this.showEventForm = false;
  window.location.reload();
},

xbtn() {
  this.showEventForm = false;
  this.shareEvent = false;
  this.showInviteForm = false;
  this.showDeleteForm = false;
  this.showOutForm = false;
},

     //일정 클릭 상세보기
    handleEventClick(arg) {
      this.isReadOnly = false;
      this.dayMaxEvents = false,
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
            schedule_num: schedule_num,
            title: scheduleData.title,
            start: scheduleData.start,
            end: scheduleData.end,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            info: scheduleData.info || '',
            isLoop: scheduleData.isLoop,
            day: scheduleData.day,
            group_num: scheduleData.group_num ? scheduleData.group_num.schedulegroup_num : ''
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

//일정 옮겨서 수정
handleEventDrop(info) {
  const event = info.event;
  const schedule_num = event._def.extendedProps.schedule_num;
  const newStart = dayjs(event.start).format('YYYY-MM-DD');
  const newEnd = dayjs(event.end).add(-1, 'day').format('YYYY-MM-DD');

  console.log(event.start)
  let self = this;
  // 변경된 일정 정보를 서버로 전송
  self.$axios.patch("http://localhost:8181/schedules/resize/" + schedule_num + '/' + newStart + '/' + newEnd)
    .then(function (response) {
      const newschedule = response.data.dto;
      // 일정 업데이트 성공
      // location.reload();
      console.log(newschedule + '일정 업데이트');
    })
    .catch(function (error) {
      // 일정 업데이트 실패
      console.error(error);
    });
},

//일정 길이 늘려서 수정
handleEventResize(info) {
  const event = info.event;
  const schedule_num = event._def.extendedProps.schedule_num;
  const newStart = dayjs(event.start).format('YYYY-MM-DD');
  const newEnd = dayjs(event.end).add(-1, 'day').format('YYYY-MM-DD');
  console.log(info.event._def.extendedProps.schedule_num)
  // 변경된 일정 정보를 서버로 전송
  this.$axios.patch("http://localhost:8181/schedules/resize/" + schedule_num + '/' + newStart + '/' + newEnd)
    .then(function (response) {
      // 일정 업데이트 성공
      const resize = response.data.dto;
      console.log(resize + '일정 업데이트');
      // location.reload();
    })
    .catch(function (error) {
      // 일정 업데이트 실패
      console.error('일정 업데이트 실패', error);
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
    })
}
}
}




</script>

<style scoped>
:root {
  --fc-border-color: black;
  --fc-daygrid-event-dot-width: 5px;
}

.calendar-con {
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  font-family: 'Pretendard-Regular';
  width: 80%;
  padding: 2% 4% 4% 4%;
  height: 100vh;
}


.calendar_btn {
  border: 1px solid black;
  border-radius: 10px;
}



.event-form {
  background-color: white;
  padding: 20px;
  width: 150%;
  height: 28rem;
  border-radius: 10px;
}

.fixed-button {
  position: absolute;
  /* 원하는 위치 조정 */
  margin-left: 362px;
}


.close-button {
  float: right;
}

.title-input {
  width: 86.8%;
  border: 1px solid gray;
  margin-left: 8.5%;
  height: 32px;
}

.date-input,
.time-input {
  width: 50%;
  border: 1px solid gray;
}

.textarea-input {
  width: 79.1%;
  border: 1px solid gray;
  margin-left: 17.2%;
}

.radio-input {
  margin-right: 0.5rem;
  border: 1px solid gray;
}

.select-input {
  width: 30%;
  border: 1px solid gray;
}

.centered-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  font-family: 'Pretendard-Regular';
  width: 25%;
  height: 20%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
}

.delete-buttons {
  margin-top: 35px;
  display: flex;
  justify-content: space-evenly;
}

.head-event-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  font-family: 'Pretendard-Regular';
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.share-event-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  position: absolute;
  background-color: white;
  border-radius: 10px;
  width: 43%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
  font-family: 'Pretendard-Regular';
}

.form-content {
  width: 100%;
  max-width: 800px;
}

.shareform-row {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 20px;
}

.shareform-left,
.shareform-right {
  flex-grow: 1;
  text-align: center;
}

.shareform-divider {
  width: 2px;
  height: 100px;
  background-color: #ccc;
  margin: 0 20px;
}

.shareform-top {
  display: flex;
  justify-content: right;
  margin-top: -40px;
  font-size: 17px;
  margin-right: 14px;
}

.shareform-title {
  font-size: 1.2rem;
  margin-bottom: 25px;
  font-weight: bold;
  color: dimgray;
}

.share-btn {
  margin: 0 5px;
  padding: 8px 16px;
  color: hsl(0, 0%, 0%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: grid;
  grid-auto-columns: max-content;
  place-items: center;
}

/* Hover Shadow */
@keyframes hover {
  50% {
    transform: translateY(-3px);
  }

  100% {
    transform: translateY(-6px);
  }
}

@keyframes hover-shadow {
  0% {
    transform: translateY(6px);
    opacity: .4;
  }

  50% {
    transform: translateY(3px);
    opacity: 1;
  }


  100% {
    transform: translateY(6px);
    opacity: .4;
  }
}

.share-btn {
  display: inline-block;
  position: relative;
  transition-duration: $defaultDuration;
  transition-property: transform;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:before {
    pointer-events: none;
    position: absolute;
    z-index: -1;
    content: '';
    top: 100%;
    left: 5%;
    height: 10px;
    width: 90%;
    opacity: 0;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, .35) 0%, rgba(0, 0, 0, 0) 80%);
    /* W3C */
    transition-duration: $defaultDuration;
    transition-property: transform opacity;
  }

  &:hover {
    transform: translateY(-6px);
    animation-name: hover;
    animation-duration: 1.5s;
    animation-delay: $defaultDuration;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;

    &:before {
      opacity: .4;
      transform: translateY(6px);
      animation-name: hover-shadow;
      animation-duration: 1.5s;
      animation-delay: .3s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }
  }
}



.shareform {
  display: flex;
  justify-content: space-evenly;
  align-items: center
}

.share-btn-div {
  width: 30%;
}




.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-row label {
  margin-right: 5px;
  font-weight: bold;
  margin-left: 5px;
}

/* .form-row input[type="text"], */
.form-row input[type="date"],
.form-row input[type="time"],
.form-row select {
  flex: 1;
  padding: 5px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  position: relative;
}

.form-buttons button {
  background-color: #9adaf6;
  color: white;
  border: none;
  cursor: pointer;
  width: 70px;
  height: 40px;
  margin-bottom: 10px;
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


.invite-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28%;
  height: 30%;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 100;
  font-family: 'Pretendard-Regular';
  border-radius: 10px;
}

.invite-msg {
  border: 1px solid gray;
  margin-top: 23px;
  display: inline-block;
  height: 36px;
  border-radius: 6px;
  background-color: #7AC6FF;
  color: white;
  border-color: #7AC6FF;
  width: 60px;
}

.sidebar {
  width: 20%;
  padding: 2%;
  border: none;
  background-color: ivory;
  text-align: center;
  font-family: 'Pretendard-Regular';
  height: 100vh;
}




.sidebar-today {
  padding-top: 3%;
  height: 32%;
  border-bottom: 0.5px solid darkgray;
}

.sidebar-groupinfo {
  padding-top: 5%;
  height: 34%;
  border-bottom: 0.5px solid darkgray;
}

.sidebar-groupinfo-name {
  font-size: 1rem;
  padding-top: 3%;
  display: flex;
  justify-content: space-evenly;
}

.sidebar-groupinfo-users {
  font-size: 1rem;
  padding-top: 3%;
  display: flex;
  justify-content: space-evenly;
}

.sidebar-grouplist {
  padding-top: 5%;
  height: 35%;
}

.sidebar-grouplist-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-grouplist-link {
  font-size: 25px;
  margin-left: 75%;
  text-decoration: none;
  color: gray;
}

.sidebar-list {
  list-style-type: none;
  overflow: scroll;
  height: 70%;
}

.sidebar-list-group {
  height: 85%;
  overflow: scroll;
  list-style-type: none;
}

.sidebar-list::-webkit-scrollbar-thumb {
  background-color: #f3f3f3;
  /* 스크롤바의 색상 설정 */
}

.sidebar-list::-webkit-scrollbar-thumb:hover {
  background-color: #cffefe;
  /* 스크롤바에 마우스 호버 시 색상 설정 */
}

.sidebar-list::-webkit-scrollbar {
  width: 10px;
  height: auto;
  background: transparent;
}


.sidebar-list-group::-webkit-scrollbar-thumb {
  background-color: #f3f3f3;
  /* 스크롤바의 색상 설정 */
}

.sidebar-list-group::-webkit-scrollbar-thumb:hover {
  background-color: #cffefe;
  /* 스크롤바에 마우스 호버 시 색상 설정 */
}

.sidebar-list-group::-webkit-scrollbar {
  width: 10px;
  background: transparent;
}

.delparty_btn {
  margin-left: 10%;
}

.outparty_btn {
  margin-left: 10%;
}

.invite_btn {
  display: inline-block;
  transition-duration: $defaultDuration;
  transition-property: transform;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:hover {
    transform: scale(1.1);
  }
}

.delparty_btn {
  display: inline-block;
  transition-duration: $defaultDuration;
  transition-property: transform;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:hover {
    transform: scale(1.1);
  }
}

.outparty_btn {
  display: inline-block;
  transition-duration: $defaultDuration;
  transition-property: transform;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:hover {
    transform: scale(1.1);
  }
}




/* 그룹색깔hover */
@keyframes pulse {
  25% {
    transform: scale(1.1);
  }

  75% {
    transform: scale(.9);
  }
}

.grouplist_btn {
  margin-left: 10px;
  font-size: 20px;
  margin-top: 1px;
  display: inline-block;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:hover {
    animation-name: pulse;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.7s, opacity 0.3s;
}

.fade-enter {
  opacity: 0;
  transform: translateY(100%);
}

.fade-leave {
  opacity: 0;
  transform: translateY(-100%);
}

.cancel-button {
  display: inline-block;
  transition-duration: $defaultDuration;
  transition-property: transform;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:hover {
    transform: scale(.9);
  }
}

.delete-button {
  display: inline-block;
  transition-duration: $defaultDuration;
  transition-property: transform;

  @include hideTapHighlightColor();
  @include hardwareAccel();
  @include improveAntiAlias();

  &:hover {
    transform: scale(.9);
  }
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

.fc-h-event {
  background-color: white;
  border: 1px solid white;
  display: block;
}

.fc-icon {
  line-height: 0.7;
}

.fc-col-header-cell-cushion {
  text-decoration: none;
  color: black;
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

.fc .fc-toolbar-title {
  font-family: 'Pretendard-Regular', sans-serif;
  font-weight: 600;
}

.fc-direction-ltr {
  height: 107%;

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

.schedule-item {
  max-height: 60px;
  /* 일정 칸의 최대 높이 설정 */
  overflow: hidden;
  /* 내용이 넘칠 경우 숨김 처리 */
  text-overflow: ellipsis;
  /* 텍스트 생략 부호 '...' 표시 */
  white-space: nowrap;
  /* 텍스트 줄바꿈 방지 */
}

.fc-theme-standard td,
.fc-theme-standard th {
  border: 1px solid #008bb5;
  height: fit-content;
  text-overflow: ellipsis;
}

.fc .fc-popover {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 6px;
  position: absolute;
  z-index: 100;
}

.fc .fc-scrollgrid-liquid {
  height: 100%;
  border-top: 1px solid rgb(0, 139, 181);
  border-left: 1px solid rgb(0, 139, 181);
}
</style>


