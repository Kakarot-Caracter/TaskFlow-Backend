export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export declare class CreateTaskDto {
    title: string;
    description?: string;
    priority: Priority;
    dueDate: string;
    completed?: boolean;
    category: string;
}
