import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';

@Component({
  selector: 'app-contacts-list',
  imports: [],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent {
  firebase = inject(FirebaseService);

  openDialogDetails() {
    console.log("opening dialog details");
  }
}
