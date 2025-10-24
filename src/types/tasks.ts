export type TaskStatusKeys = 'todo' | 'in_progress' | 'done'
export interface Task {
    id: number
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'done'
    userId: number
    start_time?: string
    end_time?: string
    socketId?: string | number
}
