import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  menuOpen = false;

  constructor(private appComponent: AppComponent) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.appComponent.logout();
  }

    // HostListener für Klicks überall auf der Seite
    @HostListener('document:click', ['$event'])
    closeMenuOnOutsideClick(event: Event) {
      const targetElement = event.target as HTMLElement;
      
      // Überprüfen, ob das geklickte Element Teil des Three-Dot-Menüs oder des Dropdowns ist
      if (!targetElement.closest('.menu-button') && !targetElement.closest('.dropdown_menu')) {
        this.menuOpen = false;
      }
    }
}
