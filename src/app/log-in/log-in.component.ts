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
  loginError: string = '';
 

  constructor(private router: Router) {}
  
  signUp() {
    this.newUserOutput.emit();
  }
  
  loginUser() {
    this.formSubmitted = true;

    if (!this.login.email || !this.login.password) {
      this.loginError = "Check our email and password. Please try again.";
      return;
    }

    signInWithEmailAndPassword(this.auth, this.login.email, this.login.password)
      .then(() => {
        // const user = userCredential.user;
        this.loginError = '';
        this.loginSuccess.emit();
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.handleLoginError(error.code);
      });
   }

   handleLoginError(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-email':
        this.loginError = "Invalid email address.";
        break;
      case 'auth/user-not-found':
        this.loginError = "No user found with this email.";
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential': 
        this.loginError = "Incorrect password. Please try again.";
        break;
      case 'auth/too-many-requests':
        this.loginError = "Check our email and password. Please try again.";
        break;
      default:
        this.loginError = "Login failed. Please try again later.";
    }
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
