import type { Middleware } from '@/types/middleware'
import { useAuthStore } from '@/stores/auth'

export const user: Middleware = ({ next }) => {
    const auth = useAuthStore()
    if (auth.user && auth.user.role !== 'user') {

        return next('/403')
    }
    return next()
}
