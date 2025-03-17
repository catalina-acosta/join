import { Component, inject, Input } from '@angular/core';
import { ContactInterface } from '../contact-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {
  @Input() contact!: ContactInterface;
  @Input() contactIsSuccessfully: boolean = false;
  
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

}
