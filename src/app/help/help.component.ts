import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

/**
 * The HelpComponent displays the help page of the application.
 * It may provide users with support resources or FAQs.
 *
 * @selector app-help
 * @example
 * <app-help></app-help>
 */
@Component({
  selector: 'app-help',  // The HTML tag used to reference this component.
  imports: [RouterModule, RouterLink],  // Imports necessary modules for routing functionality.
  templateUrl: './help.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./help.component.scss']  // Path to the stylesheet for this component.
})
export class HelpComponent {
  // The component currently does not have any logic or properties, it serves as a container for the help content.
}
