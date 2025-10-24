import type { Middleware } from '@/types/middleware'
import { useAuthStore } from '@/stores/auth'

export const auth: Middleware = ({ next }) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
        return next('/login')
    }
    return next()
}
