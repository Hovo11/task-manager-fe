<template>
  <div
      class="bg-white rounded-lg shadow p-4 mb-3 cursor-grab hover:shadow-lg transition flex flex-col"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-semibold text-gray-800 text-base" @click="$emit('click')">
        {{ task.title }}
      </h3>
      <div class="flex items-center space-x-2">
        <span
            :class="statusClasses"
            class="text-xs font-medium px-2 py-1 rounded-full"
        >
          {{ statusLabel }}
        </span>
        <button
            class="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 rounded"
            @click.stop="$emit('delete')"
        >
          Delete
        </button>
      </div>
    </div>

    <p class="text-sm text-gray-500 mb-2 line-clamp-3">{{ task.description }}</p>

    <div class="flex justify-between items-center text-xs text-gray-400 mt-auto">
      <span>{{ task.user?.name || 'Unknown' }}</span>
      <span>{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/tasks'
import {computed} from "vue";

const props = defineProps<{ task: Task }>()

const statusLabel = computed(() => {
  switch (props.task.status) {
    case 'todo': return 'To Do'
    case 'in_progress': return 'In Progress'
    case 'done': return 'Done'
    default: return props.task.status.toUpperCase()
  }
})

const statusClasses = computed(() => {
  switch (props.task.status) {
    case 'todo': return 'bg-blue-100 text-blue-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'done': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
})

const formattedTime = computed(() => {
  const start = props.task.start_time
      ? new Date(props.task.start_time).toLocaleDateString()
      : ''
  const end = props.task.end_time
      ? new Date(props.task.end_time).toLocaleDateString()
      : ''
  return start && end ? `${start} → ${end}` : start || end || ''
})
</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
