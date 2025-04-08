import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/**
 * A component responsible for displaying the privacy policy of the application.
 * 
 * This component is typically used to show the privacy policy to users and may be linked
 * from the application settings, user account pages, or legal pages.
 * 
 * @selector app-privacy-policy
 * @example
 * <app-privacy-policy></app-privacy-policy>
 */
@Component({
  selector: 'app-privacy-policy',  // The HTML tag used to reference this component.
  imports: [RouterLink],  // The RouterLink directive is imported to allow navigation.
  templateUrl: './privacy-policy.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./privacy-policy.component.scss']  // Path to the stylesheet for this component.
})
export class PrivacyPolicyComponent {
  
  /**
   * Constructor to initialize the PrivacyPolicyComponent.
   * 
   * @param router The Angular Router service used for navigation within the app.
   */
  constructor(private router: Router) {}


}
