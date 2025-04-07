import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Auth } from '@angular/fire/auth';

/**
 * Component for managing the sign-up process.
 */
@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  //#region Properties

  /**
   * Indicates whether the form has been submitted.
   */
  isFormSubmitted: boolean = false;

  /**
   * Firebase Auth instance for managing authentication.
   */
  auth = inject(Auth);

  /**
   * Event emitter to reset the new user status.
   */
  @Output() resetNewUser = new EventEmitter<void>();

  /**
   * Event emitter to emit the user's name.
   */
  @Output() usersName = new EventEmitter<string>();

  /**
   * Object to store sign-up form data.
   */
  signUp = {
    fullname: "",
    email: "",
    password: "",
    confirmedPassword: "",
  };

  /**
   * Indicates whether the privacy policy is accepted.
   */
  isPrivacyPolicyAccepted: boolean = false;

  /**
   * Flags for password visibility and typing.
   */
  passwordVisible: boolean = false;
  passwordTyped: boolean = false;
  confirmedPasswordVisible: boolean = false;
  confirmedPasswordTyped: boolean = false;

  /**
   * Flags for user status.
   */
  newUserAdded: boolean = false;
  existingUser: boolean = false;

  //#endregion

  //#region Constructor

  /**
   * Constructor for the SignUpComponent.
   * @param router - Angular Router for navigation.
   */
  constructor(private router: Router) {}

  //#endregion

  //#region Password Visibility

  /**
   * Toggles the visibility of the password field.
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Toggles the visibility of the confirmed password field.
   */
  toggleConfirmedPasswordVisibility() {
    this.confirmedPasswordVisible = !this.confirmedPasswordVisible;
  }

  //#endregion

  //#region Privacy Policy

  /**
   * Toggles the acceptance of the privacy policy.
   */
  setPrivacyPolicy() {
    this.isPrivacyPolicyAccepted = !this.isPrivacyPolicyAccepted;
  }

  //#endregion

  //#region Form Submission

  /**
   * Handles the submission of the sign-up form.
   * @param signUpForm - The sign-up form object.
   */
  onCreateNewUser(signUpForm: NgForm) {
    this.isFormSubmitted = true;
    if (signUpForm.valid && this.isPrivacyPolicyAccepted) {
      this.createNewUser(signUpForm);
    }
  }

  /**
   * Creates a new user using Firebase Authentication.
   * @param signUpForm - The sign-up form object.
   */
  createNewUser(signUpForm: NgForm) {
    createUserWithEmailAndPassword(this.auth, this.signUp.email, this.signUp.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.newUserAdded = true;
        this.updateUserName();
        setTimeout(() => {
          this.resetNewUserStatus();
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.displayErrorDialog();
        this.clearForm(signUpForm);
        setTimeout(() => {
          this.isFormSubmitted = false;
          this.existingUser = false;
          this.isPrivacyPolicyAccepted = false;
        }, 3000);
      });
  }

  //#endregion

  //#region User Management

  /**
   * Updates the user's display name in Firebase Authentication.
   */
  updateUserName() {
    if (this.auth) {
      if (this.auth.currentUser) {
        updateProfile(this.auth.currentUser, {
          displayName: this.signUp.fullname
        }).then(() => {
        }).catch((error) => {
          console.log("The name could not be saved.");
        });
      } else {
        console.error("No user is currently signed in.");
      }
    }
  }

  /**
   * Resets the new user status by emitting an event.
   */
  resetNewUserStatus() {
    this.resetNewUser.emit();
  }

  //#endregion

  //#region Error Handling

  /**
   * Displays an error dialog for existing users.
   */
  displayErrorDialog() {
    this.existingUser = true;
  }

  /**
   * Clears the sign-up form and resets its state.
   * @param signUpForm - The sign-up form object.
   */
  clearForm(signUpForm: NgForm) {
    signUpForm.reset();
    this.signUp = {
      fullname: "",
      email: "",
      password: "",
      confirmedPassword: "",
    };
    this.isPrivacyPolicyAccepted = false;
  }

  //#endregion

  //#region Navigation

  /**
   * Emits the user's name or a default value if the name is not provided.
   */
  showUsersName() {
    if (this.signUp.fullname) {
      this.usersName.emit(this.signUp.fullname);
    } else {
      this.usersName.emit('GuestLoggedIn');
    }
  }

  /**
   * Navigates to the privacy policy page.
   */
  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  /**
   * Navigates to the imprint page.
   */
  navigateToImprint() {
    this.router.navigate(['/imprint']);
  }

  //#endregion
}