import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone:true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() newUserOutput = new EventEmitter<void>();

  formSubmitted: boolean = false; 
  login= {
    email: "",
    password: "",
  }

  constructor(private router: Router) {}
  loginUser() {
    this.loginSuccess.emit();
      this.router.navigate(['/']);
  }

  loginAsGuest(){
    this.loginSuccess.emit();
    this.router.navigate([''])
  }

  signUp() {
    this.newUserOutput.emit();
  }
  
}
