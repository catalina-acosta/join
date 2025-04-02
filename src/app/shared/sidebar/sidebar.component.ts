import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { AppComponent } from '../../app.component';

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

  menuItems = [
    { label: 'Summary', icon: 'assets/sidebar/summary.svg', link: '/summary' },
    { label: 'Add Task', icon: 'assets/sidebar/add-task.svg', link: '/add-task' },
    { label: 'Board', icon: 'assets/sidebar/board.svg', link: '/board' },
    { label: 'Contacts', icon: 'assets/sidebar/contacts.svg', link: '/contact' }
  ];

  constructor(private router: Router, private appComponent: AppComponent) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects; 
        
       
        if (this.previousUrl === null) {
          this.previousUrl = '/'; 
        }
  
        this.updateActiveIndex(currentUrl);
        this.previousUrl = currentUrl;
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
  
    if (!this.previousUrl) {
      this.previousUrl = '/'; 
    }
  
    console.log('Current URL:', this.router.url);
    console.log('Previous URL:', this.previousUrl);
  
    return hiddenRoutes.includes(this.router.url) && this.previousUrl === '/';
  }
  
  logout() {
    this.appComponent.logout();
  }
}
