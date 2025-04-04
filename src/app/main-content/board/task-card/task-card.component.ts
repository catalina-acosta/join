import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { TaskInterface } from '../task.interface';
import { ContactInterface } from '../../contacts/contact-interface';

/**
 * Component for displaying a task card on the board.
 */
@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  /**
   * The task item to display in the card.
   */
  @Input() item!: TaskInterface;

  /**
   * Firebase service instance for interacting with Firestore.
   */
  firebase = inject(FirebaseService);

  /**
   * The number of completed subtasks for the task.
   */
  completedSubtasks: number = 0;

  /**
   * Indicates whether the task card is being dragged.
   */
  isDragging: boolean = false;

  /**
   * The currently selected task item for the dialog.
   */
  selectedItem!: TaskInterface;

  /**
   * Indicates whether the task details dialog is open.
   */
  isDialogOpen: boolean = false;

  /**
   * The full ordered list of contacts fetched from Firestore.
   */
  fullOrderedContactList: ContactInterface[] = [];

  /**
   * Initializes the component and fetches the contact list.
   */
  constructor() {
    this.getContactList();
  }

  /**
   * Fetches the ordered list of contacts from the Firebase service.
   */
  getContactList() {
    this.fullOrderedContactList = this.firebase.orderedContactsList;
  }

  /**
   * Calculates the percentage of completed subtasks for the task.
   * @returns The percentage of completed subtasks.
   */
  getCompletedPercentage(): number {
    if (!this.item.subtasks || this.item.subtasks.length === 0) {
      return 0;
    }
    this.completedSubtasks = this.item.subtasks.filter(subtask => subtask.isCompleted).length;
    return (this.completedSubtasks / this.item.subtasks.length) * 100;
  }

  /**
   * Opens the task details dialog for the selected task.
   * @param item - The task item to display in the dialog.
   */
  openCardDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  /**
   * Stops event propagation to prevent unintended behavior.
   * @param event - The event to stop propagation for.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Closes the task details dialog with an animation.
   */
  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      setTimeout(() => {
        this.isDialogOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
    }
  }
}