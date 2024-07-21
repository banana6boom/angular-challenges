import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FakeHttpService, randTeacher, TeacherStore } from '@data-access';
import { CardComponent, CardDirective, ListItemComponent } from '@ui';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      class="bg-light-red"
      [items]="teachers$$()"
      (addEvent)="addEvent()">
      <img src="assets/img/teacher.png" width="200px" />

      <ng-template [cardData]="teachers$$()" let-teacher>
        <app-list-item (deleteEvent)="deleteEvent(teacher.id)">
          {{ teacher.firstName }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [CardComponent, ListItemComponent, CardDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCardComponent implements OnInit {
  readonly teachers$$ = toSignal(this.store.teachers$, { initialValue: [] });

  constructor(
    private http: FakeHttpService,
    private store: TeacherStore,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.http.fetchTeachers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((teachers) => this.store.addAll(teachers));
  }

  addEvent(): void {
    this.store.addOne(randTeacher());
  }

  deleteEvent(id: number): void {
    this.store.deleteOne(id);
  }
}
