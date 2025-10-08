import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      ImagekitioAngularModule.forRoot(environment.imagekit) // ✅ Added ImageKit here
    ),
  ],
}).catch((err) => console.error(err));
