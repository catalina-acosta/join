import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { ContactInterface } from '../contacts/contact-interface';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../board/task.interface';


@Component({
  selector: 'app-add-task',
  standalone: true,
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
    status: "todo",
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
    this.newTask.priority = this.selectedPriority;
    if (ngform.valid) { // Only check if the form is valid
      this.firebase.addTaskToData(this.newTask);
      this.newTaskAdded = true;
      console.log(this.newTask); // Log only when the task is valid and added
    } 
  }

  clearFormular(ngform: NgForm) {
    ngform.reset(); 
    this.selectedPriority = 'medium';
  }

  assignContact() {
    this.checkboxActive = !this.checkboxActive;
  }
}
