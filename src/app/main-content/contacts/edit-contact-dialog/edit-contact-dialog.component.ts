import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';

@Component({
  selector: 'app-edit-contact-dialog',
  imports: [],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss'
})
export class EditContactDialogComponent {
  firebase = inject(FirebaseService);

  isEdited: boolean = false;
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

  editContact(index: number) {
    this.isEdited = true;
    this.selectedContactIndex = index;
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

}
