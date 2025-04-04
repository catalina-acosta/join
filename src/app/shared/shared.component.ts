import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';

/**
 * SharedComponent is a container component that includes the header and sidebar.
 * It is used across various parts of the application to provide common layout features.
 * 
 * @example
 * <app-shared></app-shared>
 */
@Component({
  selector: 'app-shared',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.scss'
})
export class SharedComponent {
  /**
   * The SharedComponent is a simple container for the header and sidebar components
   * and is included wherever common layout is needed in the app.
   */
}
