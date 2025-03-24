import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent implements AfterViewInit {
  firebase = inject(FirebaseService);
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() item?: TaskInterface;

  private cdr = inject(ChangeDetectorRef);

  isDialogOpen: boolean = false;
  selectedPriority: string = 'medium';
  hideInputIconTimeout: ReturnType<typeof setTimeout> | null = null;
  subtaskInputFocused: boolean = false;
  subtaskInput: string = '';
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks

  ngOnInit() {
    if (this.item?.priority) {
      this.selectedPriority = this.item.priority;  // Setze gespeicherte Priorität
    }

    if (this.item?.date) {
      console.log('Firebase Datum:', this.item.date);
  
      const [day, month, year] = this.item.date.split('/'); 
      const formattedDate = `${year}-${month}-${day}`; 
      const date = new Date(`${formattedDate}T00:00:00`);
  
      if (!isNaN(date.getTime())) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        this.item.date = `${yyyy}-${mm}-${dd}`;
        console.log('Input Datum:', this.item.date);
      } else {
        console.error('Ungültiges Datum:', this.item.date);
      }
    } else {
      console.warn('Kein Datum vorhanden');
    }
  }

  selectPriority(priority: string) {
    this.selectedPriority = priority;
    if (this.item) {
      this.item.priority = priority; // Aktualisiere das Item
    }
  }

  saveEditedTask() {
    if (this.item?.id && this.item?.date) {
      const [year, month, day] = this.item.date.split('-');
      this.item.date = `${day}/${month}/${year}`;
  
      console.log('Speichere Aufgabe:', this.item);
  
      this.firebase.updateTaskStatus(this.item.id, {
        title: this.item.title,
        description: this.item.description,
        date: this.item.date,
        priority: this.selectedPriority,  // Speichere ausgewählte Priorität
        assignedToUserId: this.item.assignedToUserId,
        status: this.item.status,
        category: this.item.category,
        subtasks: this.item.subtasks
      }).then(() => {
        console.log('Aufgabe erfolgreich aktualisiert!');
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

  ngAfterViewInit() {
    if (this.item?.date) {
      this.cdr.detectChanges();
    }
  }
// subtaks

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
