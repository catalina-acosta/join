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
urgent: TaskInterface[] = [];

constructor() {
  this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
    this.tasks = tasks;
    this.filteredTasks = [...this.tasks]; // Anfangs alle Aufgaben anzeigen
  });
}

sortTasks() {
  this.todo = []; // Leere die Arrays vor dem erneuten Kategorisieren
  this.awaitFeedback = [];
  this.inProgress = [];
  this.done = [];

  this.filteredTasks.forEach((task) => {
    this.categorizeTask(task);
  });
}

sortTasksByPriority() {
  this.urgent = [];

  this.filteredTasks.forEach((task) => {
    this.categorizeTaskByPriority(task);
  })
}

categorizeTaskByPriority(task: TaskInterface) {
  if(task.priority === "urgent") {
    this.urgent.push(task);
  }
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

getTodoTaskCount() {
  this.sortTasks();
  return this.todo.length;
}

getAwaitFeedbackTaskCount() {
  this.sortTasks();
  return this.awaitFeedback.length;
}

getInProgressTaskCount() {
  this.sortTasks();
  return this.inProgress.length;
}

getDoneTasksCount() {
  this.sortTasks();
  return this.done.length;
}

getAllTaskCount() {
  return this.filteredTasks.length;
}

getUrgentTaskCount() {
  this.sortTasksByPriority();
  return this.urgent.length;
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