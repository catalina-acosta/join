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
  nowDate = new Date;                       //get actual date
  currentHour = this.nowDate.getHours();    //get what time is it now
  tasks: TaskInterface[] = [];              //all tasks in Board

  todo: TaskInterface[] = [];               //tasks in Board with todo status
  inProgress: TaskInterface[] = [];         //in Progress tasks in Board with in Progress status
  awaitFeedback: TaskInterface[] = [];      //tasks in Board with await Feedback status
  done: TaskInterface[] = [];               //tasks in Board with done status
  urgent: TaskInterface[] = [];             //tasks in Board with urgent category
  filteredTasks: TaskInterface[] = [];      //tasks before categorizing according to status

auth = getAuth();                           //authentification of user
currentUser = this.auth.currentUser         //actual user, where his name and dates can be shown

showGreeting: boolean = false;              //show greeting screen at mobile view
showMainContent: boolean = false;           //show rest of the content in mobile view
greetingShown: boolean = false;             //checks, if the greeting screen was already shown

  user: UserInterface = {                   //user interface for access his files
    id: '',
    fullname: '',
    email: ''
  };


  constructor(private firebase: FirebaseService, private router: Router,) {
    this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // shows at the beginning all of the tasks
    });
  }
/**
 * shows greetings by first site view in one session
 */
  ngOnInit() {
    if(this.getGreetingShownFromSessionStorage() == 'true'){
      this.greetingShown = true;
    }
    this.showGreetingOnce();
  }

  /**
   * checks, if the screen is ready for mobile view
   */
  showGreetingOnce() {
    console.log(this.currentUser?.displayName);
    
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
      this.showGreeting = false;
      this.showMainContent = true;
    }
    else {
      this.showGreeting = true;
      this.showMainContent = true;
    }
  }

  /**
   * save the greetingsShown boolean in session storage for greeting only be shown once in a session
   */
  setGreetingShownInSessionStorage() {
    if(this.greetingShown) {
      sessionStorage.setItem('greetingShown', 'true');
    }
    
  }

  /**
   * 
   * @returns value of greetingShown, which was stored in session storage
   */
  getGreetingShownFromSessionStorage() {
    return sessionStorage.getItem('greetingShown');
  }

  /**
   * empty all arrays for clear categorization of tasks according to status
   */
  sortTasks() {
    this.todo = [];    
    this.awaitFeedback = [];
    this.inProgress = [];
    this.done = [];

    this.filteredTasks.forEach((task) => {
      this.categorizeTask(task);
    });
  }

  /**
   * 
   * @returns 
   */
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

/**
 * sort all task with an urgent priority and push them in an separate array
 */
  sortTasksByPriority() {
    this.urgent = [];

    this.filteredTasks.forEach((task) => {
      if (task.priority === "urgent") {
        this.urgent.push(task);
      }
    })
  }

/**
 * 
 * @param task 
 * @returns 
 */
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