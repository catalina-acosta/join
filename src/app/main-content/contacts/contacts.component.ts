import { Component } from '@angular/core';
import { ContactsListComponent } from './contacts-list/contacts-list.component';

@Component({
  selector: 'app-contacts',
  imports: [ContactsListComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
