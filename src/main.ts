import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import router from './router'
import Toast, { type PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia'

import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

const pinia = createPinia()
app.use(Toast, options);
app.use(pinia)
app.use(router)

// Restore user session before mount
const authStore = useAuthStore(pinia)
authStore.restoreSession()

app.mount('#app')
