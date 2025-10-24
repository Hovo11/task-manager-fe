export const API = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
    },
    TASKS: {
        BASE: '/tasks',
        STATUS: '/task/status',
        BY_ID: (id: string | number) => `/tasks/${id}`,
    },
}
