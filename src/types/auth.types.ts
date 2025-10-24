export type Role = 'admin' | 'user'

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    user: User
}

export interface User {
    id: number
    email: string
    role: Role
}
