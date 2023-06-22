<template>
                                                                      <div class="container calendar_con" style="width: 70%; padding: 2%; ">
    
                                                                          <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    
                                                                          <div v-if="showEventForm" class="head-event-form">
    
                                                                              <div class="event-form">
    
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
    
    
    
                                                                                  <div class="form-row">
    
                                                                                      <label for="isLoop">일정 반복 여부</label>
    
                                                                                      <input type="radio" id="isLoop" v-model="newEvent.isLoop" value="1" checked />반복안함.
    
                                                                                      <input type="radio" id="isLoop2" v-model="newEvent.isLoop" value="2" />반복 설정
    
                                                                                  </div>
    
    
    
                                                                                  <div class="form-row" v-if="newEvent.isLoop == 2">
    
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
    
                                                                                      <button class="calendar_btn" @click="cancel">취소</button>
    
                                                                                      <button class="calendar_btn" @click="addEvent">일정 추가</button>
    
                                                        </div>
    
                                                    </div>
    
                                                </div>
    
                                            </div>
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
      email: 'sessionStorage.getItem("email")',
      showEventForm: false,
      //schedule_num: parseInt(this.$route.query.schedule_num),
      newEvent: {
        title: '',
        start: '',
        end: '',
        startTime: '00:00:00',
        endTime: '00:00:00',
        info: '',
        isLoop: false,
        day: null,
        schedule_num: 0
      },
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: '',
          center: 'title',
          right: 'today prev,next'
        },
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        locale: 'ko',
        events: [],
        eventSources: [{
          events: this.getFilteredEvents,
          color: 'red',
          textColor: 'white'
        }]
      }
    }
  },
  created() {
    const self = this;
    axios.get("http://localhost:8181/schedules")
      .then(function (res) {
        if (res.status === 200) {
          const reslist = res.data.list;

          reslist.forEach(function (item) {
            self.calendarOptions.events.push({
              schedule_num: item.schedule_num,
              title: item.title,
              start: item.start,
              end: item.end,
              display: 'block', // 시간 표시 설정

              // startEditable: true, // 시작 시간 편집 가능 설정
              // durationEditable: true, // 종료 시간 편집 가능 설정
            });
            alert(item.schedule_num)
          });
        } else {
          alert("에러코드: " + res.status);
        }
      })
  },

  methods: {
    //날짝클릭하면 입력 폼 나옴
    handleDateClick(arg) {
      this.showEventForm = true;
      this.newEvent = {
        title: '',
        start: dayjs(arg.date).format('YYYY-MM-DD'),
        end: '',
        startTime: '',
        endTime: '',
        info: '',
        isLoop: false,
        day: null
      };
    },
    //폼 취소
    cancel() {
      this.showEventForm = false;
    },
    handleEventClick(arg) {
      this.showEventForm = true;
      const event = arg.event;
      const self = this;
      self.$axios.get("http://localhost:8181/schedules/" + this.schedule_num)
        .then(response => {
          const scheduleData = response.data.dto;
          // 조회된 데이터를 폼에 할당
          self.selectedEvent = {
            id: scheduleData.id,
            title: event.title,
            start: event.start,
            end: event.end,
            startTime: '',
            endTime: '',
            info: '',
            isLoop: false,
            day: null
          };
        })
        .catch(error => {
          console.error(error);
        });
    },


    //입력
    addEvent() {
      const self = this;
      const formData = new FormData();
      if (self.newEvent.end == 0) {
        self.newEvent.end = self.newEvent.start;
      };
      formData.append('title', self.newEvent.title);
      formData.append('start', self.newEvent.start);
      formData.append('end', dayjs(self.newEvent.end).format('YYYY-MM-DD'));
      formData.append('startTime', self.newEvent.startTime);
      formData.append('endTime', self.newEvent.endTime);
      formData.append('info', self.newEvent.info);
      formData.append('isLoop', self.newEvent.isLoop);
      formData.append('day', self.newEvent.day);

      // 데이터 전송
      self.$axios.post("http://localhost:8181/schedules", formData)
        .then(response => {
          // 저장된 이벤트 변수에 저장
          const savedEvent = response.data.dto;

          // 캘린더에 저장된 이벤트 추가
          self.calendarOptions.events.push({
            title: savedEvent.title,
            start: savedEvent.start,
            end: dayjs(savedEvent.end).add(1, 'day').format('YYYY-MM-DD'),
            color: '',
            display: 'block', // 시간 표시 설정
            // startEditable: true, // 시작 시간 편집 가능 설정
            // durationEditable: true, // 종료 시간 편집 가능 설정
            rrule: {
              freq: '', // 주간 반복
              until: '', // 반복 종료 날짜
              byweekday: [savedEvent.day], // 월요일과 수요일 반복
            }
          });

          // 입력된 값들 초기화
          self.showEventForm = false;
          self.newEvent = {
            title: '',
            start: '',
            end: '',
            startTime: '',
            endTime: '',
            info: '',
            isLoop: false,
            day: null
          };
          self.$refs.fullCalendar.getApi().refetchEvents();
        })
        .catch(error => {
          console.error(error);
        });
    },

  }
}
</script>



<style>
:root {
    --fc-border-color: black;
    --fc-daygrid-event-dot-width: 5px;
}

.calendar_con {
    box-shadow: rgba(156, 205, 249, 0.952) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
    border-radius: 5px;
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
}

.event-form {
    background-color: #fff;
    padding: 20px;
    width: 34s0px;
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
</style>
