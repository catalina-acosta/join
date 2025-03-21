import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalenderComponent } from './calender/calender.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
  selector: 'app-add-task',
  imports: [FormsModule, CalenderComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  todaysDate: string = new Date().toISOString().split('T')[0];
}
