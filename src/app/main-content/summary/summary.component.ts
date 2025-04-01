import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
guestLogIn: boolean = false;
nowDate = new Date;
currentHour = this.nowDate.getHours();


//get different greetings for different day times
getGreeting() {
  if(this.currentHour > 3 && this.currentHour < 11) {
    return 'Good morning';
  }
  else if(this.currentHour > 12 && this.currentHour < 16){
    return 'Good afternoon';
  }
  else if(this.currentHour > 17 && this.currentHour < 20){
    return 'Good evening';
  }
  else return 'Good night';
}



}