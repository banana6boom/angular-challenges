import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { TodoService } from '../data-access';
import { Todo } from '../model';

interface AppState {
  todos: Todo[];
  updateLoading?: boolean;
  deleteLoading?: boolean;
  loading?: boolean;
}

@Injectable()
export class AppStore extends ComponentStore<AppState> implements OnStoreInit {
  private readonly todoService = inject(TodoService);

  readonly todos$ = this.select((state) => state.todos);
  readonly updateLoading$ = this.select((state) => state.updateLoading);
  readonly deleteLoading$ = this.select((state) => state.deleteLoading);
  readonly loading$ = this.select((state) => state.loading);

  constructor() {
    super({ loading: false, todos: [] });
  }

  private readonly getTodos = this.effect<void>((source$) =>
    source$.pipe(
      exhaustMap(() => {
        this.patchState({ loading: true });

        return this.todoService.loadTodos().pipe(
          tapResponse({
            next: (todos: Todo[]) =>
              this.setState({ todos: todos.slice(0, 20) }),
            error: (error: HttpErrorResponse) => console.error(error?.error),
          }),
        );
      }),
    ),
  );

  ngrxOnStoreInit(): void {
    this.getTodos();
  }

  private readonly updateTodoUpdater = this.updater((state, todo: Todo) => ({
    todos: [...state.todos.map((t) => (t.id === todo.id ? { ...todo } : t))],
  }));

  private readonly deleteTodoUpdater = this.updater(
    (state, todoId: Todo['id']) => ({
      todos: [...state.todos.filter((t) => t.id !== todoId)],
    }),
  );

  readonly updateTodo = this.effect((todo$: Observable<Todo>) => {
    return todo$.pipe(
      switchMap((todo) => {
        this.patchState({ updateLoading: true });

        return this.todoService.updateTodo(todo).pipe(
          tap({
            next: (todo) => this.updateTodoUpdater(todo),
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(error?.error);
            return of(null);
          }),
        );
      }),
    );
  });

  readonly deleteTodo = this.effect((todoId$: Observable<Todo['id']>) => {
    return todoId$.pipe(
      switchMap((todoId) => {
        this.patchState({ deleteLoading: true });

        return this.todoService.deleteTodo(todoId).pipe(
          tap({
            next: () => this.deleteTodoUpdater(todoId),
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(error?.error);
            return of(null);
          }),
        );
      }),
    );
  });
}
