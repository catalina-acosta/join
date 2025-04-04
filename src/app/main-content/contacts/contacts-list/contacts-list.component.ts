import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../contact-interface';
import { RouterModule } from '@angular/router';

/**
 * The ContactsListComponent is responsible for managing and displaying the list of contacts.
 * It handles the functionality of adding new contacts, opening contact details, and emitting events
 * related to the creation and editing of contacts.
 * 
 * @selector app-contacts-list
 * @example
 * <app-contacts-list (openDetails)="onContactSelected($event)" (contactCreatedEvent)="onNewContactCreated($event)"></app-contacts-list>
 */
@Component({
  selector: 'app-contacts-list',  // The HTML tag used to reference this component.
  standalone: true,               // Marks the component as standalone, meaning it doesn't require a module.
  imports: [CommonModule, AddContactDialogComponent, RouterModule],  // Imports required modules.
  templateUrl: './contacts-list.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./contacts-list.component.scss']  // Path to the stylesheet for this component.
})
export class ContactsListComponent {
  /**
   * Injected instance of the FirebaseService to interact with the backend database.
   * @type {FirebaseService}
   */
  firebase = inject(FirebaseService);

  /**
   * A flag indicating whether the add contact dialog is open.
   * @type {boolean}
   */
  isDialogOpen: boolean = false;

  /**
   * A flag indicating whether the delete contact dialog is open.
   * @type {boolean}
   */
  isDeleteOpen: boolean = false;

  /**
   * The current contact being edited or viewed. This is null when no contact is selected.
   * @type {ContactInterface | null}
   */
  currentContact: ContactInterface | null = null;

  /**
   * A flag indicating whether the edit contact dialog is open.
   * @type {boolean}
   */
  isEditDialogOpen: boolean = false;

  /**
   * A flag that tracks whether a contact has been successfully created.
   * @type {boolean}
   */
  contactIsSuccessfully: boolean = false;

  /**
   * The email address of the selected contact, used for determining which contact is being interacted with.
   * @type {string | null}
   */
  selectedContactEmail: string | null = null;

  /**
   * An output event emitter that notifies the parent component when the details of a contact are to be opened.
   * @type {EventEmitter<ContactInterface>}
   */
  @Output() openDetails = new EventEmitter<ContactInterface>();

  /**
   * An output event emitter that notifies the parent component when a new contact has been created.
   * @type {EventEmitter<ContactInterface>}
   */
  @Output() contactCreatedEvent = new EventEmitter<ContactInterface>();

  /**
   * Opens the details view for a specific contact by emitting the selected contact.
   * @param {ContactInterface} contact - The contact whose details are to be opened.
   */
  openDialogDetails(contact: ContactInterface) {
    this.selectedContactEmail = contact.email;
    this.openDetails.emit(contact);  // Emits the selected contact for viewing details.
  }

  /**
   * Handles the creation of a new contact, emitting the contact and updating the UI with a success message.
   * @param {ContactInterface} contact - The contact that was successfully created.
   */
  onContactCreated(contact: ContactInterface) { 
    this.contactCreatedEvent.emit(contact);  // Emits the created contact to notify the parent component.
    this.contactIsSuccessfully = true;  // Sets the success flag to true.

    // Closes the success message after a delay.
    setTimeout(() => {
      const successElement = document.querySelector('.succesfull_content');
      
      if (successElement) {
        successElement.classList.add('dialog-closed');  // Closes the success message.
      }

      setTimeout(() => {
        this.contactIsSuccessfully = false;  // Resets the success flag.
      }, 500);
    }, 1000);
  }

  /**
   * Opens the dialog for adding a new contact.
   */
  openAddNewContacts() {
    this.isDialogOpen = true;  // Sets the dialog open flag to true.
  }

  /**
   * Stops the propagation of an event to prevent it from triggering other event listeners.
   * @param {Event} event - The event to stop propagation for.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();  // Prevents the event from propagating to parent elements.
  }

  /**
   * Closes the add/edit/delete contact dialogs.
   * It also resets the dialog open flags and hides the dialogs with a transition.
   */
  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');  // Adds a class to close the dialog with a transition.
      this.isEditDialogOpen = false;  // Resets the edit dialog flag.
      
      // Delays hiding the dialogs after the closing transition.
      setTimeout(() => {
        this.isDialogOpen = false;  // Closes the add contact dialog.
        this.isDeleteOpen = false;  // Closes the delete contact dialog.
      }, 500);
    } else {
      this.isDialogOpen = false;  // Directly closes the dialogs if no dialog element is found.
      this.isDeleteOpen = false;
    }
  }
}
