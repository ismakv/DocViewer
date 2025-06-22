import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DOCUMENT_PATH, DOCUMENT_SOURCE } from '@features/document-viewer/providers/document-source.provider';
import { JsonDocumentSourceService } from '@features/document-viewer/service/json-document-source.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEventPlugins(),
    provideHttpClient(),
    {
      provide: DOCUMENT_PATH,
      useValue: '/1.json',
    },
    {
      provide: DOCUMENT_SOURCE,
      useClass: JsonDocumentSourceService,
    },
  ],
};
