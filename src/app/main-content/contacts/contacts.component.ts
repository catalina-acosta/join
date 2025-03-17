import { Component, inject, Input } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from './contact-interface';
import { FirebaseService } from '../../shared/service/firebase.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactsListComponent, ContactDetailsComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  firebaseService = inject(FirebaseService);
  detailsOpen: boolean = false;
  currentContact: ContactInterface | null = null;

  detailsOpened(contact: ContactInterface) {
    this.currentContact = contact;
    this.detailsOpen = true;
  }
}
