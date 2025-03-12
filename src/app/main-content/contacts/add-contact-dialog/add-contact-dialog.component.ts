import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-contact-dialog',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})
export class AddContactDialogComponent {
  firebase =inject(FirebaseService);

  @Output() closeDialogEvent = new EventEmitter<void>();
  formSubmitted = false;
  newContact = {
    fullname:'',
    firstname:'',
    lastname: '',
    email: '',
    phone:'',
  }

  onCreateContact(contactForm: NgForm) {
    this.formSubmitted = true;
    if (contactForm.valid) {
      this.addNewContact();
    }
  }

  addNewContact() {
    const nameParts = this.newContact.fullname.trim().split(' ');
    this.newContact.firstname = nameParts[0];
    this.newContact.lastname = nameParts.slice(1).join(' ') || '';

      this.firebase.addContactToData(this.newContact);
      this.clearInputFeld();
  }

  clearInputFeld(){
    this.newContact = {
    fullname: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    };
    this.closeDialog();
  }
  
  closeDialog() {
    this.closeDialogEvent.emit(); 
  }

}
