import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000', {
      auth: { token: sessionStorage.getItem('token') },
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
