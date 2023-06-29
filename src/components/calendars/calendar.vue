<template>
                      <div class="container calendar_con" style="width: 70%; padding: 2%; height: 100vh;">
    
                          <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    
                          <div v-if="showEventForm" class="head-event-form">
    
                              <div class="event-form">
                                                                             <div class="form-row form-buttons">
    
                                                                           <button class="calendar_btn" @click="cancel">X</button>
                                                                                </div>
    
                                                                        <div class="form-row">
    
                                                                       <label for="title">제목</label>
    
                                                                        <input type="text" id="title" v-model="newEvent.title" />
    
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
                                                                 <div v-if="shareEvent" class="share-event-form">
                                                                  <div class="form-row">
    
                                                                    <div class="form-row form-buttons">
    
                                                                     <button class="calendar_btn" @click="cancel">아니오</button>
                                                                      </div>
                                                                    <div class="form-row form-buttons">
    
                                                                     <button class="calendar_btn" @click="shareKakao">카카오톡 공유</button>
                                                                      </div>

                                        </div>
                                                                </div>
    
                                                            <router-view/>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import axios from 'axios';



export default {
  components: {
    FullCalendar
  },
  name: 'calendar',
  data() {
    return {
      isNewEvent: true,
      showEventForm: false,
      shareEvent: false,
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
        locale: 'ko',
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
    let token = sessionStorage.getItem('token')
    this.email = sessionStorage.getItem('loginId')
    console.log(this.email + " 로그인 ");
    const self = this;
    self.$axios.get("http://localhost:8181/schedules/email/" + self.email, { headers: { 'token': token } })
      .then(function (res) {
        if (res.status === 200) {
          const reslist = res.data.list;
          reslist.forEach(function (item) {
            if (item.isLoop === 2) { // 반복 설정된 일정
              self.calendarOptions.events.push({
                schedule_num: item.schedule_num,
                title: item.title + (item.startTime ? ' ' + item.startTime : '') + ' ~ ' + (item.endTime ? ' ' + item.endTime : ''),
                //startTime값이 존재하면 추가, 없으면 공백 
                start: item.start,
                end: dayjs(item.end).add(1, 'day').format('YYYY-MM-DD'),
                color: '#7AC6FF',
                display: 'block',
                daysOfWeek: item.day,
              });

            } else { // 반복 설정되지 않은 일정
              self.calendarOptions.events.push({
                schedule_num: item.schedule_num,
                title: item.title + (item.startTime ? ' ' + item.startTime : '') + ' ~ ' + (item.endTime ? ' ' + item.endTime : ''),
                start: item.start, // start에 날짜와 시간을 함께 표시
                end: dayjs(item.end).add(1, 'day').format('YYYY-MM-DD'),
                color: '#7AC6FF',
                display: 'block',
              });
            }
          });

        } else {
          alert("에러코드: " + res.status);
        }
      })
  },

  methods: {
    //카카오톡 메세지
    shareKakao() {
      const self = this;
      Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '일정: ' + self.kakaoShareTitle,
          description: '날짜: ' + self.kakaoShareDescription,
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
},

//일정 클릭 상세보기
handleEventClick(arg) {
this.showEventForm = true;
this.isNewEvent = false;
const event = arg.event;
const schedule_num = event.extendedProps.schedule_num;
this.schedule_num = schedule_num; // 이벤트의 schedule_num 값 가져오기
const self = this;
self.$axios.get("http://localhost:8181/schedules/" + schedule_num)
.then(response => {
const scheduleData = response.data.dto;
// 조회된 데이터를 폼에 보여주기
self.newEvent = {
title: scheduleData.title,
start: scheduleData.start,
end: scheduleData.end,
startTime: scheduleData.startTime,
endTime: scheduleData.endTime,
info: scheduleData.info,
isLoop: scheduleData.info,
day: scheduleData.day
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
              self.alert = dto.alert;
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
})
}


}
}
</script>



<style>
:root {
--fc-border-color: black;
--fc-daygrid-event-dot-width: 5px;
}
@font-face {
font-family: 'Pretendard-Regular';
src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
font-weight: 400;
font-style: normal;
}
.fc-direction-ltr{
height: 95vh;

}
.calendar_con {
box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
border-radius: 45px;
}
.fc .fc-toolbar-title{
font-family: 'Pretendard-Regular', sans-serif;
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

.share-event-form{
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
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

.fc-event {
cursor: pointer;
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

</style>
