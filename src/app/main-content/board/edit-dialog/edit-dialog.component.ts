import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  firebase = inject(FirebaseService);
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() item?: TaskInterface;

  isDialogOpen: boolean = false;
  
  closeDialog() {
    this.closeDialogEvent.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
