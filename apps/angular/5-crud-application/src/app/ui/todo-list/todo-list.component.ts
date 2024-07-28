import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Todo } from '../../model';
import { AppStore } from '../../store';
import { TodoItemComponent } from '../todo-item';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItemComponent, MatProgressSpinner],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  private readonly appStore = inject(AppStore);

  todos$$ = input.required<Todo[]>({ alias: 'todos' });
  readonly updateLoading$$ = toSignal(this.appStore.updateLoading$);
  readonly deleteLoading$$ = toSignal(this.appStore.deleteLoading$);
  readonly loading$$ = toSignal(this.appStore.loading$);

  currentTodo!: Todo['id'];

  update(todo: Todo): void {
    console.log(todo);
    this.currentTodo = todo.id;
    this.appStore.updateTodo(todo);
  }

  delete(id: Todo['id']): void {
    console.log(id);
    this.currentTodo = id;
    this.appStore.deleteTodo(id);
  }
}
