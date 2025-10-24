import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import Login from '@/views/Login.vue'
import Forbidden from '@/views/Forbidden.vue'
import { auth } from '@/middleware/auth'
import { user } from '@/middleware/user'
import Dashboard from "@/views/Admin/Dashboard.vue"
import {admin} from "@/middleware/admin.ts";

declare module 'vue-router' {
    interface RouteMeta {
        middleware?: Array<(context: MiddlewareContext) => void | Promise<void>>
    }
}

interface MiddlewareContext {
    to: RouteLocationNormalized
    from: RouteLocationNormalized
    next: NavigationGuardNext
    router: typeof router
}

const routes: RouteRecordRaw[] = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/403', name: 'Forbidden', component: Forbidden },

    {
        path: '/admin',
        component: () => import('@/views/layouts/AdminLayout.vue'),
        children: [
            { path: '/', name: 'AdminDashboard', component: Dashboard },
        ],
        meta: { middleware: [auth, admin] },
    },

    {
        path: '/user',
        component: () => import('@/views/layouts/UserLayout.vue'),
        children: [
            { path: '/profile', name: 'UserProfile', component: () => import('@/views/User/Profile.vue') },
        ],
        meta: { middleware: [auth, user] },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const middlewares = to.meta.middleware as Array<(context: {
        next: (param?: Parameters<NavigationGuardNext>[0]) => (void);
        router: typeof router;
        from: RouteLocationNormalized;
        to: RouteLocationNormalized
    }) => void | Promise<void>>

    if (!middlewares || middlewares.length === 0) {
        return next()
    }

    const context: MiddlewareContext = {
        to,
        from,
        next,
        router
    }

    const runMiddleware = async (index: number): Promise<void> => {
        if (index >= middlewares.length) {
            return next()
        }

        const middleware = middlewares[index]

        try {
            await middleware({
                ...context,
                next: (param?: Parameters<NavigationGuardNext>[0]) => {
                    if (param !== undefined) {
                        return next(param)
                    }
                    return runMiddleware(index + 1)
                },
            })
        } catch (error) {
            console.error('Middleware error:', error)
            next('/403')
        }
    }

    runMiddleware(0)
})

export default router