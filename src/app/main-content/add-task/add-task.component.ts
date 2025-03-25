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
  styleUrl: './add-task.component.scss',
  standalone: true
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
  subtaskInputFocused: boolean = false;
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  subtaskInput: string = ''; // Model für das Eingabefeld
  formSubmitted: boolean = false;
  showAddButton: boolean = true;
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;

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
    if (ngform.valid && ngform.submitted){
      this.newTaskAdded = true;
      this.newTask.priority = this.selectedPriority;
      console.log(this.newTask);
      console.log(this.todaysDate);
      this.addNewTask();
    }
    else {
      console.log ("invalid");
    }
  }

  //formular nich direkt nach dem absenden clearen, sondern erst nach der bestätigenden Nachricht, dass ich newTaskAdded
  //auf false setzen kann, sonst zeigt es überall this field is required

  addNewTask(){
    this.firebase.addTaskToData(this.newTask)
    console.log("zu der Database hinzugefügt");
    }

  clearFormular(ngform: NgForm) {
    this.newTask = {
      title: "",
      description: "",
      date: "",
      priority: "",
      assignedToUserId: [],
      status: "",
      category: "",
      subtasks: []
    };
      this.selectedPriority = 'medium';

  }

  assignContact() {
    this.checkboxActive = !this.checkboxActive;
  }

  submitPrio() {
    console.log("Ausgewählte Priorität:", this.selectedPriority);
  }


  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push({ name: this.subtaskInput.trim(), isEditing: false }); // Subtask zur Liste hinzufügen
      this.subtaskInput = ''; // Eingabefeld leeren
    }
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1); // Subtask entfernen
  }

  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
    setTimeout(() => {
      const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  }

  saveSubtask(index: number) {
    const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
    if (inputElement) {
      this.subtasks[index].name = inputElement.value;
    }
    this.subtasks[index].isEditing = false;
  }
  handleKeyUp(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.saveSubtask(index);
    }
  }

  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskInputFocused = false;
  }

  focusSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.focus();
    }
  }

  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 1000/2); // 2 seconds delay
  }

  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
}

}
