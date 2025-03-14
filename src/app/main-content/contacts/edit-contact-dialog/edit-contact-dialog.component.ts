import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../contact-interface';

@Component({
  selector: 'app-edit-contact-dialog',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss'
})
export class EditContactDialogComponent {
  firebase = inject(FirebaseService);
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() contact!: ContactInterface; 
  
  formSubmitted: boolean = false;
  contactId: string = "";
  selectedContactIndex: number | null = null;
  editedContact = {
    fullname: '',
    firstname:'',
    lastname: '',
    email: '',
    phone:'',
    color: '',
  }

  onEditContact(contactForm: NgForm) {
    this.formSubmitted = true;
    if (contactForm.valid && this.contact.id) {
      this.editContact();
    }
  }

  editContact() {
    console.log('editing contact');
    const nameParts = this.editedContact.fullname.trim().split(' ');
    this.editedContact.firstname = this.toUpperCaseName(nameParts[0]);
    this.editedContact.lastname = this.toUpperCaseName(nameParts.slice(1).join(' ') || '');
    this.firebase.orderedContactsList.forEach((element) => {
      if(element.id === this.contact.id) {
        console.log('contact found: ', this.contact.id);
        
        this.editedContact = {
          fullname: '',
          firstname: element.firstname,
          lastname: element.lastname,
          email: element.email,
          phone: element.phone,
          color: '',
        }
        console.log('contact edited: ', this.editedContact);
        this.saveEdit();
      }
    })
  }

  saveEdit() {
    if (this.contact.id) {
      console.log("saving edit");
      
      this.firebase.editContactToDatabase(this.contact.id!, this.editedContact)
    }
  }

  toUpperCaseName(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  closeDialog() {
    this.closeDialogEvent.emit(); 
  }

}
