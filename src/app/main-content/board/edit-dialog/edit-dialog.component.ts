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
  @Output() saveChangesEvent = new EventEmitter<TaskInterface>();
  @Input() item?: TaskInterface;

  editedItem!: TaskInterface; // Lokale Kopie für Bearbeitung

  isDialogOpen: boolean = false;
  selectedPriority: string = 'medium';
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  subtaskInputFocused: boolean = false;
  subtaskInput: string = '';
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  dropdownVisible: boolean = false;
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
    // Sicherstellen, dass `editedItem` eine Kopie von `item` ist
    this.editedItem = {
      ...this.item,
      title: this.item?.title ?? '',  // Standardwert für title setzen
      subtasks: this.item?.subtasks ? [...this.item.subtasks] : []  // Subtasks müssen ebenfalls geprüft werden
    };

    if (this.item?.priority) {
      this.selectedPriority = this.item.priority;
    }
  }
  
  saveChanges() {
    this.saveChangesEvent.emit(this.editedItem);
    this.closeDialog();
  }

selectPriority(priority: string) {
  this.selectedPriority = priority;
  if (this.editedItem) {
    this.editedItem.priority = priority;
  }
}

saveEditedTask(taskForm: NgForm) {
  if (this.editedItem?.id && this.editedItem?.date) {
    // Übernehme die Änderungen in die Original-Daten (item)
    this.item = { ...this.editedItem };
    
    // Jetzt kannst du die Änderungen an Firebase übergeben
    this.firebase.updateTaskStatus(this.editedItem.id, {
      title: this.editedItem.title,
      description: this.editedItem.description,
      date: this.editedItem.date,
      priority: this.selectedPriority,
      assignedToUserId: this.editedItem.assignedToUserId,
      subtasks: this.editedItem.subtasks, // Falls Subtasks bearbeitet wurden
    });
    this.saveChangesEvent.emit(this.editedItem);
    this.closeDialog();
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
