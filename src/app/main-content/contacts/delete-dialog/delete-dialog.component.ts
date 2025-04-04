import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { ContactInterface } from '../contact-interface';

/**
 * The DeleteDialogComponent is responsible for providing a user interface to delete a contact.
 * It allows the user to confirm the deletion of a contact and triggers the necessary backend operations.
 * 
 * @selector app-delete-dialog
 * @example
 * <app-delete-dialog [contact]="contact" (closeDialogEvent)="onDialogClose()" (contactDeletedEvent)="onContactDeleted()"></app-delete-dialog>
 */
@Component({
  selector: 'app-delete-dialog',  // The HTML tag used to reference this component.
  standalone: true,               // Marks the component as standalone, meaning it doesn't require a module.
  imports: [CommonModule],        // Imports required modules for basic functionality.
  templateUrl: './delete-dialog.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./delete-dialog.component.scss']  // Path to the stylesheet for this component.
})
export class DeleteDialogComponent {
  /**
   * Injected FirebaseService instance for interacting with the backend database to delete a contact.
   * @type {FirebaseService}
   */
  firebaseService = inject(FirebaseService);

  /**
   * Input property representing the contact to be deleted. This is passed from the parent component.
   * @type {ContactInterface}
   */
  @Input() contact!: ContactInterface;

  /**
   * Output event emitter used to notify the parent component when the dialog is closed.
   * @type {EventEmitter<void>}
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * The ID of the contact to be deleted.
   * @type {string | undefined}
   */
  contactId?: string = '';

  /**
   * Output event emitter used to notify the parent component when the contact has been successfully deleted.
   * @type {EventEmitter<void>}
   */
  @Output() contactDeletedEvent = new EventEmitter<void>();

  /**
   * Deletes the contact from the database by calling the `deleteContactFromData` method of the FirebaseService.
   * After deleting the contact, it emits the `contactDeletedEvent` and closes the dialog.
   */
  deleteItem() {
    this.contactId = this.contact.id;
    if (this.contactId) {
      this.firebaseService.deleteContactFromData(this.contactId);  // Deletes the contact from the database.
      this.contactDeletedEvent.emit();  // Emits an event to notify the parent component of the deletion.
      this.closeDialog();  // Closes the dialog.
    }
  }

  /**
   * Emits an event to close the delete contact dialog.
   * This method is called when the dialog is either closed or the contact is deleted.
   */
  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
