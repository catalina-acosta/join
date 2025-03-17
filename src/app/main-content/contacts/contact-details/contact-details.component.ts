import { Component, inject, Input } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
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
  firebase = inject(FirebaseService);
  @Input() contact!: ContactInterface;
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
