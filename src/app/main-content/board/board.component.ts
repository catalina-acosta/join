import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from './task.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  firebase = inject(FirebaseService);
   searchQuery: string = ''; 
  // tasks: TaskInterface[] = [
  //   { id: '1', title: 'Einkaufen', description: 'Apfel', date: '2025-03-22', priority: 'High', userId: '123', category: 'User Story', subtask: '' },
  //   { id: '2', title: 'Daily Stand UP', description: 'Project Besprechung', date: '2025-03-23', priority: 'Medium', userId: '456', category: 'Technical Task', subtask: '' },
  //   { id: '3', title: 'Arbeiten', description: 'Join Projekt', date: '2025-03-24', priority: 'Low', userId: '789', category: '', subtask: '' }
  // ];


   filteredTasks: TaskInterface[] = [...this.tasks]; 

  filterTasks(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    );
  }

}
