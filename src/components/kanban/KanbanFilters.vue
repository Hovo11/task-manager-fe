<template>
  <div class="flex flex-col sm:flex-row gap-3 mb-6">
    <input
        type="text"
        v-model="search"
        placeholder="Search tasks..."
        class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />

    <select
        v-model="selectedStatus"
        class="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 min-w-[150px]"
    >
      <option value="">All Statuses</option>
      <option v-for="s in statuses" :key="s.key" :value="s.key">
        {{ s.label }}
      </option>
    </select>

    <select
        v-model="selectedUserId"
        v-if="!loading"
        class="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 min-w-[150px]"
    >
      <option value="">All Users</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name || user.email }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskStatusKeys, FilterChangePayload } from '@/types/tasks'
import { useUsersStore } from '@/stores/users.store'

const usersStore = useUsersStore()
const { users, loading } = storeToRefs(usersStore)
const { fetchUsers } = usersStore



const emit = defineEmits<{
  (e: 'filter-change', filters: FilterChangePayload): void
}>()

const search = ref('')
const selectedStatus = ref<TaskStatusKeys | ''>('')
const selectedUserId = ref<number | null>(null)

const statuses = [
  { label: 'Todo', key: 'todo' },
  { label: 'In Progress', key: 'in_progress' },
  { label: 'Done', key: 'done' },
]

let timeout: ReturnType<typeof setTimeout>

watch([search, selectedStatus, selectedUserId], ([newSearch, newStatus, newUserId]) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('filter-change', {
      search: newSearch,
      status: newStatus,
      userId: newUserId
    })
  }, 300)
})

onMounted(async () => {
  await fetchUsers()
})
</script>
