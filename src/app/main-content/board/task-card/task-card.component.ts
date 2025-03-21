import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { TaskInterface } from '../task.interface';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input()
  item!: TaskInterface; 
  firebase = inject(FirebaseService);
}
