import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-alert-modal',
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css',
})
export class AlertModalComponent implements OnInit {
  alertMessage$!: Observable<string | null>;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertMessage$ = this.alertService.alertMessage$;
  }

  closeModal(): void {
    this.alertService.clearAlert();
  }
}
