import { Component, inject, Input } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from './contact-interface';
import { __makeTemplateObject } from 'tslib';
import { FirebaseService } from '../../shared/service/firebase.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactsListComponent, ContactDetailsComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  firebaseService = inject(FirebaseService);
  detailsOpen: boolean = false;
  @Input() contact!: ContactInterface; 
  contactId?: string= '';



  detailsOpened(contact: ContactInterface | null) {
    if (!contact) {
      this.detailsOpen = false;
      return;
    }
    this.contactId = contact.id;

    if (this.contactId) {
      this.firebaseService.deleteContactFromData(this.contactId);
    }

    this.detailsOpen = true;
  }

}
