import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
// Use calendar defaults (optional)


loadFonts()

const app = createApp(App) 
app.use(store)
app.use(router)
app.use(vuetify)
app.config.globalProperties.$axios = axios; 
app.mount('#app')
app.use(BootstrapVue3)