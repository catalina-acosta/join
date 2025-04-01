import { Component } from '@angular/core';
import { SummaryComponent } from "./summary/summary.component";


@Component({
  selector: 'app-main-content',
  imports: [SummaryComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
