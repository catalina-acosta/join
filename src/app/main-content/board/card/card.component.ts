import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { EditContactDialogComponent } from '../../contacts/edit-contact-dialog/edit-contact-dialog.component';
import { EditDialogComponent } from "../edit-dialog/edit-dialog.component";

@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule, EditDialogComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
 firebase = inject(FirebaseService);
   @Output() closeDialogEvent = new EventEmitter<void>();
   @Input() item?: TaskInterface;

   selectedItem?: TaskInterface;
   isDialogOpen: boolean = false;

  closeDialog() {
    this.closeDialogEvent.emit();
  }
 
  openEditDialog(item: TaskInterface){
    this.selectedItem = item;
    this.isDialogOpen = true;
    console.log(this.selectedItem);
  }

  
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
