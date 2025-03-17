import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { CommonModule } from '@angular/common';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { log } from 'console';
import { loadavg } from 'os';
import { ContactInterface } from '../contact-interface';



@Component({
  selector: 'app-contacts-list',
  standalone:true,
  imports: [CommonModule, AddContactDialogComponent, EditContactDialogComponent, DeleteDialogComponent, DeleteDialogComponent],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent {
  firebase = inject(FirebaseService);
  isDialogOpen:boolean = false;  
  isDeleteOpen:boolean = false;
  currentContact: ContactInterface| null = null;
  isEditDialogOpen:boolean = false;

  @Output() contactCreated = new EventEmitter<void>();

  openDialogDetails() {
    console.log("opening dialog details");
  }

  openAddNewContacts() {
    this.isDialogOpen = true;
  }

  openEditDialog(index: number) {
    this.isEditDialogOpen = true;
    this.currentContact = this.firebase.orderedContactsList[index];
    if (this.currentContact) {
      console.log('ID:', this.currentContact.id);
      console.log('Name:', `${this.currentContact.firstname} ${this.currentContact.lastname}`);
      console.log('Color:', this.currentContact.color);
    }
  }

  openDeleteContact(index: number){
    this.isDeleteOpen = true;  
    this.currentContact = this.firebase.orderedContactsList[index];
    if (this.currentContact) {
      console.log('ID:', this.currentContact.id);
      console.log('Name:', `${this.currentContact.firstname} ${this.currentContact.lastname}`);
      console.log('Color:', this.currentContact.color);
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

closeDialog() { 
  const dialogElement = document.querySelector('.custom-dialog');
  
  if (dialogElement) {
      dialogElement.classList.add('dialog-closed');

      setTimeout(() => {
          this.isDialogOpen = false;
          this.isDeleteOpen = false;
      }, 500);
  } else {
      this.isDialogOpen = false;
      this.isDeleteOpen = false;
  }
}

onContactCreated() {
  this.contactCreated.emit();
}

}
