import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { TaskInterface } from '../task.interface';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, CardComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input()
  item!: TaskInterface; 
  firebase = inject(FirebaseService);
  completedSubtasks: number = 0;
  isDragging: boolean = false;
  draggingCardId: string | null = null;
  selectedItem!: TaskInterface;
  isDialogOpen: boolean = false;


  getCompletedPercentage(): number {
    if (!this.item.subtasks || this.item.subtasks.length === 0) {
      return 0;
    }
    this.completedSubtasks = this.item.subtasks.filter(subtask => subtask.isCompleted).length;
    return (this.completedSubtasks / this.item.subtasks.length) * 100;
  }

  onDragStart(item:TaskInterface): void {
    console.log("dragging card");
    
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
      setTimeout(() => {
        this.isDialogOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
    }
  }
}
