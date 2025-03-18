import { Component, inject, ViewChild } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from './contact-interface';
import { FirebaseService } from '../../shared/service/firebase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacts',
  imports: [ContactsListComponent, CommonModule, ContactDetailsComponent, RouterModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  firebaseService = inject(FirebaseService);
  detailsOpen: boolean = false;
  currentContact: ContactInterface | null = null;
  contactIsSuccessfully: boolean = false;

  @ViewChild(ContactDetailsComponent) contactDetailsComponent!: ContactDetailsComponent;

  openDialogDetails(contact: ContactInterface) {
    this.currentContact = contact;
    this.detailsOpen = true;

    setTimeout(() => {
      if (this.contactDetailsComponent) {
        this.contactDetailsComponent.onContactCreated(contact);
      }
    });
  }
}