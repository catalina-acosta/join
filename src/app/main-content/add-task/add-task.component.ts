import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { ContactInterface } from '../contacts/contact-interface';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../board/task.interface';


@Component({
  selector: 'app-add-task',
  imports: [FormsModule, CommonModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  firebase = inject(FirebaseService);
  currentContact: ContactInterface | null = null;
  todaysDate: string = new Date().toISOString().split('T')[0];
  selectedPriority: string = 'medium';
  dropdownVisible = false;
  checkboxActive = false;
  selectedContacts = [];  //dass ich das unten anzeigen kann
  newTaskAdded: boolean = false;

  newTask: TaskInterface = {
    title: "",
    description: "",
    date: "",
    priority: "",
    assignedToUserId: [],
    status: "",
    category: "",
    subtasks: []
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
  hideDropdown() {
    this.dropdownVisible = false;
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

  submitForm(ngform: NgForm) {
    this.newTaskAdded = true;
    this.newTask.priority = this.selectedPriority;
    if (ngform.valid && ngform.submitted){
      this.addNewTask();
    }
  }

  //formular nich direkt nach dem absenden clearen, sondern erst nach der bestätigenden Nachricht, dass ich newTaskAdded
  //auf false setzen kann, sonst zeigt es überall this field is required

  addNewTask(){
    this.firebase.addTaskToData(this.newTask)
    console.log("zu der Database hinzugefügt");
    }

  clearFormular(ngform: NgForm) {
      ngform.reset(); 
      this.selectedPriority = 'medium';
  }

  assignContact() {
    this.checkboxActive = !this.checkboxActive;
  }
}
