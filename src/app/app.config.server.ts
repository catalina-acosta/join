/**
 * @file Server-side application configuration for Angular.
 */

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/**
 * Server-side application configuration.
 * @constant {ApplicationConfig}
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes)
  ]
};

/**
 * Merged application configuration combining client and server configurations.
 * @constant {ApplicationConfig}
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
