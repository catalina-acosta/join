import { Component, inject, Input } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from './contact-interface';
import { FirebaseService } from '../../shared/service/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [ContactsListComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  firebaseService = inject(FirebaseService);
  detailsOpen: boolean = false;
  currentContact: ContactInterface | null = null;
  contactIsSuccesfully = false;

  onContactCreated() {
    this.contactIsSuccesfully = true;
  
    setTimeout(() => {
      const dialogElement = document.querySelector('.succesfull_content');
      if (dialogElement) {
        dialogElement.classList.add('dialog-closed');
      }
    }, 2500); 
  
    setTimeout(() => {
      this.contactIsSuccesfully = false; 
    }, 3000); 
  }
  
  detailsOpened(contact: ContactInterface) {
    this.currentContact = contact;
    this.detailsOpen = true;
  }  contactIsSuccesfully = false;

  onContactCreated() {
    this.contactIsSuccesfully = true;
  
    setTimeout(() => {
      const dialogElement = document.querySelector('.succesfull_content');
      if (dialogElement) {
        dialogElement.classList.add('dialog-closed');
      }
    }, 2500); 
  
    setTimeout(() => {
      this.contactIsSuccesfully = false; 
    }, 3000); 
  }
  
}
