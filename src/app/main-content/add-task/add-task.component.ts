import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalenderComponent } from './calender/calender.component';


@Component({
  selector: 'app-add-task',
  imports: [FormsModule, CalenderComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

}
