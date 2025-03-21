export interface TaskInterface {
    id?: string;
    title: string,
    description: string,
    date: string,
    priority: string,
    asignedToUserId?: string[],
    status: string,
    category: string,
    subtasks?: { subtask: string; isCompleted: boolean }[]
}