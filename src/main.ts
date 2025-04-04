import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * The entry point for bootstrapping an Angular application.
 * 
 * This code uses the `bootstrapApplication` function to initialize and launch the Angular application.
 * It passes the root component (`AppComponent`) and the application configuration (`appConfig`) as parameters.
 * If any error occurs during the bootstrapping process, it will be caught and logged to the console.
 */

// Bootstrapping the Angular application by specifying the root component and app configuration.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
