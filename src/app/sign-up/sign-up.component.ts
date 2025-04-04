import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule  } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { UsersService } from '../shared/service/users.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  firebaseUsers = inject(UsersService);
  isFormSubmitted: boolean = false; 
  auth = inject(Auth);
  @Output() resetNewUser = new EventEmitter<void>();

  
  signUp = {
    fullname: "",
    email: "",
    password: "",
    confirmedPassword: "",
  }
  isPrivacyPolicyAccepted: boolean = false;
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

  setPrivacyPolicy() {
    this.isPrivacyPolicyAccepted =!this.isPrivacyPolicyAccepted;
  }

  // submit form and create new user

  onCreateNewUser(signUpForm: NgForm) {
    this.isFormSubmitted = true;
    if (signUpForm.valid) {
      this.createNewUser();
    }
  }

  createNewUser() {
    createUserWithEmailAndPassword(this.auth, this.signUp.email, this.signUp.password)
      .then((userCredential) => {
        // Signed up 
        // updateProfile() add name
        const user = userCredential.user;
        console.log("new user created")
        this.updateUserName();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  updateUserName() {
    if (this.auth) {
      if (this.auth.currentUser) {
        updateProfile(this.auth.currentUser, {
          displayName: this.signUp.fullname
        }).then(() => {
          console.log("fullname saved: ", this.auth.currentUser?.displayName);
          
          // ...
        }).catch((error) => {
          console.log("the name could not be saved")
          // ...
        });
      } else {
        console.error("No user is currently signed in.");
      }
    }
  }

  redirectToLogIn() {

  }

  resetNewUserStatus() {
    this.resetNewUser.emit();
  }

}
