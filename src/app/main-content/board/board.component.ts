import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from './task.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, CardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent {
  firebase = inject(FirebaseService);
  searchQuery: string = '';
  isDialogOpen: boolean = false;
  tasks: TaskInterface[] = [
    //   { id: '1', title: 'Einkaufen', description: 'Apfel', date: '2025-03-22', priority: 'High', userId: '123', category: 'User Story', subtask: '' },
    //   { id: '2', title: 'Daily Stand UP', description: 'Project Besprechung', date: '2025-03-23', priority: 'Medium', userId: '456', category: 'Technical Task', subtask: '' },
    //   { id: '3', title: 'Arbeiten', description: 'Join Projekt', date: '2025-03-24', priority: 'Low', userId: '789', category: '', subtask: '' }
  ];

  filteredTasks: TaskInterface[] = [...this.tasks];

  filterTasks(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredTasks = this.tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }

  openCardDialog() {
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

      console.log("Task ID ", currentTask.id);
      console.log("Old status ", currentTask.priority);
      console.log("New status ", event.container.id);

      // Update the status of the task in the database (Parameter: taskId, newStatus)
      // this.data.updateTaskStatus(currentTask.id!, event.container.id);
    }
  }

}
