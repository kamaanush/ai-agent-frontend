import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),            // ✅ connect your routes here
    importProvidersFrom(FormsModule), // ✅ enable ngModel
    provideHttpClient(withFetch())    // ✅ enable HttpClient
  ]
};
