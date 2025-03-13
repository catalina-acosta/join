import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-contact-dialog',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss'
})
export class EditContactDialogComponent {
  firebase = inject(FirebaseService);
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() contactIndex: number | null = null;
  isEdited: boolean = false;
  formSubmitted: boolean = false;
  contactId: string = "";
  selectedContactIndex: number | null = null;
  editedContact = {
    fullname:'',
    firstname:'',
    lastname: '',
    email: '',
    phone:'',
    color: '',
  }

  onEditContact(contactForm: NgForm) {
    this.formSubmitted = true;
    if (contactForm.valid && this.contactIndex !== null) {
      this.editContact(this.contactIndex);
    }
  }

  editContact(index: number) {
    this.isEdited = true;
    const nameParts = this.editedContact.fullname.trim().split(' ');
    this.editedContact.firstname = this.toUpperCaseName(nameParts[0]);
    this.editedContact.lastname = this.toUpperCaseName(nameParts.slice(1).join(' ') || '');
    this.editedContact = {
      fullname: '',
      firstname: this.firebase.orderedContactsList[index].firstname,
      lastname: this.firebase.orderedContactsList[index].lastname,
      email: this.firebase.orderedContactsList[index].email,
      phone: this.firebase.orderedContactsList[index].phone,
      color: '',
    }
  }

  saveEdit() {
    if (this.contactId) {
      this.firebase.editContactToDatabase(this.contactId, this.editedContact)
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
