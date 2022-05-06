import { Todo } from "../dto/todo.dto";

export interface ITodoRepository {
  create(label: string): Promise<Todo>;
  list(): Promise<Todo[]>;
  delete(id: string): Promise<any>;
  find(id: string): Promise<Todo>;
  update(id: string, completed: boolean): Promise<Todo>;
}
