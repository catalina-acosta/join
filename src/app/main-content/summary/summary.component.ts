import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from '../board/task.interface';
import { collectionData, Firestore, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
firebase = inject(FirebaseService);

nowDate = new Date;
currentHour = this.nowDate.getHours();
tasks: TaskInterface[] = [];

todo: TaskInterface[] = [];
inProgress: TaskInterface[] = [];
awaitFeedback: TaskInterface[] = [];
done: TaskInterface[] = [];
filteredTasks: TaskInterface[] = [];

constructor() {
  this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
    this.tasks = tasks;
    this.filteredTasks = [...this.tasks]; // Anfangs alle Aufgaben anzeigen
  });
}

categorizeTask(task: TaskInterface){
  if(task.status === "todo") {
    this.todo.push(task);
  } else if(task.status === "awaitFeedback") {
    this.awaitFeedback.push(task);
  } else if(task.status === "inProgress") {
    this.inProgress.push(task);
  } else if(task.status === "done") {
    this.done.push(task);
  }
}



//get different greetings for different day times
getGreeting() {
  if(this.currentHour > 3 && this.currentHour < 11) {
    console.log(this.filteredTasks);
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