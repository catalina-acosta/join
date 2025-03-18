import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../contact-interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, AddContactDialogComponent, RouterModule],

  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent {
  firebase = inject(FirebaseService);
  isDialogOpen: boolean = false;
  isDeleteOpen: boolean = false;
  currentContact: ContactInterface | null = null;
  isEditDialogOpen: boolean = false;
  contactIsSuccessfully: boolean = false;
  
  @Output() openDetails = new EventEmitter<ContactInterface>();
  @Output() contactCreatedEvent = new EventEmitter<ContactInterface>();

  newlyAddedContacts = new Set<string>();


  openDialogDetails(contact: ContactInterface) {
      this.openDetails.emit(contact);
  }

  onContactCreated(contact: ContactInterface) { 
    this.contactCreatedEvent.emit(contact);
    this.contactIsSuccessfully = true;    
    this.newlyAddedContacts.add(contact.email);
    
    setTimeout(() => {
      const successElement = document.querySelector('.succesfull_content');
      
      if (successElement) {
        successElement.classList.add('dialog-closed'); 
      }

      setTimeout(() => {
        this.contactIsSuccessfully = false;
        this.newlyAddedContacts.delete(contact.email);
      }, 500);
    }, 1000);
  }

  openAddNewContacts() {
    this.isDialogOpen = true;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      this.isEditDialogOpen = false;
      setTimeout(() => {
        this.isDialogOpen = false;
        this.isDeleteOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
      this.isDeleteOpen = false;
    }
  }
}