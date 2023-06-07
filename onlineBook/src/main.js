import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import qs from 'qs'
import {
    Button,
    Toast,
 } from 'vant'
import 'vant/lib/index.css'
import { createPinia } from 'pinia'
const app= createApp(App)
const pinia=createPinia()
app
    .use(pinia)
    .use(Toast)
    .use(Button)
    .use(qs)
    .use(router)
    .mount('#app')
