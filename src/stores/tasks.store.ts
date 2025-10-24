import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/http'
import { API } from '@/api/endpoints'
import type { ApiResponse } from '@/api/types'
import type { Task, TaskStatusKeys } from "@/types/tasks.ts";


export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    /** Fetch all tasks */
    async function fetchTasks(filters?: { search?: string; status?: TaskStatusKeys | '', userId?: number }) {
        loading.value = true
        try {
            const params: Record<string, string | number> = {}
            if (filters?.search) params.search = filters.search
            if (filters?.status) params.status = filters.status
            if (filters?.userId) params.userId = filters.userId

            const { data } = await api.get<Task[]>(API.TASKS.BASE, { params })

            if (Array.isArray(data)) {
                tasks.value = data
            } else if ('data' in data && Array.isArray((data as any).data)) {
                tasks.value = (data as any).data
            } else {
                tasks.value = []
                console.warn('Unexpected tasks response format:', data)
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch tasks'
            console.error('Fetch tasks error:', error.value, err)
        } finally {
            loading.value = false
        }
    }

    async function createTask(task: Partial<Task>) {
        try {
            const { data } = await api.post<ApiResponse<Task>>(API.TASKS.BASE, task)
            if (data && data.data) {
                tasks.value.push(data.data)
            }
        } catch (err: any) {
            error.value = err.response?.data?.message
            console.error( error.value)
        }
    }
    async function updateTask(id: number, task: Partial<Task>) {
        try {
            const { data } = await api.patch<ApiResponse<Task>>(`${API.TASKS.BASE}/${id}`, task)
            if (data?.data) {
                const index = tasks.value.findIndex((t) => t.id === id)
                if (index !== -1) tasks.value[index] = data.data
                return data.data
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update task'
            console.error(error.value)
        }
    }
    async function updateTaskStatus(id: number, status: 'todo' | 'in_progress' | 'done') {
        try {
            const { data } = await api.patch<ApiResponse<Task>>(`${API.TASKS.BASE}/${id}/status`, { status });
            if (data?.data) {
                const index = tasks.value.findIndex(t => t.id === id);
                if (index !== -1) tasks.value[index] = data.data;
                return data.data;
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update task status';
            console.error(error.value);
        }
    }

    async function deleteTask(taskId: number) {
        try {
            const { data } = await api.delete<ApiResponse<null>>(`/tasks/${taskId}`)

            if (data) {
                tasks.value = tasks.value.filter(t => t.id !== taskId)
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete task'
            console.error(error.value)
        }
    }

    return { tasks, loading, error, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask }
})
