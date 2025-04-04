import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';

/**
 * @component EditDialogComponent
 * 
 * This component provides an interface to edit tasks.
 * Users can modify task details, assign contacts, and manage subtasks.
 */
@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  
  /** Service for Firebase operations */
  firebase = inject(FirebaseService);

  /**
   * @event closeDialogEvent
   * Emits an event when the edit dialog should be closed.
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * @event saveChangesEvent
   * Emits an event when task changes are saved.
   */
  @Output() saveChangesEvent = new EventEmitter<TaskInterface>();

  /**
   * @property {TaskInterface | undefined} item
   * The task being edited.
   */
  @Input() item?: TaskInterface;

  /** Stores a copy of the task being edited */
  editedItem!: TaskInterface;

  /** Controls dialog visibility */
  isDialogOpen: boolean = false;

  /** Selected priority level */
  selectedPriority: string = 'medium';

  /** Timeout reference for hiding input icon */
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Tracks focus state of the subtask input field */
  subtaskInputFocused: boolean = false;

  /** Input field for new subtasks */
  subtaskInput: string = '';

  /** Stores the list of subtasks */
  subtasks: { name: string, isEditing: boolean }[] = [];

  /** Controls the dropdown menu visibility */
  dropdownVisible: boolean = false;

  /** Tracks form submission state */
  isEditFormSubmitted: boolean = false;

  /** Stores the selected date */
  newDate: string = "";

  /**
   * Assigns or removes a contact from the task.
   * @param contactId - The ID of the contact to assign or remove.
   */
  assignContact(contactId: string) {
    if (this.editedItem) {
      if (!this.editedItem.assignedToUserId) {
        this.editedItem.assignedToUserId = [];
      }
      const index = this.editedItem.assignedToUserId.indexOf(contactId);
      if (index === -1) {
        this.editedItem.assignedToUserId.push(contactId);
      } else {
        this.editedItem.assignedToUserId.splice(index, 1);
      }
      // Sort assigned contacts alphabetically by first name
      this.editedItem.assignedToUserId.sort((a, b) => {
        const contactA = this.firebase.orderedContactsList.find(contact => contact.id === a);
        const contactB = this.firebase.orderedContactsList.find(contact => contact.id === b);
        return contactA && contactB ? contactA.firstname.localeCompare(contactB.firstname) : 0;
      });
    }
  }

  /**
   * Checks if a contact is assigned to the task.
   * @param contactId - The ID of the contact.
   * @returns {boolean} - True if assigned, false otherwise.
   */
  isAssignedTo(contactId: string): boolean {
    return this.editedItem?.assignedToUserId?.includes(contactId) ?? false;
  }

  /**
   * Toggles the dropdown menu visibility.
   */
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  /**
   * Initializes the component and creates a copy of the task.
   */
  ngOnInit() {
    this.editedItem = JSON.parse(JSON.stringify(this.item)) || {};
    if (this.item?.priority) {
      this.selectedPriority = this.item.priority;
    }
  }

  /**
   * Saves changes and closes the dialog.
   */
  saveChanges() {
    this.saveChangesEvent.emit(this.editedItem);
    this.closeDialog();
  }

  /**
   * Updates the priority of the task.
   * @param priority - The new priority level.
   */
  selectPriority(priority: string) {
    this.selectedPriority = priority;
    if (this.editedItem) {
      this.editedItem.priority = priority;
    }
  }

  /**
   * Saves the edited task to Firebase.
   * @param taskForm - The form containing task details.
   */
  saveEditedTask(taskForm: NgForm) {
    if (this.editedItem?.id && this.editedItem?.date) {
      this.item = { ...this.editedItem };

      this.firebase.updateTaskStatus(this.editedItem.id, {
        title: this.editedItem.title,
        description: this.editedItem.description,
        date: this.editedItem.date,
        priority: this.selectedPriority,
        assignedToUserId: this.editedItem.assignedToUserId,
        subtasks: this.editedItem.subtasks,
      });

      this.saveChangesEvent.emit(this.editedItem);
      this.closeDialog();
    }
  }

  /**
   * Emits an event to close the dialog.
   */
  closeDialog() {
    this.closeDialogEvent.emit();
  }

  /**
   * Stops event propagation to prevent unintended actions.
   * @param event - The event to stop propagation on.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Adds a new subtask to the task.
   */
  addSubtask() {
    if (this.subtaskInput.trim()) {
      const newSubtask = {
        subtask: this.subtaskInput.trim(),
        isCompleted: false,
        isEditing: false
      };
      if (this.editedItem && this.editedItem.subtasks) {
        this.editedItem.subtasks.push(newSubtask);
      }
      this.subtaskInput = '';
    }
  }

  /**
   * Removes a subtask from the list.
   * @param index - The index of the subtask to remove.
   */
  removeSubtask(index: number) {
    if (this.editedItem?.subtasks) {
      this.editedItem.subtasks.splice(index, 1);
    }
  }

  /**
   * Enables editing mode for a subtask.
   * @param index - The index of the subtask to edit.
   */
  editSubtask(index: number) {
    if (this.editedItem?.subtasks) {
      this.editedItem.subtasks[index].isEditing = true;
      setTimeout(() => {
        const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
        inputElement?.focus();
      }, 0);
    }
  }

  /**
   * Saves changes to a subtask and exits editing mode.
   * @param index - The index of the subtask to save.
   */
  saveSubtask(index: number) {
    const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
    if (inputElement && this.editedItem?.subtasks) {
      const newSubtaskValue = inputElement.value.trim();
      if (newSubtaskValue !== '') {
        this.editedItem.subtasks[index].subtask = newSubtaskValue;
      }
      this.editedItem.subtasks[index].isEditing = false;
    }
  }
  
  /**
   * Handles keyboard input for saving a subtask.
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
   * Handles blur event for subtask input, hiding the icon after a delay.
   */
  onSubtaskInputBlur() {
    this.hideInputIconTimeout = setTimeout(() => {
      this.subtaskInputFocused = false;
    }, 500);
  }

  /**
   * Handles focus event for subtask input, keeping the icon visible.
   */
  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
  }
}
