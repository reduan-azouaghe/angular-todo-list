import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${environment.apiUrl}`);
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${environment.apiUrl}/${id}`);
  }

  addTodo(title: string): Observable<Todo> {
    return this.http.post<Todo>(`${environment.apiUrl}`, { 'title': title });
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${environment.apiUrl}/${todo.id}`, todo);
  }

  deleteTodoById(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${id}`);
  }
}
