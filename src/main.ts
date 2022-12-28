import { createApp } from 'vue'
import App from './App.vue'
import store from './store'


import 'currency-flags/dist/currency-flags.css'
import './assets/main.css'

createApp(App).use(store).mount('#app')
