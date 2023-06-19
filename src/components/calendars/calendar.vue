<template>
  <div class="container" style="width: 60%;">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    <div v-if="showEventForm" class="head-event-form">
      <div class="event-form">
        <div class="form-row">
          <label for="event-title">일정 제목:</label>
          <input id="event-title" type="text" v-model="newEvent.title" />
        </div>
        <div class="form-row">
          <label for="start-date">시작 날짜:</label>
          <input id="start-date" type="date" v-model="newEvent.startDate" />
        </div>
        <div class="form-row">
          <label for="end-date">끝 날짜:</label>
          <input id="end-date" type="date" v-model="newEvent.endDate" />
        </div>
        <div class="form-row">
          <label for="start-time">시작 시간:</label>
          <input id="start-time" type="time" v-model="newEvent.startTime" />
        </div>
        <div class="form-row">
          <label for="end-time">끝 시간:</label>
          <input id="end-time" type="time" v-model="newEvent.endTime" />
        </div>
        <div class="form-row">
          <label for="reminder">알림 설정:</label>
          <select id="reminder" v-model="newEvent.reminder">
            <option value="1">1시간 전</option>
            <option value="0.5">30분 전</option>
            <option value="custom">사용자 설정</option>
          </select>
        </div>
        <div class="form-row" v-if="newEvent.reminder === 'custom'">
          <label for="custom-reminder">사용자 설정 알림:</label>
          <input id="custom-reminder" type="time" v-model="newEvent.customReminder" />
        </div>
        <div class="form-row form-buttons">
          <button @click="addEvent">일정 추가</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      showEventForm: false,
      newEvent: {
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        reminder: '',
        customReminder: ''
      },

      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        start: 'title',
        center: '',
        end: 'today prev,next',
        events: [
          { title: '저녁약속', date: '2023-06-16' },
          { title: '월요일', date: '2023-06-19' },
          { title: '영우 생일', date: '2023-06-24', id: '축하합니다' },
          { title: '일요일부터', start: '2023-06-25', end: '2023-06-28', color: 'green', id: 'PK' },
          { groupId: '999', title: 'Repeating Event', start: '2023-06-09T16:00:00', end: '2023-06-09T19:00', color: 'red' },
          { title: 'Click for naver', url: 'http://www.naver.com', start: '2023-06-01', color: 'orange' },
          { groupId: '999', title: '상담 예약(링크클릭)', start: '2023-06-09T16:00:00', url: 'http://www.daum.net' },
        ]
      }
    }
  },
  methods: {
    handleDateClick: function (arg) {
      this.showEventForm = true;
      this.newEvent = {
        title: '',
        startDate: arg.dateStr,
        endDate: '',
        startTime: '',
        endTime: '',
        reminder: '',
        customReminder: ''
      };

    },
    handleEventClick: function (info) {
      alert('date click! ' + info.event.id.title);
    },
    addEvent: function () {
      const newEvent = {
        title: this.newEvent.title,
        start: this.combineDateTime(this.newEvent.startDate, this.newEvent.startTime),
        end: this.combineDateTime(this.newEvent.endDate, this.newEvent.endTime),
        reminder: this.newEvent.reminder,
        customReminder: this.newEvent.customReminder
      };
      this.calendarOptions.events.push(newEvent);
      this.showEventForm = false;
      this.newEvent = {
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        reminder: '',
        customReminder: ''

      };
      console.log(newEvent.start);
      console.log(newEvent.end);
    },
    combineDateTime: function (date, time) {
      const combined = new Date(date);
      const timeParts = time.split(':');
      combined.setHours(parseInt(timeParts[0], 10));
      combined.setMinutes(parseInt(timeParts[1], 10));
      return combined;
    }
  }
}
</script>

<style>
:root {
  --fc-border-color: black;
  --fc-daygrid-event-dot-width: 5px;
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
  width: 300px;
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
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
