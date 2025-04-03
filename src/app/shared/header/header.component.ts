import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../../app.component';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  menuOpen = false;
  userInitials: string = '';
  isLoggedIn: boolean = false;

  constructor(private appComponent: AppComponent) {
    this.fetchUserInitials();
   }

   // Fetch the initials of the logged-in user
  private fetchUserInitials() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true; // Benutzer ist angemeldet
        const displayName = user.displayName || ''; // Verwende displayName, falls verfügbar
        const email = user.email || ''; // Fallback auf E-Mail, falls displayName nicht gesetzt ist

        if (displayName) {
          const [firstName, lastName] = displayName.split(' ');
          const firstInitial = firstName?.charAt(0).toUpperCase() || '';
          const lastInitial = lastName?.charAt(0).toUpperCase() || '';
          this.userInitials = `${firstInitial}${lastInitial}`;
        } else if (email) {
          const [firstPart] = email.split('@');
          const firstInitial = firstPart.charAt(0).toUpperCase();
          this.userInitials = `${firstInitial}`;
        }
      
      }   else {
        this.isLoggedIn = true; 
        this.userInitials = 'G';
      }
    });
  }

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
