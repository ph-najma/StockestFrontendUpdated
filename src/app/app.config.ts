import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { routes } from './app.routes';
import { SocketIoConfig, Socket } from 'ngx-socket-io';
import { tokenInterceptor } from './token.interceptor';
import { environment } from '../environments/environment';
const socketConfig: SocketIoConfig = {
  url: environment.apiUrl,
  options: {},
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    LucideAngularModule,
    { provide: Socket, useFactory: () => new Socket(socketConfig) },
  ],
};
