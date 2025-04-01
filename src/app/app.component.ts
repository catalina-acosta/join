import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { SharedComponent } from "./shared/shared.component";
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { EventEmitter } from 'stream';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, SharedComponent, RouterModule, LogInComponent, SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  firebase = inject(FirebaseService);
  isLoggedIn = false;
  newUser?: boolean = true;

  constructor() {
    this.firebase;
  }

  onLoginSuccess() {
    this.isLoggedIn = true; 
  }

  goToSignUp() {
    this.newUser = true;
  }
}
