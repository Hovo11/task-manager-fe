<template>
  <nav class="bg-white shadow-md p-4 flex justify-between items-center">
    <div class="text-2xl font-bold text-blue-600">MyApp</div>
    <ul class="flex space-x-6">
      <li>
        <router-link to="/" class="text-gray-700 hover:text-blue-600 transition">Home</router-link>
      </li>
      <li>
        <router-link to="/login" class="text-gray-700 hover:text-blue-600 transition">Logout</router-link>
      </li>

    </ul>
  </nav>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import {getSocket} from "@/plugins/socket.ts";
import {useTasksStore} from "@/stores/tasks.store.ts";
import { useToast } from "vue-toastification";

const isLoggedIn = ref(false)
const router = useRouter()
const socket = getSocket()
const tasksStore = useTasksStore()
const { fetchTasks } = tasksStore

onMounted(() => {

  const toast = useToast();

  const showSuccess = () => {
    toast.success("Task created successfully!", {
      timeout: 3000,
      position: "top-right"
    });
  };
  socket.on('task-progress', (payload: { jobId: string, status: string, task?: any }) => {
    console.log('payload',payload)
    if (payload.status === 'finished') {
      fetchTasks()
      showSuccess()
    }

  })
})
function logout() {
  isLoggedIn.value = false
  router.push('/login')
}
</script>
