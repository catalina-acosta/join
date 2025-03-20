import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../shared/service/firebase.service';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  firebase = inject(FirebaseService);
}
