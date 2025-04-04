import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from '../board/task.interface';
import { collectionData, Firestore, collection } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { UserInterface } from '../../log-in/user.interface';
import { UsersService } from '../../shared/service/users.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  nowDate = new Date;
  currentHour = this.nowDate.getHours();
  tasks: TaskInterface[] = [];

  todo: TaskInterface[] = [];
  inProgress: TaskInterface[] = [];
  awaitFeedback: TaskInterface[] = [];
  done: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  urgent: TaskInterface[] = [];

auth = getAuth();
currentUser = this.auth.currentUser

  showGreeting: boolean = false;
  showMainContent: boolean = false;
  greetingShown: boolean = false;

  user: UserInterface = {
    id: '',
    fullname: '',
    email: ''
  };


  constructor(private firebase: FirebaseService, private router: Router,) {
    this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // Anfangs alle Aufgaben anzeigen
    });
  }

  ngOnInit() {
    if(this.getGreetingShownFromSessionStorage() == 'true'){
      this.greetingShown = true;
    }
    this.showGreetingOnce();
  }

  // checkScreenWidth() {
  //   if(window.innerWidth <= 900) {
  //     if(!this.greetingShown) {
  //     setTimeout(() => {
  //       this.showGreeting = false;
  //       this.showMainContent = true;
  //       this.greetingShown = true;
  //     }, 2000);
  //     this.showGreeting = true;
  //     }
  //     else {
  //       this.showGreeting = false;
  //       this.showMainContent = true;
  //     }
  //   }
  //   else {
  //     if(!this.greetingShown){
  //       this.showGreeting = true;
  //     this.showMainContent = true;
  //     }
  //     else if(this.greetingShown) {
  //       this.showGreeting = false;
  //       this.showMainContent = true;
  //     }
      
  //   }
  // }

  showGreetingOnce() {
    if (window.innerWidth <= 900 && !this.greetingShown) {
      this.showGreeting = true;
      setTimeout(() => {
        this.showGreeting = false;
        this.showMainContent = true;
        this.greetingShown = true;
        this.setGreetingShownInSessionStorage();
      }, 5000);
    }
    else if (window.innerWidth <= 900 && this.getGreetingShownFromSessionStorage() == 'true'){
      console.log('else if part mit bedingung in local storage', this.getGreetingShownFromSessionStorage());
      this.showGreeting = false;
      this.showMainContent = true;
    }
    else {
      this.showGreeting = true;
      this.showMainContent = true;
    }
  }

  setGreetingShownInSessionStorage() {
    if(this.greetingShown) {
      sessionStorage.setItem('greetingShown', 'true');
    }
    
  }

  getGreetingShownFromSessionStorage() {
    return sessionStorage.getItem('greetingShown');
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

  getUrgentTaskWithLowestDate(): string {
    this.sortTasksByPriority();
    if (this.urgent.length === 0) {
      return 'No urgent Tasks';
    } else {
      let taskWithLowestDate: TaskInterface = this.urgent[0];
      this.urgent.forEach((urgentTask) => {
        if (urgentTask.date) {
          const currentDate = new Date(urgentTask.date);
          const lowestDate = new Date(taskWithLowestDate.date || '');
          if (currentDate < lowestDate) {
            taskWithLowestDate = urgentTask;
          }
        }
      });
      return this.transformUrgentTaskDate(taskWithLowestDate);
    }
  }

  transformUrgentTaskDate(task: TaskInterface) {
    if (task.date) {
      const date = new Date(task.date);
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
      return formattedDate;
    } else {
      return 'No date found';
    }
  }

  sortTasksByPriority() {
    this.urgent = [];

    this.filteredTasks.forEach((task) => {
      this.categorizeTaskByPriority(task);
    })
  }

  categorizeTaskByPriority(task: TaskInterface) {
    if (task.priority === "urgent") {
      this.urgent.push(task);
    }
  }

  categorizeTask(task: TaskInterface) {
    if (task.status === "todo") {
      this.todo.push(task);
    } else if (task.status === "awaitFeedback") {
      this.awaitFeedback.push(task);
    } else if (task.status === "inProgress") {
      this.inProgress.push(task);
    } else if (task.status === "done") {
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
    if (this.currentHour > 3 && this.currentHour < 12) {
      return 'Good morning';
    }
    if (this.currentHour >= 12 && this.currentHour < 18) {
      return 'Good afternoon';
    }
    if (this.currentHour >= 18 && this.currentHour <= 19) {
      return 'Good evening';
    }
    else return 'Good night';
  }


navigateToBoardView() {
  this.router.navigate(['/board']);
}

navigateToDetailWithFragment(sectionId: string) {
  this.router.navigate(['/board'], { fragment: sectionId });
}


}