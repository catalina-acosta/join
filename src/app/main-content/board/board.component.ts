import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from './task.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import { CardComponent } from './card/card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task/add-task-dialog/add-task-dialog.component'; 
import { Router } from '@angular/router';
import { AddTaskComponent } from "../add-task/add-task.component";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, CardComponent, TaskCardComponent, AddTaskDialogComponent, MatDialogModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent {
  firebase = inject(FirebaseService);
  searchQuery: string = '';
  isDialogOpen: boolean = false;
  isAddDialogOpen: boolean = false;
  tasks: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  selectedItem!: TaskInterface;
  isDragging: boolean = false;
  draggingCardId: string | null = null;
  private scrollThreshold = 100; // Distance from the edge to trigger scrolling
  private scrollSpeed = 10; // Speed of scrolling


  constructor(private dialog: MatDialog, private router: Router) {
    this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // Anfangs alle Aufgaben anzeigen
    });
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  onDragMoved(event: CdkDragMove): void {
    const viewportWidth = window.innerWidth; // Get the width of the viewport
    const cursorX = event.pointerPosition.x; // Get the horizontal position of the drag cursor
  
    // Scroll left if the cursor is near the left edge of the viewport
    if (cursorX < this.scrollThreshold) {
      window.scrollBy({ left: -this.scrollSpeed, behavior: 'smooth' });
    }
  
    // Scroll right if the cursor is near the right edge of the viewport
    if (cursorX > viewportWidth - this.scrollThreshold) {
      window.scrollBy({ left: this.scrollSpeed, behavior: 'smooth' });
    }
  }

  handleResize() {
    if (window.innerWidth <= 900 && this.isAddDialogOpen) {
      this.isAddDialogOpen = false; // Schließe den Dialog
      this.router.navigate(['/add-task']); // Navigiere zur Add-Task-Komponente
    }
  }

  ngOnDestroy() {
    // Entferne den Event-Listener, um Speicherlecks zu vermeiden
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  openAddTask() {
    if (window.innerWidth <= 900) {
      this.isAddDialogOpen = false; 
      this.router.navigate(['/add-task']);
    } else {
      this.isAddDialogOpen = true;
    }
  }

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

  openCardDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeAddDialog() {
    setTimeout(() => {
      this.isDialogOpen = false;
      // this.isDeleteOpen = false;
    }, 500);
}
  
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

  receiveEmitFromDialog(dialogClosed: boolean) {
    this.isAddDialogOpen = false;
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
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
  
  onDragStart(item:TaskInterface): void {
    if (item && item.id) {
      this.isDragging = true;
      
      this.draggingCardId = item.id; // Set the ID of the dragged card
      console.log('Drag started for card ID:', item.id); // Debugging
    }
  }

  onDragEnd(item:TaskInterface): void {
    if (item && item.id) {
      this.isDragging = false;
      this.draggingCardId = null; // Reset the dragged card ID
      console.log('Drag ended for card ID:', item.id); // Debugging
    }
  }

  isCardDragging(cardId: string): boolean {
  return this.draggingCardId === cardId;
  }

}
