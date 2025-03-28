import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { TaskInterface } from '../task.interface';

@Component({
  selector: 'app-delet-card-dialog',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './delet-card-dialog.component.html',
  styleUrl: './delet-card-dialog.component.scss'
})
export class DeletCardDialogComponent {
 firebase =inject(FirebaseService);
  @Input() item?: TaskInterface;
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Output() contactDeletedEvent = new EventEmitter<void>();

  deleteItem() {
    if (this.item?.id) {
      this.firebase.deleteTaskFromData(this.item.id)
        .then(() => {
          this.contactDeletedEvent.emit();
          this.closeDialog();
        })
        .catch((error) => {
          console.error("Fehler beim Löschen der Aufgabe: ", error);
        });
    }
  }
  
  

  closeDialog() {
    this.closeDialogEvent.emit();
  }
}
