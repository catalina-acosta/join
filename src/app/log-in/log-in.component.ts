import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@firebase/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  formSubmitted: boolean = false;
  passwordVisible: boolean = false;
  passwordTyped: boolean = false;
  login = {
    email: "",
    password: "",
  }

  constructor(private router: Router) { }

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
}
