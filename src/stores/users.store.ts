// stores/users.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/http'
import type { User } from '@/types/user.type'

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Fetch all users
    async function fetchUsers() {
        loading.value = true
        try {
            const { data } = await api.get<User[]>('/users')
            users.value = data.map(u => ({
                id: u.id,
                email: u.email,
                role: u.role,
                name: u.name,
                created_at: u.created_at,
                updated_at: u.updated_at
            }))
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch users'
            console.error(error.value)
        } finally {
            loading.value = false
        }
    }

    return { users, loading, error, fetchUsers }
})
