/**
 * @file Defines server-side routing configuration for Angular SSR.
 */

import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server-side route configuration.
 * This wildcard route ensures all paths are pre-rendered.
 * @constant {ServerRoute[]}
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
