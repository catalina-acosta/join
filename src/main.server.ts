import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * The entry point for bootstrapping an Angular application on the server-side (e.g., for Angular Universal).
 * 
 * This code uses the `bootstrapApplication` function to initialize and launch the Angular application
 * on the server. It passes the root component (`AppComponent`) and the server-side application configuration (`config`)
 * as parameters. The bootstrap function is exported as the default function, which can be invoked to start the application.
 */

// Bootstrapping the Angular application with the provided server-side configuration.
const bootstrap = () => bootstrapApplication(AppComponent, config);

// Export the bootstrap function for usage elsewhere (e.g., server-side rendering or initialization).
export default bootstrap;
