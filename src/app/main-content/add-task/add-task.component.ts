import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
  selector: 'app-add-task',
  imports: [FormsModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  todaysDate: string = new Date().toISOString().split('T')[0];
  selectedPriority: string = '';

  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

  submitPrio() {
    console.log("Ausgewählte Priorität:", this.selectedPriority);
  }
}
