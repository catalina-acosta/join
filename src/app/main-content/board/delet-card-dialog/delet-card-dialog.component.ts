import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { TaskInterface } from '../task.interface';

/**
 * @component DeletCardDialogComponent
 * 
 * This component provides a dialog window for deleting a task.
 * It receives a task as input and emits events when the task
 * is successfully deleted or when the dialog is closed.
 */
@Component({
  selector: 'app-delet-card-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delet-card-dialog.component.html',
  styleUrl: './delet-card-dialog.component.scss'
})
export class DeletCardDialogComponent {
  
  /** Service for Firebase operations */
  firebase = inject(FirebaseService);

  /**
   * @property {TaskInterface | undefined} item
   * The task to be deleted, passed from the parent component.
   */
  @Input() item?: TaskInterface;

  /**
   * @event closeDialogEvent
   * Emits an event when the dialog window should be closed.
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * @event contactDeletedEvent
   * Emits an event when the task has been successfully deleted.
   */
  @Output() contactDeletedEvent = new EventEmitter<void>();

  /**
   * Deletes the provided task from the Firebase database.
   * If the deletion is successful, the corresponding events are triggered.
   */
  deleteItem() {
    if (this.item?.id) {
      this.firebase.deleteTaskFromData(this.item.id)
        .then(() => {
          this.contactDeletedEvent.emit(); // Emit event that the task has been deleted
          this.closeDialog(); // Close the dialog window
        })
        .catch((error) => {
          console.error("Error deleting task: ", error);
        });
    }
  }

  /**
   * Closes the dialog window by emitting an event.
   */
  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
