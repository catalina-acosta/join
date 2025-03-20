import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  addTaskData = {
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    assignedTo: '',
    category: '',
    subtask: ''
  }

  onSubmit() {
    console.log ("form funktioniert");
  }
}
