import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo';
import { TodoListFilter } from '../enums/filterEnum';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  private readonly todoService = inject(TodoService);
  private readonly filter$ = new BehaviorSubject<TodoListFilter>(TodoListFilter.None);
  private readonly reload$ = new Subject<void>();

  // stream of todos that updates on init and after add/update
  todos$: Observable<Todo[]> = this.reload$.pipe(
    startWith(void 0),
    switchMap(() => this.todoService.getTodos()),
    shareReplay(1)
  );

  // capture errors and still keep template simple
  todosSafe$ = this.todos$.pipe(
    catchError(err => {
      console.warn('Failed to load todos: ', err)
      return of([]);
    })
  );

  // filter the todos with the todo observable
  visibleTodos$ = combineLatest([this.todosSafe$, this.filter$]).pipe(
    map(([todos, filter]) => {
      if (filter === TodoListFilter.ShowCheckedOnly) {
        return todos.filter(t => t.completed);
      }
      if (filter === TodoListFilter.ShowUncheckedOnly) {
        return todos.filter(t => !t.completed);
      }
      return todos;
    })
  );

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo)
      .pipe(tap(() => this.reload$.next()))
      .subscribe();
  }

  newTodo(title: string) {
    this.todoService.addTodo(title)
      .pipe(tap(() => this.reload$.next()))
      .subscribe();
  }

  toggleFilter(filter: TodoListFilter) {
    this.filter$.next(filter);
  }
}
