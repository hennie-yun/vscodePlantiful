<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> | 
    <router-link to="/SubscribeBoardList">구독</router-link>
  </nav>
  <router-view/>
                  <div class="container" style="width: 60%;">
                      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
                  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,

        start: 'title', // will normally be on the left. if RTL, will be on the right
        center: '',
        end: 'today prev,next', // will normally be on the right. if RTL, will be on the left

        events: [
          { title: '저녁약속', date: '2023-06-16' },
          { title: '월요일', date: '2023-06-19' },
          { title: '영우 생일', date: '2023-06-24' },
          { title: '일요일부터', start: '2023-06-25', end: '2023-06-28', color: 'green', id: 'PK' },
          { groupId: '999', title: 'Repeating Event', start: '2023-06-09T16:00:00', end: '2023-06-09T19:00', color: 'red' },
          { title: 'Click for naver', url: 'http://www.naver.com', start: '2023-06-01', color: 'orange' }
        ]
      }
    }
  },
  methods: {
    handleDateClick: function (arg) {
      alert('date click! ' + arg.dateStr + arg.name)
    },
    handleEventClick: function (info) {
      alert('date click! ' + info.event.id.title)
    },

  }
}
</script>

<style>
:root {
    --fc-border-color: black;
    --fc-daygrid-event-dot-width: 5px;
}
</style>
