import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}
  private alertMessageSource = new BehaviorSubject<string | null>(null);
  public alertMessage$ = this.alertMessageSource.asObservable();

  showAlert(message: string): void {
    this.alertMessageSource.next(message);
  }

  clearAlert(): void {
    this.alertMessageSource.next(null);
  }
}
