import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/http.ts'
import type { LoginRequest, LoginResponse, User } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('access_token'))

    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const role = computed(() => user.value?.role ?? null)

    async function login(data: LoginRequest) {
        try {
            const res = await api.post<LoginResponse>('/auth/login', data)
            token.value = res.data.access_token
            user.value = res.data.user

            localStorage.setItem('access_token', res.data.access_token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
        } catch (err: any) {
            console.error('Login failed:', err)
            throw new Error(err.response?.data?.message || 'Invalid credentials')
        }
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
    }

    function restoreSession() {
        const storedToken = localStorage.getItem('access_token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
        }
    }

    return { user, token, role, isAuthenticated, login, logout, restoreSession }
})
