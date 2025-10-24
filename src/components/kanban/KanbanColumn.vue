<template>
  <div class="flex flex-col bg-gray-100 rounded-lg p-4 min-w-[280px] w-full sm:w-1/3">
    <h2 class="font-bold text-lg text-gray-700 mb-3">{{ formattedStatus }}</h2>

    <draggable
        :list="props.tasks"
        :group="groupConfig"
        item-key="id"
        @change="onDragChange"
        @end="onDragEnd"
        class="flex-1"
        animation="200"
    >
      <template #item="{ element }">
        <TaskCard
            :task="element"
            @click="handleTaskClick(element)"
        />
      </template>

      <template #footer>
        <p v-if="!props.tasks.length" class="text-center text-gray-400 italic mt-2">No tasks</p>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import type {Task, TaskStatusKeys} from '@/types/tasks'
import {computed} from 'vue'

const props = defineProps<{
  status: TaskStatusKeys
  tasks: Task[]
}>()

const formattedStatus = computed(() => {
  switch (props.status) {
    case 'todo':
      return 'To do'
    case 'in_progress':
      return 'In progress'
    case 'done':
      return 'Done'
    default:
      return props.status.toUpperCase()
  }
})

const groupConfig = computed(() => ({
  name: 'kanban',
  pull: true,
  put: true
}))

const emit = defineEmits<{
  (e: 'update:tasks', payload: { status: TaskStatusKeys; tasks: Task[] }): void
  (e: 'task-click', task: Task): void
}>()

const onDragChange = (event: any) => {
  if (event.added || event.removed || event.moved) {
    emit('update:tasks', {
      status: props.status,
      tasks: [...props.tasks]
    })
  }
}

const onDragEnd = (event: any) => {
  console.log('Drag ended in column:', props.status)
  console.log('Current tasks:', props.tasks)
}

const handleTaskClick = (task: Task) => {
  emit('task-click', task)
}
</script>