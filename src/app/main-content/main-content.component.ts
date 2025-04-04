import { Component } from '@angular/core';
import { SummaryComponent } from "./summary/summary.component";

/**
 * The MainContentComponent is a container component for displaying the main content of the application.
 * 
 * It acts as a wrapper for different sections of the application and includes a `SummaryComponent` as part of the main content.
 * This component is responsible for rendering key sections like summary and other content areas in the main view.
 * 
 * @selector app-main-content
 * @example
 * <app-main-content></app-main-content>
 */
@Component({
  selector: 'app-main-content',  // The HTML tag used to reference this component.
  imports: [SummaryComponent],  // Imports the SummaryComponent which is included in the template.
  templateUrl: './main-content.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./main-content.component.scss']  // Path to the stylesheet for this component.
})
export class MainContentComponent {
  // This component currently does not have any logic or properties.
}
