import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from './task.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task/add-task-dialog/add-task-dialog.component'; 
import { Router } from '@angular/router';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, TaskCardComponent, AddTaskDialogComponent, MatDialogModule, CardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent {
  firebase = inject(FirebaseService);
  searchQuery: string = '';
  isAddDialogOpen: boolean = false;
  tasks: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  isDragging: boolean = false;
  draggingCardId: string | null = null;
  isScrolling: boolean = false;
  selectedItem!: TaskInterface;
  isDialogOpen: boolean = false;

  constructor(private dialog: MatDialog, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // Anfangs alle Aufgaben anzeigen
    });
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

// #region add-task-dialog

handleResize() {
  if (isPlatformBrowser(this.platformId) && window.innerWidth <= 900 && this.isAddDialogOpen) {
    this.isAddDialogOpen = false;this.router.navigate(['/add-task']);
  }
}

ngOnDestroy() {
  if (isPlatformBrowser(this.platformId)) {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

  openAddTask() {
    if (window.innerWidth <= 900) {
      this.isAddDialogOpen = false; 
      this.router.navigate(['/add-task']);
    } else {
      this.isAddDialogOpen = true;
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeAddDialog() {
    setTimeout(() => {
      this.isAddDialogOpen = false;
      // this.isDeleteOpen = false;
    }, 500);
  }

  receiveEmitFromDialog(dialogClosed: boolean) {
    this.isAddDialogOpen = false;
  }
//#endregion

// #region filter-tasks

  filterTasks(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter(task =>
      task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)
    );
  }

  filterTasksByStatusAndQuery(status: string): TaskInterface[] {
    return this.filteredTasks.filter(task =>
      task.status === status &&
      (task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }
//#endregion


// #region drag-and-drop
  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (this.isScrolling) {
      return; // Dragging blockieren, wenn gescrollt wurde
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      const currentTask = event.container.data[event.currentIndex];
      this.firebase.updateTaskStatus(currentTask.id!, { status: event.container.id });
    }
    
    // const cardElement = event.item.element.nativeElement;
    // if (this.isDragging) {
    //   const rotation = -5;
    //   cardElement.style.transform = `rotate(${rotation}deg)`;
    // }
  }
//#endregion

openCardDialog(item: TaskInterface) {
  this.selectedItem = item;
  this.isDialogOpen = true;
}

// stopPropagation(event: Event) {
//   event.stopPropagation();
// }


closeDialog() {
  const dialogElement = document.querySelector('.custom-dialog');

  if (dialogElement) {
    dialogElement.classList.add('dialog-closed');
    setTimeout(() => {
      this.isDialogOpen = false;
    }, 500);
  } else {
    this.isDialogOpen = false;
  }
}
}
