import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
   @Output() closeDialogEvent = new EventEmitter<void>();

  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
