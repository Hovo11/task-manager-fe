<template>
  <div>
    <KanbanFilters @filter-change="applyFilters" />
    <button @click="openCreateModal" class="px-4 mb-4 py-2 bg-emerald-500 text-white rounded">
      Create Task
    </button>
    <TaskModal
        v-if="editingTask || creatingTask"
        :task="editingTask || undefined"
        @close="editingTask = null; creatingTask = false"
        @save="saveTask"
    />
    <TaskDeleteModal
        :show="showDeleteModal"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
    <div v-if="tasksStore.loading" class="text-center py-10 text-gray-500">
      Loading tasks...
    </div>

    <div v-else-if="tasksStore.error" class="text-center text-red-500">
      {{ tasksStore.error }}
    </div>

    <div v-else class="flex gap-4 overflow-x-auto">
      <KanbanColumn
          v-for="s in statuses"
          :key="s"
          :status="s"
          :tasks="tasks.filter(t => t.status === s)"
          @update:tasks="handleTaskUpdate"
          @task-click="openEditModal"
          @task-delete="openDeleteModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks.store'
import type { Task, TaskStatusKeys } from '@/types/tasks'
import KanbanColumn from './KanbanColumn.vue'
import KanbanFilters from './KanbanFilters.vue'
import TaskModal from "@/components/TaskModal.vue";
import TaskDeleteModal from "@/components/TaskDeleteModal.vue";
import {useUsersStore} from "@/stores/users.store.ts";
import {getSocket} from "@/plugins/socket.ts";

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const { fetchTasks } = tasksStore
const socket = getSocket()

const usersStore = useUsersStore()
const { fetchUsers } = usersStore
const taskToDelete = ref<Task | null>(null)
const showDeleteModal = ref(false)

const statuses: TaskStatusKeys[] = ['todo', 'in_progress', 'done']

const filters = ref<{ search: string; status: TaskStatusKeys | '' }>({
  search: '',
  status: '',
})

onMounted(async () => {
  await fetchTasks()
  await fetchUsers()
})

const applyFilters = async (newFilters: typeof filters.value) => {
  filters.value = newFilters
  await fetchTasks({ search: newFilters.search, status: newFilters.status, userId: newFilters.userId })
}
const getTasksAfterUpdate = async () => {
  await fetchTasks({...filters})
}

const handleTaskUpdate = async ({
                                  status,
                                  tasks: newTasks,
                                }: {
  status: TaskStatusKeys;
  tasks: Task[];
}) => {
  for (const task of newTasks) {
    const existing = tasks.value.find(x => x.id === task.id);
    if (existing && existing.status !== status) {
      existing.status = status;
      await tasksStore.updateTaskStatus(task.id, status);
    }
  }
};

const editingTask = ref<Task | null>(null)

const creatingTask = ref(false)

const openEditModal = async (task: Task) => {
  editingTask.value = { ...task }
}
const openDeleteModal = async (task: Task) => {
  taskToDelete.value = { ...task }
  showDeleteModal.value = true
}
const openCreateModal = async () => {
  editingTask.value = null
  creatingTask.value = true
}

const saveTask = async (task: Task) => {
  if (editingTask.value) {
    const payload: Partial<Task> = {
      title: task.title,
      id: task.id,
      description: task.description,
      status: task.status,
      userId: task.userId,
      socketId: socket.id,
      start_time: task.start_time,
      end_time: task.end_time,
    }
    const updated = await tasksStore.updateTask(task.id, payload)
    await getTasksAfterUpdate()
    if (updated) {
      console.log('Task updated:', updated)
    }
  } else {
    const payload = {
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      start_time: task.start_time,
      end_time: task.end_time,
      socketId: socket.id,
    }
     await tasksStore.createTask(payload)

  }

  editingTask.value = null
  creatingTask.value = false
}

const confirmDelete = async () => {
  if (taskToDelete.value) {
     await tasksStore.deleteTask(taskToDelete.value.id)
    taskToDelete.value = null
  }
  showDeleteModal.value = false
}

const cancelDelete = () => {
  taskToDelete.value = null
  showDeleteModal.value = false
}

</script>