import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'

export interface MiddlewareContext {
    to: RouteLocationNormalized
    from: RouteLocationNormalized
    next: NavigationGuardNext
    router: Router
}

export type Middleware = (context: MiddlewareContext) => void
