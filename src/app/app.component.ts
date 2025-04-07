/**
 * @file Root component of the Angular application.
 */

import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FirebaseService } from './shared/service/firebase.service';
import { SharedComponent } from "./shared/shared.component";
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedComponent, RouterModule, LogInComponent, SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /**
   * Firebase authentication instance
   */
  auth = inject(Auth);

  /**
   * Application title
   */
  title = 'join';

  /**
   * Firebase service instance
   */
  firebase = inject(FirebaseService);

  /**
   * Indicates if the user is logged in
   */
  isLoggedIn = false;

  /**
   * Indicates if a new user is signing up
   */
  newUser?: boolean;

  /**
   * Stores the user's name
   */
  usersName?: string;

  /**
   * Stores the current route
   */
  currentRoute: string = '';

  currentUser = this.auth.currentUser; 

  /**
   * Constructor for AppComponent
   * @param router - Angular Router instance
   */
  constructor(private router: Router) {
    this.firebase;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Navigating to:', event.url);
        // Add custom logic here to control what is shown
        if (event.navigationTrigger === 'popstate') {
          console.log('User clicked the back button');
          // Handle back navigation
        }
      }
    });

    if (this.auth) {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.isLoggedIn = true;
          this.router.navigate(['/']);
        } else {
          this.isLoggedIn = false;
          this.router.navigate(['/']);
        }
      });
    }
  }

  /**
   * Checks if the current page is either 'Imprint' or 'Privacy Policy'
   * @returns True if the page is Imprint or Privacy Policy, otherwise false
   */
  isPrivacyOrImprintPage(): boolean {
    return this.currentRoute === '/imprint' || this.currentRoute === '/privacy-policy';
  }

  /**
   * Handles login success by setting the user as logged in
   */
  onLoginSuccess() {
    this.isLoggedIn = true; 
  }
  

  /**
   * Navigates to the Sign-Up page
   */
  goToSignUp() {
    this.newUser = true;
  }
  
  /**
   * Logs out the user and redirects to the login page
   */
  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Resets the new user flag
   */
  resetNewUser() {
    this.newUser = false;
  }
}
