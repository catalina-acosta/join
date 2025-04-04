import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';
import { TaskInterface } from './task.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task/add-task-dialog/add-task-dialog.component';
import { Router } from '@angular/router';
import { CardComponent } from './card/card.component';
import { ActivatedRoute } from '@angular/router';

/**
 * Component for managing and displaying the task board.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDrag, TaskCardComponent, AddTaskDialogComponent, MatDialogModule, CardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  //#region Properties

  /**
   * Firebase service instance for interacting with Firestore.
   */
  firebase = inject(FirebaseService);

  /**
   * Search query for filtering tasks.
   */
  searchQuery: string = '';

  /**
   * Flag to indicate whether the "Add Task" dialog is open.
   */
  isAddDialogOpen: boolean = false;

  /**
   * List of all tasks fetched from Firestore.
   */
  tasks: TaskInterface[] = [];

  /**
   * List of tasks filtered based on the search query.
   */
  filteredTasks: TaskInterface[] = [];

  /**
   * Flag to indicate whether a task is being dragged.
   */
  isDragging: boolean = false;

  /**
   * ID of the currently dragged card.
   */
  draggingCardId: string | null = null;

  /**
   * Flag to indicate whether the page is scrolling.
   */
  isScrolling: boolean = false;

  /**
   * The currently selected task for the details dialog.
   */
  selectedItem!: TaskInterface;

  /**
   * Flag to indicate whether the task details dialog is open.
   */
  isDialogOpen: boolean = false;

  //#endregion

  //#region Constructor

  /**
   * Constructor for the BoardComponent.
   * @param dialog - Material dialog service for managing dialogs.
   * @param router - Angular router for navigation.
   * @param platformId - Platform ID for detecting browser or server.
   * @param route - Activated route for handling route fragments.
   */
  constructor(private dialog: MatDialog, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private route: ActivatedRoute) {
    this.firebase.tasksList$.subscribe((tasks: TaskInterface[]) => {
      this.tasks = tasks;
      this.filteredTasks = [...this.tasks]; // Initially display all tasks
    });

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

  //#endregion

  //#region Lifecycle Hooks

  /**
   * Scrolls to a specific section of the page based on the route fragment.
   */
  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  /**
   * Cleans up event listeners when the component is destroyed.
   */
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  //#endregion

  //#region Add Task Dialog

  /**
   * Opens the "Add Task" dialog or navigates to the "Add Task" page based on screen width.
   */
  openAddTask() {
    if (window.innerWidth <= 900) {
      this.isAddDialogOpen = false;
      this.router.navigate(['/add-task']);
    } else {
      this.isAddDialogOpen = true;
    }
  }

  /**
   * Closes the "Add Task" dialog with a delay.
   */
  closeAddDialog() {
    setTimeout(() => {
      this.isAddDialogOpen = false;
    }, 500);
  }

  /**
   * Handles the event emitted from the "Add Task" dialog to close it.
   * @param dialogClosed - Boolean indicating whether the dialog was closed.
   */
  receiveEmitFromDialog(dialogClosed: boolean) {
    this.isAddDialogOpen = false;
  }

  //#endregion

  //#region Task Filtering

  /**
   * Filters tasks based on the search query.
   */
  filterTasks() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter(task =>
      task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)
    );
  }

  /**
   * Filters tasks by status and search query.
   * @param status - The status to filter tasks by.
   * @returns A list of tasks matching the status and search query.
   */
  filterTasksByStatusAndQuery(status: string): TaskInterface[] {
    return this.filteredTasks.filter(task =>
      task.status === status &&
      (task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  //#endregion

  //#region Drag-and-Drop

  /**
   * Handles the drag-and-drop functionality for tasks.
   * @param event - The drag-and-drop event.
   */
  drop(event: CdkDragDrop<TaskInterface[]>) {
    if (this.isScrolling) {
      return; // Block dragging if scrolling occurred
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const currentTask = event.container.data[event.currentIndex];
      this.firebase.updateTaskStatus(currentTask.id!, { status: event.container.id });
    }
  }

  //#endregion

  //#region Task Details Dialog

  /**
   * Opens the task details dialog for the selected task.
   * @param item - The task to display in the dialog.
   */
  openCardDialog(item: TaskInterface) {
    this.selectedItem = item;
    this.isDialogOpen = true;
  }

  /**
   * Closes the task details dialog with an animation.
   */
  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');
    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');
      setTimeout(() => {
        this.isDialogOpen = false;
      }, 500);
    } else {
      this.isDialogOpen = false;
    }
  }

  //#endregion

  //#region Utility Methods

  /**
   * Stops event propagation to prevent unintended behavior.
   * @param event - The event to stop propagation for.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Handles window resize events and navigates to the "Add Task" page if the screen width is below 900px.
   */
  handleResize() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth <= 900 && this.isAddDialogOpen) {
      this.isAddDialogOpen = false;
      this.router.navigate(['/add-task']);
    }
  }

  //#endregion
}