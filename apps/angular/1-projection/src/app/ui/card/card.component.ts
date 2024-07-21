import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CardDirective } from './card.directive';

@Component({
  selector: 'app-card',
  template: `
    <ng-content select="img" />

    <section>
      @for (item of items; track item.id) {
        <ng-template
          *ngTemplateOutlet="template; context: { $implicit: item }" />
      }
    </section>

    <button
      class="rounded-sm border border-blue-500 bg-blue-300 p-2"
      (click)="addEvent.emit()">
      Add
    </button>
  `,
  host: {
    class: 'border-2 border-black rounded-md p-4 w-fit flex flex-col gap-3',
  },
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T extends { id: number }> {
  @Input() items: T[] = [];
  @Output() addEvent = new EventEmitter<void>();

  @ContentChild(CardDirective, { read: TemplateRef })
  template!: TemplateRef<unknown>;
}
