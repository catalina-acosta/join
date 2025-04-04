import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

/**
 * The ImpressumComponent is used to display the "Impressum" page in the application.
 * It may provide legal information about the company or website, depending on the application context.
 *
 * @selector app-impressum
 * @example
 * <app-impressum></app-impressum>
 */
@Component({
  selector: 'app-impressum',  // The HTML tag used to reference this component.
  imports: [RouterModule, RouterLink],  // Imports necessary modules for routing functionality.
  templateUrl: './impressum.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./impressum.component.scss']  // Path to the stylesheet for this component.
})
export class ImpressumComponent {
  /**
   * The constructor for the ImpressumComponent.
   * The router instance is injected for routing purposes.
   *
   * @param {Router} router - The Angular Router used for navigation within the application.
   */
  constructor(private router: Router) {
  }
}
