import { Component } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [ContactsListComponent, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
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
  
}
