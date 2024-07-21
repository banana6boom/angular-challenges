import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FakeHttpService, randStudent, StudentStore } from '@data-access';
import { CardComponent, CardDirective, ListItemComponent } from '@ui';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      class="bg-light-green"
      [items]="students$$()"
      (addEvent)="addEvent()">
      <img src="assets/img/student.webp" width="200px" />

      <ng-template [cardData]="students$$()" let-student>
        <app-list-item (deleteEvent)="deleteEvent(student.id)">
          {{ student.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      .bg-light-green {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [CardComponent, ListItemComponent, CardDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent implements OnInit {
  readonly students$$ = toSignal(this.store.students$, { initialValue: [] });

  constructor(
    private http: FakeHttpService,
    private store: StudentStore,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.http.fetchStudents$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((students) => this.store.addAll(students));
  }

  addEvent(): void {
    this.store.addOne(randStudent());
  }

  deleteEvent(id: number): void {
    this.store.deleteOne(id);
  }
}
