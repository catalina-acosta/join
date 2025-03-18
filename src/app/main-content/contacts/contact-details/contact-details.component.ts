import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactInterface } from '../contact-interface';
import { CommonModule } from '@angular/common';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';

@Component({
  selector: 'app-contact-details',
  standalone:true,
  imports: [CommonModule,EditContactDialogComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {
  @Input() contact!: ContactInterface;
  @Input() contactIsSuccessfully: boolean = false;
  currentContact!: ContactInterface;
  isEdited: boolean = false;
  isDialogOpen:boolean = false;  
  @Output() openDetails = new EventEmitter<ContactInterface>();

  onContactCreated(newContact: ContactInterface) {
    this.contact = newContact;
 
    if (!this.contact.id) {
      this.contactIsSuccessfully = true;
    setTimeout(() => {
      const successElement = document.querySelector('.succesfull_content');
      
      if (successElement) {
        successElement.classList.add('dialog-closed'); 
      }

      setTimeout(() => {
        this.contactIsSuccessfully = false;
      }, 500);
    }, 1000);
  }}

  openEditDialog() {
    this.isEdited = true; 
    // this.openDialogDetails(contact);
  }

  openDialogDetails(contact: ContactInterface) {
    this.currentContact = contact;
    // if (this.currentContact) {
    //   this.openDetails.emit(contact);
    // }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeDialog() { 
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
        dialogElement.classList.add('dialog-closed');
        // this.isDialogOpen = false;
        setTimeout(() => {
            this.isDialogOpen = false;

        }, 500);
    } else {
        this.isDialogOpen = false;
      }
  }
}


