import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskInterface } from '../../board/task.interface';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {
  taskTitle: string = '';
  taskDescription: string = '';
  dueDate: string = '';
  taskPriority: string = '';
  assignedTo: string = '';
  taskCategory: string = '';
  subtasks: { name: string, isEditing: boolean }[] = []; // Array für Subtasks
  subtaskInput: string = ''; // Model für das Eingabefeld
  formSubmitted: boolean = false;
    newTask: TaskInterface = {
      title: "",
      description: "",
      date: "",
      priority: "",
      assignedToUserId: [],
      status: "",
      category: "",
      subtasks: []
    }

  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push({ name: this.subtaskInput.trim(), isEditing: false }); // Subtask zur Liste hinzufügen
      this.subtaskInput = ''; // Eingabefeld leeren
    }
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1); // Subtask entfernen
  }

  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
    setTimeout(() => {
      const inputElement = document.getElementById(`subtask-input-${index}`) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  }

  saveSubtask(index: number) {
    this.subtasks[index].isEditing = false;
  }

  handleKeyUp(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      this.saveSubtask(index);
    }
  }

  closeDialog() {
    // Logic to close the dialog
  }

  onCreateTask(taskForm: NgForm) {
    this.formSubmitted = true; 
    if(this.formSubmitted) {
      this.createNewTask();
    }
  }

  createNewTask() {
    
  }
}