import { Component } from '@angular/core';
import { ContactsComponent } from './contacts/contacts.component';
import { BoardComponent } from "./board/board.component";


@Component({
  selector: 'app-main-content',
  imports: [ContactsComponent, BoardComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
