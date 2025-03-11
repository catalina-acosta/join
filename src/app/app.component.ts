import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { SharedComponent } from "./shared/shared.component";
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { AddContactDialogComponent } from "./main-content/contacts/add-contact-dialog/add-contact-dialog.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedComponent, ContactsComponent, AddContactDialogComponent, AddContactDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  firebase = inject(FirebaseService);

  constructor() {
    this.firebase;
  }
}
