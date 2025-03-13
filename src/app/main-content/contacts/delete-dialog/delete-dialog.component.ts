import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../shared/service/firebase.service';

@Component({
  selector: 'app-delete-dialog',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  firebaseService =inject(FirebaseService);
  // contactId?: string= '';

  // deleteItem(index:number){
  //   this.contactId = this.firebaseService.contactsList[index].id;
  //   if(this.contactId){
  //     this.firebaseService.deleteContactFromData(this.contactId);
  //   }
  // }

  closeDialog(){
    
  }
}
