import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactInterface } from '../../contacts/contact-interface';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  firebase = inject(FirebaseService);
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() item?: TaskInterface;

  isDialogOpen: boolean = false;
  selectedPriority: string = 'medium';
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  subtaskInputFocused: boolean = false;
  subtaskInput: string = '';
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  dropdownVisible: boolean = false;
  isEditFormSubmitted: boolean = false;
  newDate: string = "";

  assignContact(contactId: string) {
    if (this.item) {
      if (this.item.assignedToUserId) {
        if (this.item.assignedToUserId) {
          const index = this.item.assignedToUserId.indexOf(contactId);
          if (index === -1) {
            this.item.assignedToUserId.push(contactId);
          } else {
            this.item.assignedToUserId.splice(index, 1);
          }
        }
      }
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  ngOnInit() {
    if (this.item?.priority) {
      this.selectedPriority = this.item.priority; 
    }

    if (!this.item?.subtasks) {
      this.item!.subtasks = [];
    }
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
    if (this.item) {
      this.item.priority = priority;
    }
  }

  saveEditedTask(taskForm: NgForm) {
    this.isEditFormSubmitted = true;
    if (this.item?.id && this.item?.date && this.isEditFormSubmitted) {
      this.firebase.updateTaskStatus(this.item.id, {
        title: this.item.title,
        description: this.item.description,
        date: this.item.date,
        priority: this.selectedPriority,
        assignedToUserId: this.item.assignedToUserId,
        status: this.item.status,
        category: this.item.category,
        subtasks: this.item.subtasks
      }).then(() => {
        // console.log('Nach Update:', this.item?.date); // Debugging
        // console.log('Aufgabe erfolgreich aktualisiert!');
        this.closeDialog();
      }).catch((error) => {
        console.error('Fehler beim Aktualisieren:', error);
      });
    }
  }

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  // subtaks

  addSubtask() {
    if (this.subtaskInput.trim()) {
      const newSubtask = {
        subtask: this.subtaskInput.trim(),
        isCompleted: false,
        isEditing: false
      };
      if (this.item && this.item.subtasks) {
        this.item.subtasks.push(newSubtask);
      } 
      this.subtaskInput = '';
    }
  }

  removeSubtask(index: number) {
    if (this.item?.subtasks) {
      this.item.subtasks.splice(index, 1);
  
      if (this.item?.id) {
        this.firebase.updateTaskStatus(this.item.id, {
          subtasks: this.item.subtasks
        });
      }
    }
  }

  editSubtask(index: number) {
    if (this.item?.subtasks) {
      this.item.subtasks[index].isEditing = true;

      setTimeout(() => {
        const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
        inputElement?.focus();
      }, 0);
    }
  }

  saveSubtask(index: number) {
    const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;

    if (inputElement && this.item?.subtasks) {
      const newSubtaskValue = inputElement.value.trim();

      if (newSubtaskValue === '') {
        inputElement.value = this.item.subtasks[index].subtask;
      } else {
        this.item.subtasks[index].subtask = newSubtaskValue;
      }
      this.item.subtasks[index].isEditing = false;

      if (this.item?.id) {
        this.firebase.updateTaskStatus(this.item.id, {
          subtasks: this.item.subtasks
        });
      }
    }
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
    }, 1000 / 2);
  }

  onSubtaskInputFocus() {
    if (this.hideInputIconTimeout) {
      clearTimeout(this.hideInputIconTimeout);
    }
    this.subtaskInputFocused = true;
  }

}
