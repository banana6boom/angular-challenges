import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Todo } from './model';
import { AppStore } from './store';
import { TodoListComponent } from './ui';

@Component({
  standalone: true,
  imports: [AsyncPipe, TodoListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(AppStore)],
})
export class AppComponent {
  private readonly appStore = inject(AppStore);
  readonly todos$ = this.appStore.todos$;

  update(todo: Todo) {
    // this.http
    //   .put<Todo>(
    //     `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
    //     JSON.stringify({
    //       todo: todo.id,
    //       title: randText(),
    //       body: todo.body,
    //       userId: todo.userId,
    //     }),
    //     {
    //       headers: {
    //         'Content-type': 'application/json; charset=UTF-8',
    //       },
    //     },
    //   )
    //   .subscribe((todoUpdated: Todo) => {
    //     this.todos[todoUpdated.id - 1] = todoUpdated;
    //   });
  }
}
