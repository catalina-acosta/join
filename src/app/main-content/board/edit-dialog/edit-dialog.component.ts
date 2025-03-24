import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { FirebaseService } from '../../../shared/service/firebase.service';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent implements AfterViewInit {
  firebase = inject(FirebaseService);
  @Output() closeDialogEvent = new EventEmitter<void>();
  @Input() item?: TaskInterface;

  private cdr = inject(ChangeDetectorRef);  // Manuelle Injektion von ChangeDetectorRef

  isDialogOpen: boolean = false;

  closeDialog() {
    this.closeDialogEvent.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  saveEditedTask() {
    if (this.item?.id && this.item?.date) {
      // Datum von yyyy-MM-dd nach dd/MM/yyyy umwandeln
      const [year, month, day] = this.item.date.split('-');
      this.item.date = `${day}/${month}/${year}`;
  
      console.log('Speichere Aufgabe mit aktualisiertem Datum:', this.item);
  
      // Firebase-Aufruf zum Aktualisieren der Aufgabe
      this.firebase.updateTaskStatus(this.item.id, {
        title: this.item.title,
        description: this.item.description,
        date: this.item.date,
        priority: this.item.priority,
        assignedToUserId: this.item.assignedToUserId,
        status: this.item.status,
        category: this.item.category,
        subtasks: this.item.subtasks
      }).then(() => {
        console.log('Aufgabe erfolgreich aktualisiert!');
        this.closeDialog(); // Schließe den Dialog nach erfolgreichem Speichern
      }).catch((error) => {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
      });
    }
  }
  
  ngOnInit() {
    if (this.item?.date) {
      console.log('Originales Datum:', this.item.date);
  
      // Falls das Datum im Format dd/MM/yyyy gespeichert ist
      const [day, month, year] = this.item.date.split('/'); 
      const formattedDate = `${year}-${month}-${day}`; 
  
      // Datum **ohne Zeitzonen-Probleme** umwandeln
      const date = new Date(`${formattedDate}T00:00:00`);
  
      if (!isNaN(date.getTime())) {
        // Manuelle Formatierung statt `toISOString()`
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Monat +1 da JS Monate von 0-11 zählt
        const dd = String(date.getDate()).padStart(2, '0');
        this.item.date = `${yyyy}-${mm}-${dd}`;
        
        console.log('Formatiertes Datum:', this.item.date);
      } else {
        console.error('Das Datum ist ungültig:', this.item.date);
      }
    } else {
      console.warn('Kein Datum vorhanden für das Item');
    }
  }
  

  ngAfterViewInit() {
    if (this.item?.date) {
      this.cdr.detectChanges();
    }
  }
}
