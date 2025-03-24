import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';

@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
 firebase = inject(FirebaseService);
   @Output() closeDialogEvent = new EventEmitter<void>();
   @Input() item?: TaskInterface;

  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
