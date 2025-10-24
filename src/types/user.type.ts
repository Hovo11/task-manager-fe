export interface User {
    id: number
    email: string
    role: 'admin' | 'user'
    name?: string
    created_at: string
    updated_at: string
}