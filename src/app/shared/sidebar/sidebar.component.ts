import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  selectedIndex: number | null = null;
  selectedMobileIndex: number | null = null;

  menuItems = [
    { label: 'Summary', icon: 'assets/sidebar/summary.svg', link: '/imprint' },
    { label: 'Add Task', icon: 'assets/sidebar/add-task.svg', link: '/add-task' },
    { label: 'Board', icon: 'assets/sidebar/board.svg', link: '/board' },
    { label: 'Contacts', icon: 'assets/sidebar/contacts.svg', link: '/contact' }
  ];

  setActive(index: number) {
    this.selectedIndex = index;
  }

  setMobileActive(index: number) {
    this.selectedMobileIndex = index;
  }
  
}
