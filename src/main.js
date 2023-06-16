import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
 
// createApp(App).mount('#app')
createApp(App).use(store).use(router).mount('#app')
