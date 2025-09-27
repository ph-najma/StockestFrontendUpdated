import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { response } from 'express';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-frontend';
}
