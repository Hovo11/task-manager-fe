import type { Middleware } from '@/types/middleware'
import { useAuthStore } from '@/stores/auth'

export const admin: Middleware = ({ next }) => {
    const auth = useAuthStore()
    if (auth.user && auth.user.role !== 'admin') {
        return next('/403')
    }
    return next()
}
