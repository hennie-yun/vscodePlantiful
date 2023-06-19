import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
 


// Use calendar defaults (optional)

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
app.config.globalProperties.$axios = axios;
