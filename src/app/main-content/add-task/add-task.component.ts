import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { ContactInterface } from '../contacts/contact-interface';
import { CommonModule } from '@angular/common';
import { TaskInterface } from '../board/task.interface';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})

export class AddTaskComponent {
  // firebase = inject(FirebaseService);
  // currentContact: ContactInterface | null = null;
  // todaysDate: string = new Date().toISOString().split('T')[0];
  // selectedPriority: string = 'medium';
  // dropdownVisible: boolean = false;
  // checkboxActive: boolean = false;
  // selectedContacts: ContactInterface[] = []; //dass ich das unten anzeigen kann
  // newTaskAdded: boolean = false;
  // subtaskInputFocused: boolean = false;
  // subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  // subtaskInput: string = ''; // Model für das Eingabefeld
  // formSubmitted: boolean = false;
  // showAddButton: boolean = true;
  // hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  // selectedCategory: string = '';
  // categoryDropdownVisible: boolean = false;
  // categorySelected: boolean = false;
  // categoryTouched: boolean = false;
  // dateSet: boolean = false;
  // newTask: TaskInterface = {
  //   title: "",
  //   description: "",
  //   date: "",
  //   priority: "",
  //   assignedToUserId: [],
  //   status: "todo",
  //   category: "",
  //   subtasks: []
  // }

    /**
   * @private
   * @property {FirebaseService} firebase - Injected Firebase service for interacting with the database.
   */
    firebase = inject(FirebaseService);

    /**
     * @property {ContactInterface | null} currentContact - The currently selected contact (not directly used at the moment, relevant for future features).
     */
    currentContact: ContactInterface | null = null;
  
    /**
     * @property {string} todaysDate - Today's date in YYYY-MM-DD format, pre-set for the datepicker field.
     */
    todaysDate: string = new Date().toISOString().split('T')[0];
  
    /**
     * @property {string} selectedPriority - The selected priority of the task ('low', 'medium', 'high'). Defaults to 'medium'.
     */
    selectedPriority: string = 'medium';
  
    /**
     * @property {boolean} dropdownVisible - Controls the visibility of the priority dropdown menu at selection of contacts.
     */
    dropdownVisible = false;
  
    /**
     * @property {boolean} checkboxActive - Status of a checkbox at contact selection - if checked, person is selected.
     */
    checkboxActive = false;
  
    /**
     * @property {ContactInterface[]} selectedContacts - An array of selected contacts to be assigned to the task for displaying below.
     */
    selectedContacts: ContactInterface[] = [];
  
    /**
     * @property {boolean} newTaskAdded - A flag indicating whether a new task has been added successfully, used to display a confirmation message.
     */
    newTaskAdded: boolean = false;
  
    /**
     * @property {boolean} subtaskInputFocused - A flag indicating whether the subtask input field has focus.
     */
    subtaskInputFocused = false;
  
    /**
     * @property {{ name: string, isEditing: boolean }[]} subtasks - An array of subtask objects, each with a name and an editing status.
     */
    subtasks: { name: string, isEditing: boolean }[] = [];
  
    /**
     * @property {string} subtaskInput - The model for the input field to add new subtasks.
     */
    subtaskInput: string = '';
  
    /**
     * @property {boolean} formSubmitted - A flag indicating whether the add task form has been submitted.
     */
    formSubmitted: boolean = false;
  
    /**
     * @property {boolean} showAddButton - Controls the visibility of the "Add" button at subtasks.
     */
    showAddButton: boolean = true;
  
    /**
     * @private
     * @property {ReturnType<typeof setTimeout> | null} hideInputIconTimeout - Stores the timeout handler to delay hiding the input icon.
     */
    hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  
    /**
     * @property {string} selectedCategory - The currently selected category for the task.
     */
    selectedCategory: string = '';
  
    /**
     * @property {boolean} categoryDropdownVisible - Controls the visibility of the category dropdown menu.
     */
    categoryDropdownVisible = false;
  
    /**
     * @property {boolean} categorySelected - A flag indicating whether a category has been selected for the task, because it is required and not part of the <form>.
     */
    categorySelected: boolean = false;
  
    /**
     * @property {boolean} categoryTouched - A flag indicating whether the category selection field has been touched show validation hints.
     */
    categoryTouched: boolean = false;
  
    /**
     * @property {boolean} dateSet - A flag indicating whether a date has been selected for the task for possible requirement message.
     */
    dateSet: boolean = false;
  
    /**
     * @property {TaskInterface} newTask - The object containing the data for the new task, bound to the form, default status "todo".
     */
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

      /**
   * @constructor
   * @param {Router} router - Injected Router service for navigating to Board after succesfully added task.
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

    /**
   * @method newClassForDate
   * @description Sets the 'dateSet' flag to true to change the text color of the date field after selection.
   */
  newClassForDate() {
    this.dateSet = true;
  }

    /**
   * @method chooseCategory
   * @param {string} choosenCategory - The selected category from the dropdown menu.
   * @description Sets the selected category, marks the category as selected, and resets the 'categoryTouched' flag.
   */
  chooseCategory(choosenCategory: string) {
    this.selectedCategory = choosenCategory;
    this.categorySelected = true;
    this.categoryTouched = false;
  }

    /**
   * @method setCategoryTouchedTrue
   * @description Sets the 'categoryTouched' flag to true, when user focuses or interacts with the category selection field.
   */
  setCategoryTouchedTrue() {
    this.categoryTouched = true;
  }

    /**
   * @method toggleCategoryDropdown
   * @description Toggles visibility of the task category dropdown menu.
   */
  toggleCategoryDropdown() {
    this.categoryDropdownVisible = !this.categoryDropdownVisible;
  }

    /**
   * @method hideCategoryDropdown
   * @description Sets visibility of the task category dropdown menu to false for click outside the menu.
   */
  hideCategoryDropdown() {
    this.categoryDropdownVisible = false;
  }

    /**
   * @method toggleDropdown
   * @description Toggles the visibility of the contact selection dropdown menu.
   */
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
    /**
   * @method hideDropdown
   * @description Sets the visibility of the contact selection dropdown menu to false.
   */
  hideDropdown() {
    this.dropdownVisible = false;
  }

  /**
   * @method selectPriority
   * @param {string} priority - The selected priority from priority buttons.
   * @description Sets the selected priority for new task.
   */
  selectPriority(priority: string) {
    this.selectedPriority = priority;
  }

    /**
   * @method submitForm
   * @param {NgForm} ngform - The NgForm object of the form.
   * @description Handles the submission of the form to add a new task.
   * Sets category, priority, assigned contacts, and subtasks in the 'newTask' object.
   * Validates the form and category selection, saves the task to the database,
   * displays a success message, clears the form, and resets flags.
   */
  submitForm(ngform: NgForm) {
    this.newTask.category = this.selectedCategory;
    this.newTask.priority = this.selectedPriority;
    this.newTask.assignedToUserId = this.selectedContacts.map(contact => contact.id).filter((id): id is string => id !== undefined); // Add selected contacts' IDs to the task
    this.newTask.subtasks = this.subtasks.map(subtask => ({ subtask: subtask.name, isCompleted: false })); // Add subtasks to the task
    this.formSubmitted = true;
    if (ngform.valid && this.categorySelected) {            // Only check if the form is valid
        this.showReport();                                  //shows confirmation about added task
        this.firebase.addTaskToData(this.newTask);          // Save the task to the database
        this.newTaskAdded = true;
        this. clearFormular(ngform);                        // Reset the form after submission
        this.setBack();                                     //set back all flags and arrays to default
    }
}

  /**
   * @method showReport
   * @description Displays a success message for 2 seconds, then navigates the user to the board.
   */
  showReport() {
    setTimeout(() => {
      this.newTaskAdded = false;
      this.router.navigate(['/board']);
    }, 2000);
  }

  /**
   * @method setBack
   * @description Resets flags and arrays to their default values to prepare the form for a new task.
   */
    setBack() {
      this.selectedContacts = [];           // Clear selected contacts
          this.subtasks = [];               // Clear subtasks
          this.subtaskInput = '';           //clear subtask input field
          this.categorySelected = false;    //set category flag back
          this.selectedCategory = '';       //clear category
          this.formSubmitted = false;       //form getting ready for the new submit
          this.categoryTouched = false;     //category touched set back to default
          this.dateSet = false;             //new class for date input field removed to set styling back to default
    }

  /**
   * @method dismissReport
   * @description Sets the 'newTaskAdded' flag to default and dismiss the confirmation message
   */
  dismissReport() {    
    this.newTaskAdded = false;
  }

    /**
   * @method clearFormular
   * @param {NgForm} ngform - The NgForm object of the form.
   * @description Resets the values of the form and related properties to their default values.
   */
  clearFormular(ngform: NgForm) {
    ngform.reset(); 
    this.selectedPriority = 'medium';
    this.categorySelected = false;
    this.selectedCategory = '';
    this.categoryTouched = false;
    this.selectedContacts = [];
    this.subtasks = [];
    this.subtaskInput = '';
  }

    /**
   * @method assignContact
   * @param {ContactInterface} contact - The contact to be assigned to or removed from the task.
   * @description Adds a contact to or removes a contact from the array of selected contacts.
   */
  assignContact(contact: ContactInterface) {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    if (index === -1) {
      this.selectedContacts.push(contact); // Add contact if not already selected
    } else {
      this.selectedContacts.splice(index, 1); // Remove contact if already selected
    }
  }

    /**
   * @method isSelected
   * @param {any} contact - The contact to check.
   * @returns {boolean} - True if the contact is already among the selected contacts, false otherwise.
   * @description Checks if a specific contact is already present in the array of selected contacts.
   */
  isSelected(contact: any): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
  }

    /**
   * @method addSubtask
   * @description Adds a new subtask to the list of subtasks if the input field is not empty.
   * Clears the input field after adding.
   */
  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push({ name: this.subtaskInput.trim(), isEditing: false }); // Subtask zur Liste hinzufügen
      this.subtaskInput = ''; // Eingabefeld leeren
    }
  }

    /**
   * @method removeSubtask
   * @param {number} index - The index of the subtask to remove from the list.
   * @description Removes a subtask from the list based on its index.
   */
  removeSubtask(index: number) {
    this.subtasks.splice(index, 1); // Subtask entfernen
  }

    /**
   * @method editSubtask
   * @param {number} index - The index of the subtask to edit in the list.
   * @description Activates the editing mode for a subtask and sets focus on the associated input field.
   */
  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
    setTimeout(() => {
      const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  }

    /**
   * @method saveSubtask
   * @param {number} index - The index of the subtask to save in the list.
   * @description Saves the edited name of a subtask and deactivates the editing mode.
   */
  saveSubtask(index: number) {
    const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
    if (inputElement) {
      this.subtasks[index].name = inputElement.value;
    }
    this.subtasks[index].isEditing = false;
  }

    /**
   * @method handleKeyUp
   * @param {KeyboardEvent} event - The keyboard event that was triggered.
   * @param {number} index - The index of the subtask whose input field triggered the event.
   * @description Handles the 'KeyUp' event in the subtask input fields. Saves the subtask when the 'Enter' key is pressed.
   */
  handleKeyUp(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.saveSubtask(index);
    }
  }

    /**
   * @method clearSubtaskInput
   * @description Clears the subtask input field and resets the focus flag.
   */
  clearSubtaskInput() {
    this.subtaskInput = '';
    this.subtaskInputFocused = false;
  }

    /**
   * @method focusSubtaskInput
   * @description Explicitly sets focus on the subtask input field.
   */
  focusSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.focus();
    }
  }

    /**
   * @method onSubtaskInputBlur
   * @description Handles the 'Blur' event of the subtask input field. Delays resetting the focus flag.
   */
  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 1000/2); // 2 seconds delay
  }

    /**
   * @method onSubtaskInputFocus
   * @description Handles the 'Focus' event of the subtask input field. Clears any pending timeout for hiding the icon.
   */
  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
}

}
