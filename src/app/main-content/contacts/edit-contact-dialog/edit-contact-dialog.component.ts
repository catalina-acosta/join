import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../contact-interface';

/**
 * The EditContactDialogComponent is responsible for providing a user interface to edit an existing contact's details.
 * It includes a form for editing a contact's name, email, phone, and other details.
 * 
 * The component interacts with the `FirebaseService` to update the contact information in the backend.
 * 
 * @selector app-edit-contact-dialog
 * @example
 * <app-edit-contact-dialog [contact]="contact" (closeDialogEvent)="onDialogClose()"></app-edit-contact-dialog>
 */
@Component({
  selector: 'app-edit-contact-dialog',  // The HTML tag used to reference this component.
  imports: [FormsModule, CommonModule],  // Imports required modules for form handling and common functionality.
  templateUrl: './edit-contact-dialog.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./edit-contact-dialog.component.scss']  // Path to the stylesheet for this component.
})
export class EditContactDialogComponent {
  /**
   * Injected FirebaseService instance for interacting with the backend database.
   * @type {FirebaseService}
   */
  firebase = inject(FirebaseService);

  /**
   * Output event emitter used to notify the parent component when the dialog is closed.
   * @type {EventEmitter<void>}
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * Input property for the contact to be edited. It is passed from the parent component.
   * @type {ContactInterface}
   */
  @Input() contact!: ContactInterface;

  /**
   * Flag indicating whether the form has been submitted.
   * @type {boolean}
   */
  formSubmitted: boolean = false;

  /**
   * The ID of the contact being edited.
   * @type {string}
   */
  contactId: string = "";

  /**
   * The index of the contact in the list, if applicable.
   * @type {number | null}
   */
  selectedContactIndex: number | null = null;

  /**
   * An object representing the edited contact's details.
   * @type {object}
   */
  editedContact = {
    fullname: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    color: '',
  };

  /**
   * Handles the form submission event for editing the contact.
   * If the form is valid and the contact has an ID, it triggers the editing process.
   * 
   * @param contactForm - The form object containing the contact details.
   */
  onEditContact(contactForm: NgForm) {
    this.formSubmitted = true;
    if (contactForm.valid && this.contact.id) {
      this.editContact();
    }
  }

  /**
   * Initiates the contact editing process. It splits the full name into first and last names, 
   * and updates the `editedContact` object with the new values.
   * It then calls the `saveEdit` method to save the changes.
   */
  editContact() {
    const nameParts = this.editedContact.fullname.trim().split(' ');
    this.editedContact.firstname = this.toUpperCaseName(nameParts[0]);
    this.editedContact.lastname = this.toUpperCaseName(nameParts.slice(1).join(' ') || '');

    // Iterating over the list of contacts and updating the contact being edited.
    this.firebase.orderedContactsList.forEach((element) => {
      if (element.id === this.contact.id) {
        this.editedContact = {
          fullname: element.fullname,
          firstname: element.firstname,
          lastname: element.lastname,
          email: element.email,
          phone: element.phone,
          color: '',
        };
        this.saveEdit();
      }
    });
  }

  /**
   * Saves the edited contact information to the database.
   * It calls the `editContactToDatabase` method of `FirebaseService` to update the contact in the backend.
   */
  saveEdit() {
    if (this.contact.id) {
      this.closeDialog();
      this.firebase.editContactToDatabase(this.contact.id!, this.editedContact);
    }
  }

  /**
   * Converts a given string to title case (first letter uppercase, the rest lowercase).
   * 
   * @param str - The string to be converted to title case.
   * @returns {string} The string in title case format.
   */
  toUpperCaseName(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Emits an event to close the edit contact dialog.
   * This method is called after saving the contact or when the dialog is manually closed.
   */
  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
