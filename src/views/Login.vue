<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-2xl font-semibold text-gray-800">Sign In</h1>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="Enter your email"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
              id="password"
              type="password"
              v-model="form.password"
              placeholder="Enter your password"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <button
            type="submit"
            class="w-full rounded-md bg-emerald-500 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import type { LoginRequest } from '@/types/auth.types'

const router = useRouter()
const auth = useAuthStore()

const form = reactive<LoginRequest>({
  email: '',
  password: '',
})

const onSubmit = async () => {
  try {
    if (!form.email || !form.password) {
      alert('Please enter email and password')
      return
    }
    await auth.login(form)
    router.push(auth.role === 'admin' ? '/' : '/profile')
  } catch (err: any) {
    alert(err.message || 'Login failed')
  }
}
</script>
