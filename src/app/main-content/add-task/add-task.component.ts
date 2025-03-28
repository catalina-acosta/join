import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { ContactInterface } from '../contacts/contact-interface';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../board/task.interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})

export class AddTaskComponent {
  firebase = inject(FirebaseService);
  currentContact: ContactInterface | null = null;
  todaysDate: string = new Date().toISOString().split('T')[0];
  selectedPriority: string = 'medium';
  dropdownVisible = false;
  checkboxActive = false;
  selectedContacts: ContactInterface[] = []; //dass ich das unten anzeigen kann
  newTaskAdded: boolean = false;
  subtaskInputFocused: boolean = false;
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  subtaskInput: string = ''; // Model für das Eingabefeld
  formSubmitted: boolean = false;
  showAddButton: boolean = true;
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  selectedCategory: string = '';
  categoryDropdownVisible: boolean = false;
  categorySelected: boolean = false;
  categoryTouched: boolean = false;
  dateSet: boolean = false;

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

  //implement Router in constructor, which I need for leading to Board after added Task
  constructor(private router: Router) { }

  newClassForDate() {
    this.dateSet = true;
  }

  chooseCategory(choosenCategory: string) {
    this.selectedCategory = choosenCategory;
    this.categorySelected = true;
    this.categoryTouched = false;
  }

  setCategoryTouchedTrue() {
    this.categoryTouched = true;
  }

  toggleCategoryDropdown() {
    this.categoryDropdownVisible = !this.categoryDropdownVisible;
  }

  hideCategoryDropdown() {
    this.categoryDropdownVisible = false;
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
    this.newTask.category = this.selectedCategory;
    this.newTask.priority = this.selectedPriority;
    this.newTask.assignedToUserId = this.selectedContacts.map(contact => contact.id).filter((id): id is string => id !== undefined); // Add selected contacts' IDs to the task
    this.newTask.subtasks = this.subtasks.map(subtask => ({ subtask: subtask.name, isCompleted: false })); // Add subtasks to the task
    this.formSubmitted = true;
    if (ngform.valid && this.categorySelected) { // Only check if the form is valid
        this.showReport();  //shows confirmation about added task
        this.firebase.addTaskToData(this.newTask); // Save the task to the database
        this.newTaskAdded = true;
        this. clearFormular(ngform); // Reset the form after submission
        this.setBack(); //set back all flags and arrays to default
    }
}

//shows for 3 sec message "task added succesfully" and directs the user on the board
  showReport() {
    setTimeout(() => {
      this.newTaskAdded = false;
      this.router.navigate(['/board']);
    }, 2000);
  }

  //set back flags and get the formular ready for a new task
  setBack() {
    this.selectedContacts = []; // Clear selected contacts
        this.subtasks = []; // Clear subtasks
        this.categorySelected = false; //set category flag back
        this.selectedCategory = ''; //clear category
        this.formSubmitted = false; //form getting ready for the new submit
        this.categoryTouched = false; //category touched set back to default
        this.dateSet = false; //new class for date input field set back to default
  }

  //if newTaskAdded, comes a confirmation, after could it be false again
  dismissReport() {    
    this.newTaskAdded = false;
  }

  clearFormular(ngform: NgForm) {
    ngform.reset(); 
    this.selectedPriority = 'medium';
    this.categorySelected = false;
    this.selectedCategory = '';
    this.categoryTouched = false;
    this.selectedContacts = [];
  }

  assignContact(contact: ContactInterface) {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    if (index === -1) {
      this.selectedContacts.push(contact); // Add contact if not already selected
    } else {
      this.selectedContacts.splice(index, 1); // Remove contact if already selected
    }
  }

  isSelected(contact: any): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
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
