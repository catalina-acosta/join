import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskInterface } from '../task.interface';

@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
   @Output() closeDialogEvent = new EventEmitter<void>();
   @Input() item?: TaskInterface;

  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
