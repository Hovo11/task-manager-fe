import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { options } from "@/plugins/toast.ts";

const app = createApp(App)

const pinia = createPinia()

app.use(Toast, options);
app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
authStore.restoreSession()

app.mount('#app')
