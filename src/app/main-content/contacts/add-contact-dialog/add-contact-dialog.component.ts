import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactInterface } from '../contact-interface';

/**
 * The AddContactDialogComponent provides a dialog interface to create a new contact.
 * It allows the user to input contact details and submits the contact to the Firebase service.
 * It emits events to notify the parent component when the contact is created or when the dialog is closed.
 *
 * @selector app-add-contact-dialog
 * @example
 * <app-add-contact-dialog (closeDialogEvent)="onCloseDialog()" (contactCreatedEvent)="onContactCreated($event)"></app-add-contact-dialog>
 */
@Component({
  selector: 'app-add-contact-dialog',  // The HTML tag used to reference this component.
  standalone: true,                    // Marks the component as standalone.
  imports: [CommonModule, FormsModule],  // Imports required modules and components.
  templateUrl: './add-contact-dialog.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./add-contact-dialog.component.scss']  // Path to the stylesheet for this component.
})
export class AddContactDialogComponent {
  /**
   * The Firebase service instance injected into the component to interact with the backend.
   * @type {FirebaseService}
   */
  firebase = inject(FirebaseService);

  /**
   * The contact object passed as input. Used to bind the contact data when editing.
   * @type {ContactInterface}
   */
  @Input() contact!: ContactInterface;

  /**
   * An event emitter that notifies the parent component to close the dialog.
   * @type {EventEmitter<void>}
   */
  @Output() closeDialogEvent = new EventEmitter<void>();

  /**
   * An event emitter that notifies the parent component when a new contact has been created.
   * @type {EventEmitter<ContactInterface>}
   */
  @Output() contactCreatedEvent = new EventEmitter<ContactInterface>();

  /**
   * A flag indicating whether the form has been submitted.
   * @type {boolean}
   */
  formSubmitted: boolean = false;

  /**
   * A flag that indicates if the submit button was clicked.
   * @type {boolean}
   */
  submitButtonClicked = false;

  /**
   * A flag indicating whether the contact was successfully created.
   * @type {boolean}
   */
  contactIsSuccessfully: boolean = false;

  /**
   * The new contact object to be created, with properties for the contact's information.
   * @type {Object}
   */
  newContact = {
    fullname: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    color: '',
  };

  /**
   * Triggers form validation when the submit button is clicked.
   * Sets the `submitButtonClicked` flag to true.
   */
  formValidation() {
    this.submitButtonClicked = true;  // Sets the submit button clicked flag to true.
  }

  /**
   * Handles the form submission to create a new contact.
   * If the form is valid, it calls the `addNewContact` method.
   * 
   * @param {NgForm} contactForm - The form object containing the contact form data.
   */
  onCreateContact(contactForm: NgForm) {
    this.formSubmitted = true;  // Sets the formSubmitted flag to true.

    if (contactForm.valid) {
      this.addNewContact();  // Calls the method to add a new contact.
    }
  }

  /**
   * Adds a new contact to the Firebase service and emits the `contactCreatedEvent` with the new contact data.
   * Generates the first and last name from the full name, and assigns a random avatar color from the Firebase service.
   */
  addNewContact() {
    const nameParts = this.newContact.fullname.trim().split(' ');  // Splits the full name into first and last names.
    this.newContact.firstname = this.toUpperCaseName(nameParts[0]);  // Capitalizes the first name.
    this.newContact.lastname = this.toUpperCaseName(nameParts.slice(1).join(' ') || '');  // Capitalizes the last name.
    this.newContact.color = this.firebase.avatarColor[Math.floor(Math.random() * this.firebase.avatarColor.length)];  // Assigns a random avatar color.

    this.firebase.addContactToData(this.newContact);  // Adds the new contact to the Firebase service.
    this.contactCreatedEvent.emit(this.newContact);  // Emits the contactCreatedEvent with the new contact data.
    this.clearInputFeld();  // Clears the input fields.
  }

  /**
   * Converts a string to title case (capitalizes the first letter of the string and converts the rest to lowercase).
   * 
   * @param {string} str - The string to be converted.
   * @returns {string} - The string in title case format.
   */
  toUpperCaseName(str: string): string {
    if (!str) return str;  // If the string is empty, return it as is.
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();  // Capitalizes the first letter and lowercases the rest.
  }

  /**
   * Clears the input fields and resets the newContact object to its initial state.
   */
  clearInputFeld() {
    this.newContact = {
      fullname: 'Name',
      firstname: '',
      lastname: '',
      email: 'Email',
      phone: 'Phone',
      color: '',
    };

    this.closeDialog();  // Closes the dialog after clearing the fields.
  }

  /**
   * Closes the dialog by emitting the `closeDialogEvent`.
   */
  closeDialog() {
    this.closeDialogEvent.emit();  // Emits the closeDialogEvent to notify the parent component to close the dialog.
  }
}
