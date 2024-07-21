import { Directive, Input } from '@angular/core';

export interface TemplateContext<T> {
  $implicit: T;
}

@Directive({
  selector: 'ng-template[cardData]',
  standalone: true,
})
export class CardDirective<T> {
  @Input({ required: true }) cardData!: T[];

  static ngTemplateContextGuard<T>(
    dir: CardDirective<T>,
    ctx: unknown,
  ): ctx is TemplateContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
