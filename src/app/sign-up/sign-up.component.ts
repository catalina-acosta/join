import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule  } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { UsersService } from '../shared/service/users.service';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  firebaseUsers = inject(UsersService);
  formSubmitted: boolean = false; 
  // auth = inject(getAuth);
  @Output() resetNewUser = new EventEmitter<void>();
  signUp = {
    fullname: "",
    email: "",
    password: "",
    confirmedPassword: "",
  }

  passwordVisible: boolean = false;
  passwordTyped: boolean = false;
  confirmedPasswordVisible: boolean = false;
  confirmedPasswordTyped: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmedPasswordVisibility() {
    this.confirmedPasswordVisible = !this.confirmedPasswordVisible;
  }

  createNewUser() {
    // createUserWithEmailAndPassword(this.auth, this.signUp.email, this.signUp.password)
    //   .then((userCredential) => {
    //     // Signed up 
    //     const user = userCredential.user;
    //     console.log("new user created")
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   });
  }
}
