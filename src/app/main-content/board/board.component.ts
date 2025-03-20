import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskInterface } from './task.interface';

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  firebase = inject(FirebaseService);

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
    }
  }
}
