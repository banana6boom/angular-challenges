import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Todo } from '../../model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  loading = input<boolean>();
  deleteLoading = input<boolean>();
  updateEvent = output<Todo>();
  deleteEvent = output<Todo['id']>();
}
