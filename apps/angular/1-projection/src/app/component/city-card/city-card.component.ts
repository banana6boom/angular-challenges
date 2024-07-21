import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CityStore, FakeHttpService, randomCity } from '@data-access';
import { CardComponent, CardDirective, ListItemComponent } from '@ui';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      class="bg-light-green"
      [items]="cities$$()"
      (addEvent)="addEvent()">
      <img src="assets/img/student.webp" width="200px" />

      <ng-template [cardData]="cities$$()" let-city>
        <app-list-item (deleteEvent)="deleteEvent(city.id)">
          {{ city.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, ListItemComponent, CardDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit {
  readonly cities$$ = toSignal(this.store.cities$, { initialValue: [] });

  constructor(
    private httpService: FakeHttpService,
    private store: CityStore,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.httpService.fetchCities$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cities) => this.store.addAll(cities));
  }

  addEvent(): void {
    this.store.addOne(randomCity());
  }

  deleteEvent(id: number): void {
    this.store.deleteOne(id);
  }
}
