import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone:true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  userLoggedIn: boolean = false;
  guestLoggedIn: boolean = false;

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() newUserOutput = new EventEmitter<void>();

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
  //   const auth = getAuth();
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in 
  //       const user = userCredential.user;

  //       this.loginSuccess.emit();
  //       this.router.navigate(['/']);

  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //     });
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
