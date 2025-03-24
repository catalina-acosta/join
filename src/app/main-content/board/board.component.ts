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
} from '@angular/cdk/drag-drop';
import { CardComponent } from './card/card.component';
import { EditContactDialogComponent } from '../contacts/edit-contact-dialog/edit-contact-dialog.component';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, CardComponent, TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent {
  firebase = inject(FirebaseService);
  searchQuery: string = '';
  isDialogOpen: boolean = false;
  tasks: TaskInterface[] = [];
  filteredTasks: TaskInterface[] = [];
  selectedItem!: TaskInterface;

  constructor() {
    this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // Anfangs alle Aufgaben anzeigen
    });
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

  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      // this.isEditDialogOpen = false;
      setTimeout(() => {
        this.isDialogOpen = false;
        // this.isDeleteOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
      // this.isDeleteOpen = false;
    }
  }

  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const currentTask = event.container.data[event.currentIndex];

      // Update the status of the task in the database (Parameter: taskId, newStatus)
      this.firebase.updateTaskStatus(currentTask.id!, event.container.id);
    }
  }

}
