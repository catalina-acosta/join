import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { EditDialogComponent } from "../edit-dialog/edit-dialog.component";
import { DeletCardDialogComponent } from '../delet-card-dialog/delet-card-dialog.component';

/**
 * @component CardComponent
 * 
 * This component represents a task card within the task management system.
 * It allows task editing, deletion, and status updates.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, EditDialogComponent, DeletCardDialogComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  
  /** Service for Firebase operations */
  firebase = inject(FirebaseService);
  
  /** Change detector to trigger UI updates */
  private cdr = inject(ChangeDetectorRef);

  /**
   * @event closeDialogEvent
   * Emits an event when the dialog window should be closed.
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * @property {TaskInterface | undefined} item
   * The task item displayed within the card.
   */
  @Input() item?: TaskInterface;

  /** Stores the selected task for editing or deletion */
  selectedItem?: TaskInterface;

  /** Indicates if the edit dialog is open */
  isDialogOpen: boolean = false;

  /** Indicates if the delete confirmation dialog is open */
  isDeleteOpen: boolean = false;

  /**
   * Handles the deletion of a task.
   * Closes the delete dialog and emits an event when the task is deleted.
   */
  onTaskDeleted() {
    this.isDeleteOpen = false; 
    this.closeDialogEvent.emit();
  }
  
  /**
   * Opens the delete confirmation dialog for a specific task.
   * @param item - The task to be deleted.
   */
  opendeleteDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDeleteOpen = true;
  }

  /**
   * Updates the task status in Firebase and refreshes the UI.
   * @param updatedTask - The updated task object.
   */
  updateTask(updatedTask: TaskInterface) {
    this.firebase.updateTaskStatus(updatedTask.id!, updatedTask)
      .then(() => {
        this.item = { ...updatedTask }; // Update the local item reference
        this.cdr.detectChanges(); // Refresh UI
        this.closeEditDialog();
      })
      .catch(error => console.error('Error updating task:', error));
  }
  
  /**
   * Formats the task date for display.
   * @param date - The date in string or Date format.
   * @returns A formatted date string (dd/mm/yyyy).
   */
  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB');
  }

  /**
   * Toggles the completion status of a subtask and updates Firebase.
   * @param taskId - The ID of the parent task.
   * @param subtaskIndex - The index of the subtask to update.
   */
  updateSubtaskStatus(taskId: string | undefined, subtaskIndex: number) {
    if (!this.item?.id || !this.item?.subtasks) return;

    // Toggle subtask completion status
    this.item.subtasks[subtaskIndex].isCompleted = !this.item.subtasks[subtaskIndex].isCompleted;

    this.cdr.detectChanges();
    
    // Update Firebase
    this.firebase.updateTaskStatus(this.item.id, { subtasks: this.item.subtasks, status: this.item.status })
      .then(() => {
        this.cdr.detectChanges(); 
      })
      .catch((error) => console.error('Error updating subtask:', error));
  }

  /**
   * Emits an event to close the dialog.
   */
  closeDialog() {
    this.closeDialogEvent.emit();
  }

  /**
   * Opens the edit dialog for a specific task.
   * @param item - The task to edit.
   */
  openEditDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  /**
   * Closes both the edit and delete dialogs.
   */
  closeEditDialog() {
    this.isDialogOpen = false; 
    this.isDeleteOpen = false;
  }

  /**
   * Stops event propagation to prevent unintended actions.
   * @param event - The event to stop propagation on.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
