import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './app/styles/main.css'

createApp(App).use(router).mount('#app')
