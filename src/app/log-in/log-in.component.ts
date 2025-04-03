import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../shared/service/users.service';

@Component({
  selector: 'app-log-in',
  standalone:true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  firebaseUsers = inject(UsersService); 
  auth = inject(Auth);

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() newUserOutput = new EventEmitter<void>();
  userLoggedIn: boolean = false;
  guestLoggedIn: boolean = false;
  formSubmitted: boolean = false;
  passwordVisible: boolean = false;
  passwordTyped: boolean = false;
  login = {
    email: "",
    password: "",
  }

  constructor(private router: Router) {}
  
  signUp() {
    this.newUserOutput.emit();
  }
  
  loginUser() {
    this.formSubmitted = true;

    if (!this.login.email || !this.login.password) {
      return;
    }

    signInWithEmailAndPassword(this.auth, this.login.email, this.login.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        this.loginSuccess.emit();
        this.router.navigate(['/']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
   }

  loginAsGuest() {
    this.loginSuccess.emit();
    this.router.navigate([''])
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  navigateToPrivacyPolicy() {
    this.loginSuccess.emit();
    this.router.navigate(['/privacy-policy']);
  }

  navigateToImprint() {
    this.loginSuccess.emit();
    this.router.navigate(['/imprint']);
  }

}
