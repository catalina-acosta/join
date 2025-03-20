import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  firebase = inject(FirebaseService);

  todo = []
}
