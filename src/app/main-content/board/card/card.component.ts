import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';
import { EditDialogComponent } from "../edit-dialog/edit-dialog.component";
import { DeletCardDialogComponent } from '../delet-card-dialog/delet-card-dialog.component';

@Component({
  selector: 'app-card',
  standalone:true,
  imports: [CommonModule, EditDialogComponent, DeletCardDialogComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
 firebase = inject(FirebaseService);
   @Output() closeDialogEvent = new EventEmitter<void>();
   @Input() item?: TaskInterface;
   private cdr = inject(ChangeDetectorRef);

   selectedItem?: TaskInterface;
   isDialogOpen: boolean = false;
   isDeleteOpen: boolean = false;

   onTaskDeleted() {
    this.isDeleteOpen = false; 
    this.closeDialogEvent.emit();
  }
  
  opendeleteDialog(item: TaskInterface){
    this.selectedItem = item;
    this.isDeleteOpen = true;
  }

  updateTask(updatedTask: TaskInterface) {
    this.firebase.updateTaskStatus(updatedTask.id!, updatedTask)
      .then(() => {
        this.item = { ...updatedTask }; // Direkt aktualisieren
        this.cdr.detectChanges(); // Manuell Änderungserkennung auslösen
        this.closeEditDialog();
      })
      .catch(error => console.error('Fehler beim Aktualisieren:', error));
  }
  
  
   formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB');
  }
  

   updateSubtaskStatus(taskId: string | undefined, subtaskIndex: number) {
    if (!this.item?.id || !this.item?.subtasks) return;

    this.item.subtasks[subtaskIndex].isCompleted = !this.item.subtasks[subtaskIndex].isCompleted;

    this.cdr.detectChanges();
    this.firebase.updateTaskStatus(this.item.id, { subtasks: this.item.subtasks, status: this.item.status })
      .then(() => {
        this.cdr.detectChanges(); 
      })
      .catch((error) => console.error('Error updating subtask:', error));
}

  closeDialog() {
    this.closeDialogEvent.emit();
  }
  
  openEditDialog(item: TaskInterface){
    this.selectedItem = item;
    this.isDialogOpen = true;
  }
  
   closeEditDialog(){
    this.isDialogOpen = false; 
    this.isDeleteOpen = false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
