import { Contact } from "./contact";
import { Subtask } from "./subtask";

export interface Task {
    id: string;
    category: string;
    title: string;
    description: string;
    dueDate: string;
    prio: string;
    assignedTo: Contact[];
    subtasks: Subtask[];
    status: string;
}
