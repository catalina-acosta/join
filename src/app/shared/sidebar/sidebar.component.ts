import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  selectedIndex: number | null = null;
  selectedMobileIndex: number | null = null;
  previousUrl: string | null = null;
  isLoggedIn: boolean = false;
  auth = inject(Auth);

  menuItems = [
    { label: 'Summary', icon: 'assets/sidebar/summary.svg', link: '/summary' },
    { label: 'Add Task', icon: 'assets/sidebar/add-task.svg', link: '/add-task', fragment: '' },
    { label: 'Board', icon: 'assets/sidebar/board.svg', link: '/board', fragment: 'boardUpstairs' },
    { label: 'Contacts', icon: 'assets/sidebar/contacts.svg', link: '/contact' }
  ];

  //Albinas version:
  // menuItems = [
  //   { label: 'Summary', icon: 'assets/sidebar/summary.svg', link: '/summary' },
  //   { label: 'Add Task', icon: 'assets/sidebar/add-task.svg', link: '/add-task' },
  //   { label: 'Board', icon: 'assets/sidebar/board.svg', link: '/board' },
  //   { label: 'Contacts', icon: 'assets/sidebar/contacts.svg', link: '/contact' }
  // ];

  constructor(private router: Router, private appComponent: AppComponent) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user; 
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveIndex(event.urlAfterRedirects);
      }
    });
  }
  
  private updateActiveIndex(currentUrl: string) {
    const foundIndex = this.menuItems.findIndex(item => item.link === currentUrl);
    this.selectedIndex = foundIndex !== -1 ? foundIndex : null;
  }

  setActive(index: number) {
    this.selectedIndex = index;
  }

  setMobileActive(index: number) {
    this.selectedMobileIndex = index;
  }

  shouldHideMenu(): boolean {
    const hiddenRoutes = ['/privacy-policy', '/imprint'];
    return hiddenRoutes.includes(this.router.url) && !this.isLoggedIn;
  }
  
  logout() {
    this.auth.signOut().then(() => {
      this.isLoggedIn = false;
    }).catch((error) => {
      console.error(error);
    });
  }
}
