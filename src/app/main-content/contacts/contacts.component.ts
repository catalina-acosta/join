import { Component } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-contacts',
  imports: [ContactsListComponent, DeleteDialogComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
