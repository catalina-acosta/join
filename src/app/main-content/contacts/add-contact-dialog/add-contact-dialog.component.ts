import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactInterface } from '../contact-interface';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})
export class AddContactDialogComponent {
  firebase = inject(FirebaseService);
  @Input() contact!: ContactInterface;
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Output() contactCreatedEvent = new EventEmitter<ContactInterface>();

  formSubmitted: boolean = false;
  contactIsSuccessfully: boolean = false;

  newContact = {
    fullname: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    color: '',
  }

  onCreateContact(contactForm: NgForm) {
    this.formSubmitted = true;
    if (contactForm.valid) {
      this.addNewContact();
    }
  }

  addNewContact() {
    const nameParts = this.newContact.fullname.trim().split(' ');
    this.newContact.firstname = this.toUpperCaseName(nameParts[0]);
    this.newContact.lastname = this.toUpperCaseName(nameParts.slice(1).join(' ') || '');
    this.newContact.color = this.firebase.avatarColor[Math.floor(Math.random() * this.firebase.avatarColor.length)];

    this.firebase.addContactToData(this.newContact);
    this.contactCreatedEvent.emit(this.newContact);
    this.clearInputFeld();
  }

  toUpperCaseName(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  clearInputFeld() {
    this.newContact = {
      fullname: 'Name',
      firstname: '',
      lastname: '',
      email: 'Email',
      phone: 'Phone',
      color: '',
    }

    this.closeDialog();
  }

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  // onContactCreated(newContact: ContactInterface) {
  //   this.contact = newContact;
  //   this.contactIsSuccessfully = true;

  //   setTimeout(() => {
  //     this.contactIsSuccessfully = false;
  //   }, 3000);
  // }
}
