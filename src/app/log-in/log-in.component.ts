import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  userLoggedIn: boolean = false;
  guestLoggedIn: boolean = false;

  @Output() loginSuccess = new EventEmitter<void>();

  formSubmitted: boolean = false; 
  login= {
    email: "",
    password: "",
  }

 constructor(private router: Router) {}
 loginUser() {
  this.userLoggedIn = true;
  this.loginSuccess.emit();
    this.router.navigate(['/']);
}

loginAsGuest(){
  this.guestLoggedIn = true;
  this.loginSuccess.emit();
  this.router.navigate([''])
}
 
}
