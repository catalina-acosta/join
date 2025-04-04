import { Component, inject, ViewChild } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from './contact-interface';
import { FirebaseService } from '../../shared/service/firebase.service';
import { RouterModule } from '@angular/router';

/**
 * The ContactsComponent is responsible for managing the contacts view in the application.
 * It displays a list of contacts and allows the user to view details about a selected contact.
 * 
 * It includes the following main features:
 * - Displaying a list of contacts through the `ContactsListComponent`.
 * - Showing details for a specific contact using the `ContactDetailsComponent`.
 * - Handling contact data interactions with a backend service (`FirebaseService`).
 * 
 * @selector app-contacts
 * @example
 * <app-contacts></app-contacts>
 */
@Component({
  selector: 'app-contacts',  // The HTML tag used to reference this component.
  imports: [ContactsListComponent, CommonModule, ContactDetailsComponent, RouterModule],  // Imports required components and modules.
  templateUrl: './contacts.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./contacts.component.scss']  // Path to the stylesheet for this component.
})
export class ContactsComponent {
  /**
   * Injected FirebaseService instance for interacting with backend services.
   * @type {FirebaseService}
   */
  firebaseService = inject(FirebaseService);

  /**
   * Boolean flag indicating if the contact details dialog is open.
   * @type {boolean}
   */
  detailsOpen: boolean = false;

  /**
   * The current contact being viewed in the details section.
   * @type {ContactInterface | null}
   */
  currentContact: ContactInterface | null = null;

  /**
   * Boolean flag indicating whether the contact was successfully processed.
   * @type {boolean}
   */
  contactIsSuccessfully: boolean = false;

  /**
   * A reference to the ContactDetailsComponent, allowing interaction with it.
   * @type {ContactDetailsComponent}
   */
  @ViewChild(ContactDetailsComponent) contactDetailsComponent!: ContactDetailsComponent;

  /**
   * Opens the contact details dialog and sets the current contact.
   * It also triggers the `onContactCreated` method of the `ContactDetailsComponent`.
   * 
   * @param contact - The contact whose details will be displayed.
   */
  openDialogDetails(contact: ContactInterface) {
    this.currentContact = contact;
    this.detailsOpen = true;

    setTimeout(() => {
      if (this.contactDetailsComponent) {
        this.contactDetailsComponent.onContactCreated(contact);
      }
    });
  }

  /**
   * Handles the deletion of a contact by resetting the current contact and closing the details dialog.
   */
  handleContactDeleted() {
    this.currentContact = null;
    this.detailsOpen = false;
  }
}
