import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { ContactsComponent } from './main-content/contacts/contacts.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContactsComponent],
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
