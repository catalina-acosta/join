import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { SharedComponent } from "./shared/shared.component";
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { getAuth, signOut } from '@angular/fire/auth';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, SharedComponent, RouterModule, LogInComponent, SignUpComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  firebase = inject(FirebaseService);
  isLoggedIn = false;
  newUser?: boolean;

  constructor(private router: Router) {
    this.firebase;
  }

  onLoginSuccess() {
    this.isLoggedIn = true; 
  }

  goToSignUp() {
    this.newUser = true;
  }
  
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error(error);
    });
  }

  resetNewUser() {
    this.newUser = false;
  }
}
