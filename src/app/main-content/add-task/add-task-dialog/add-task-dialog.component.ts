import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../board/task.interface';
import { Component, EventEmitter, Inject, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { ContactInterface } from '../../contacts/contact-interface';
import { Router } from '@angular/router';

/**
 * AddTaskDialogComponent is responsible for displaying a modal dialog
 * that allows users to add a new task. It includes options for task priority,
 * category selection, assignment to contacts, and the addition of subtasks.
 * The component communicates the dialog's status (open/close) through an output event.
 */
@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {
  firebase = inject(FirebaseService); // Injecting Firebase service for task-related data operations.
  currentContact: ContactInterface | null = null; // Tracks the currently selected contact for task assignment.
  todaysDate: string = new Date().toISOString().split('T')[0]; // Stores today's date for task creation.
  selectedPriority: string = 'medium'; // Stores the selected priority for the task.
  dropdownVisible = false; // Controls the visibility of the priority dropdown.
  checkboxActive = false; // Tracks if the checkbox for the task is active.
  selectedContacts: ContactInterface[] = []; // List of contacts selected to be assigned to the task.
  newTaskAdded: boolean = false; // Indicates if a new task was successfully added.
  subtaskInputFocused: boolean = false; // Tracks if the subtask input field is focused.
  subtasks: { name: string, isEditing: boolean }[] = []; // List of subtasks to be added to the task.
  subtaskInput: string = ''; // Input value for new subtasks.
  formSubmitted: boolean = false; // Indicates if the form has been submitted.
  showAddButton: boolean = true; // Controls the visibility of the "Add Task" button.
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null; // Manages timeout for hiding input icon.
  
  @Output() dialogStatusOutput = new EventEmitter<boolean>(); // Emits the status of the dialog (open/close).
  isDialogOpen: boolean = false; // Tracks whether the dialog is open.
  selectedCategory: string = ''; // Stores the selected category for the task.
  categoryDropdownVisible: boolean = false; // Controls the visibility of the category dropdown.
  categorySelected: boolean = false; // Indicates whether a category is selected.
  categoryTouched: boolean = false; // Indicates whether the category input was touched.
  dateSet: boolean = false; // Tracks whether a date has been set for the task.

  // Defines the structure of the new task.
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

  constructor(private router: Router) { }

  /**
   * Marks the task date as set.
   */
  newClassForDate() {
    this.dateSet = true;
  }

  /**
   * Sets the selected category for the task.
   * @param choosenCategory - The category to be selected.
   */
  chooseCategory(choosenCategory: string) {
    this.selectedCategory = choosenCategory;
    this.categorySelected = true;
    this.categoryTouched = false;
  }

  /**
   * Sets the category as touched (used for validation).
   */
  setCategoryTouchedTrue() {
    this.categoryTouched = true;
  }

  /**
   * Toggles the visibility of the category dropdown.
   */
  toggleCategoryDropdown() {
    this.categoryDropdownVisible = !this.categoryDropdownVisible;
  }

  /**
   * Hides the category dropdown.
   */
  hideCategoryDropdown() {
    this.categoryDropdownVisible = false;
  }

  /**
   * Emits the current status (open/close) of the dialog.
   */
  emitDialogStatus() {
    this.dialogStatusOutput.emit(this.isDialogOpen);
  }

  /**
   * Toggles the visibility of the priority dropdown.
   */
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  /**
   * Hides the priority dropdown.
   */
  hideDropdown() {
    this.dropdownVisible = false;
  }

  /**
   * Selects a priority for the task.
   * @param priority - The selected priority.
   */
  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

  /**
   * Submits the task form and adds the task to the Firebase database if valid.
   * @param ngform - The form instance.
   */
  submitForm(ngform: NgForm) {
    this.newTask.category = this.selectedCategory;
    this.newTask.priority = this.selectedPriority;
    this.newTask.assignedToUserId = this.selectedContacts.map(contact => contact.id).filter((id): id is string => id !== undefined);
    this.newTask.subtasks = this.subtasks.map(subtask => ({ subtask: subtask.name, isCompleted: false }));
    this.formSubmitted = true;
    if (ngform.valid && this.categorySelected) {
      this.showReport();
      this.firebase.addTaskToData(this.newTask);
      this.newTaskAdded = true;
      this.clearFormular(ngform);
      this.setBack();
    }
  }

  /**
   * Displays a success message and navigates to the board after 2 seconds.
   */
  showReport() {
    setTimeout(() => {
      this.newTaskAdded = false;
      this.router.navigate(['/board']);
    }, 2000);
  }

  /**
   * Resets the form and internal state after a task is added.
   */
  setBack() {
    this.selectedContacts = [];
    this.subtasks = [];
    this.subtaskInput = '';
    this.categorySelected = false;
    this.selectedCategory = '';
    this.formSubmitted = false;
    this.categoryTouched = false;
    this.dateSet = false;
  }

  /**
   * Dismisses the success message after task submission.
   */
  dismissReport() {
    this.newTaskAdded = false;
  }

  /**
   * Clears the form inputs and resets component state.
   * @param ngform - The form instance.
   */
  clearFormular(ngform: NgForm) {
    ngform.reset();
    this.selectedPriority = 'medium';
    this.emitDialogStatus();
    this.categorySelected = false;
    this.selectedCategory = '';
    this.categoryTouched = false;
    this.selectedContacts = [];
    this.subtasks = [];
    this.clearSubtaskInput();
  }

  /**
   * Assigns or removes a contact from the selected contacts list.
   * @param contact - The contact to be assigned or removed.
   */
  assignContact(contact: ContactInterface) {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    if (index === -1) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts.splice(index, 1);
    }
  }

  /**
   * Checks if a contact is selected.
   * @param contact - The contact to check.
   * @returns true if the contact is selected, false otherwise.
   */
  isSelected(contact: any): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
  }

  /**
   * Adds a new subtask to the task.
   */
  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push({ name: this.subtaskInput.trim(), isEditing: false });
      this.subtaskInput = '';
    }
  }

  /**
   * Removes a subtask from the list.
   * @param index - The index of the subtask to remove.
   */
  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  /**
   * Enables editing of a subtask.
   * @param index - The index of the subtask to edit.
   */
  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
    setTimeout(() => {
      const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  }

  /**
   * Saves the changes made to a subtask.
   * @param index - The index of the subtask to save.
   */
  saveSubtask(index: number) {
    const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
    if (inputElement) {
      this.subtasks[index].name = inputElement.value;
    }
    this.subtasks[index].isEditing = false;
  }

  /**
   * Handles the key up event on subtask input. Saves the subtask if the "Enter" key is pressed.
   * @param event - The keyboard event.
   * @param index - The index of the subtask.
   */
  handleKeyUp(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.saveSubtask(index);
    }
  }

  /**
   * Clears the subtask input field.
   */
  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskInputFocused = false;
  }

  /**
   * Focuses the subtask input field.
   */
  focusSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.focus();
    }
  }

  /**
   * Hides the input icon after a delay when the subtask input field loses focus.
   */
  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 1000 / 2);
  }

  /**
   * Shows the input icon when the subtask input field gains focus.
   */
  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
  }
}
