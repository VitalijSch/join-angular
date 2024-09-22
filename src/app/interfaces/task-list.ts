import { Task } from "./task";

export interface TaskList {
    id: string,
    toDo: Task[],
    inProgress: Task[],
    awaitFeedback: Task[],
    done: Task[]
}
