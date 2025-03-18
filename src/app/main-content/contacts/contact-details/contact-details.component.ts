import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ContactInterface } from '../contact-interface';
import { CommonModule } from '@angular/common';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { RouterModule } from '@angular/router';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-contact-details',
  standalone:true,
  imports: [CommonModule,EditContactDialogComponent, RouterModule,  DeleteDialogComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {
  @Input() contact!: ContactInterface;
  @Input() contactIsSuccessfully: boolean = false;
  currentContact!: ContactInterface;
  isEdited: boolean = false;
  isDeleteOpen: boolean = false;
  isDialogOpen:boolean = false;  
  menuOpen = false;
  @Output() openDetails = new EventEmitter<ContactInterface>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
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

  openDeleteContact() {
    this.isDeleteOpen = true;
    
    // if (this.currentContact) {
    //   console.log('ID:', this.currentContact.id);
    //   console.log('Name:', `${this.currentContact.firstname} ${this.currentContact.lastname}`);
    //   console.log('Color:', this.currentContact.color);
    // }
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeDialog() { 
    const dialogElement = document.querySelector('.custom-dialog');
    this.isDialogOpen = false;
    if (dialogElement) {
        dialogElement.classList.add('dialog-closed');
        this.isDialogOpen = false;
        setTimeout(() => {
          this.isDialogOpen = false;
          this.isDeleteOpen = false;
          this.isEdited = false;

        }, 500);
    } else {
        this.isDialogOpen = false;
      }
  }

  // HostListener für Klicks überall auf der Seite
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    
    // Überprüfen, ob das geklickte Element Teil des Three-Dot-Menüs oder des Dropdowns ist
    if (!targetElement.closest('.three_dot_menu') && !targetElement.closest('.dropdown_menu')) {
      this.menuOpen = false;
    }
  }
}


