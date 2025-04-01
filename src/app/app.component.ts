import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { SharedComponent } from "./shared/shared.component";
import { LogInComponent } from './log-in/log-in.component';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, SharedComponent, RouterModule, LogInComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  firebase = inject(FirebaseService);
  isLoggedIn = false;

  constructor() {
    this.firebase;
  }

  onLoginSuccess() {
    this.isLoggedIn = true; 
  }
}
