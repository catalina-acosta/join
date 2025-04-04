/**
 * Represents a task in the application.
 */
export interface TaskInterface {
    /**
     * The unique identifier of the task.
     */
    id?: string;

    /**
     * The title of the task.
     */
    title: string;

    /**
     * A detailed description of the task.
     */
    description?: string;

    /**
     * The due date of the task in ISO format (e.g., YYYY-MM-DD).
     */
    date?: string;

    /**
     * The priority level of the task (e.g., "high", "medium", "low").
     */
    priority?: string;

    /**
     * An array of user IDs assigned to the task.
     */
    assignedToUserId?: string[];

    /**
     * The current status of the task (e.g., "todo", "inProgress", "done").
     */
    status?: string;

    /**
     * The category of the task (e.g., "Technical Task", "User Story").
     */
    category?: string;

    /**
     * A list of subtasks associated with the task.
     */
    subtasks?: {
        /**
         * The name or description of the subtask.
         */
        subtask: string;

        /**
         * Indicates whether the subtask is completed.
         */
        isCompleted: boolean;

        /**
         * Indicates whether the subtask is currently being edited.
         */
        isEditing?: boolean;
    }[];
}