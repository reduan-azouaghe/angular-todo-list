import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { TodoListFilter } from '../enums/filterEnum';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css'],
})
export class TodoCreateComponent {
  private readonly todoService = inject(TodoService);

  @Output() newTodo = new EventEmitter<string>();
  @Output() toggleFilter = new EventEmitter<TodoListFilter>();

  todo = '';
  filter: TodoListFilter = TodoListFilter.None;

  submit(): void {
    if (this.todo) {
      this.newTodo.emit(this.todo);
    }
  }

  onToggleFilter(): void {
    if (this.filter == TodoListFilter.None) {
      this.filter = TodoListFilter.ShowCheckedOnly
    } else if (this.filter == TodoListFilter.ShowCheckedOnly) {
      this.filter = TodoListFilter.ShowUncheckedOnly
    } else if (this.filter == TodoListFilter.ShowUncheckedOnly) {
      this.filter = TodoListFilter.None
    }

    this.toggleFilter.emit(this.filter);
  }
}
