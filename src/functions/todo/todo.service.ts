import { ITodoRepository } from "./interface/todo-repository.interface";

export class TodoService {
  private todoRepository: ITodoRepository;
  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }
  find(id: string) {
    return this.todoRepository.find(id);
  }
  list() {
    return this.todoRepository.list();
  }
  newTodo(label: string) {
    return this.todoRepository.create(label);
  }
  update(id: string, completed?: boolean, label?: string) {
    return this.todoRepository.update(id, completed, label);
  }
  remove(id: string) {
    return this.todoRepository.delete(id);
  }
}
