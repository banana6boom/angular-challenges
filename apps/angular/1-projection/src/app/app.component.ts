import { Component } from '@angular/core';
import {
  CityCardComponent,
  StudentCardComponent,
  TeacherCardComponent,
} from '@component';

@Component({
  selector: 'app-root',
  template: `
    <div class="grid grid-cols-3 gap-3">
      <app-teacher-card />
      <app-student-card />
      <app-city-card />
    </div>
  `,
  imports: [TeacherCardComponent, StudentCardComponent, CityCardComponent],
})
export class AppComponent {}
