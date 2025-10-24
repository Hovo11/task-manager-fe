<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-lg relative">

      <!-- Global loading overlay -->
      <div
          v-if="loading"
          class="absolute inset-0 bg-white/70 flex items-center justify-center z-50"
      >
        <span class="text-gray-500">Loading...</span>
      </div>

      <h2 class="text-xl font-semibold mb-4">
        {{ isEditMode ? 'Edit Task' : 'Create Task' }}
      </h2>

      <div class="space-y-4" v-if="!loading">
        <input
            v-model="localTask.title"
            placeholder="Title"
            class="w-full border px-3 py-2 rounded"
        />
        <textarea
            v-model="localTask.description"
            placeholder="Description"
            class="w-full border px-3 py-2 rounded"
        />
        <select
            id="user"
            v-model="localTask.userId"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="0" disabled>Select a user</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name || user.email }}
          </option>
        </select>

        <select v-model="localTask.status" class="w-full border px-3 py-2 rounded">
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <input
            type="datetime-local"
            v-model="formattedStartTime"
            class="w-full border px-3 py-2 rounded"
        />
        <input
            type="datetime-local"
            v-model="formattedEndTime"
            class="w-full border px-3 py-2 rounded"
        />
      </div>

      <div class="mt-4 flex justify-end gap-2" v-if="!loading">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button @click="saveTask" class="px-4 py-2 bg-emerald-500 text-white rounded">
          {{ isEditMode ? 'Save' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Task } from '@/types/tasks'
import { useUsersStore } from '@/stores/users.store.ts'

const usersStore = useUsersStore()
const { users, loading } = usersStore

const props = defineProps<{
  task?: Task
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', task: Task): void
}>()

const emptyTask: Task = {
  id: 0,
  title: '',
  description: '',
  status: 'todo',
  userId: 0,
  start_time: '',
  end_time: ''
}

const localTask = ref<Task>({ ...emptyTask })

watch(
    () => props.task,
    (newTask) => {
      if (newTask) {
        localTask.value = { ...newTask }
      } else {
        localTask.value = { ...emptyTask }
      }
    },
    { immediate: true, deep: true }
)

const isEditMode = computed(() => !!props.task && props.task.id !== 0)

function formatDateTimeForInput(date?: string | Date) {
  if (!date) return ''
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

const formattedStartTime = computed({
  get: () => formatDateTimeForInput(localTask.value.start_time),
  set: val => localTask.value.start_time = val
})

const formattedEndTime = computed({
  get: () => formatDateTimeForInput(localTask.value.end_time),
  set: val => localTask.value.end_time = val
})

const saveTask = () => {
  if (!localTask.value.title.trim()) {
    alert('Title is required')
    return
  }
  emit('save', { ...localTask.value })
}
</script>
