import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-session-from',
  imports: [ReactiveFormsModule],
  templateUrl: './session-from.component.html',
  styleUrl: './session-from.component.css',
})
export class SessionFromComponent {
  @Input() initialData: any;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      instructor_name: ['', Validators.required],
      instructor_email: ['', [Validators.required, Validators.email]],
      specialization: [''],
      hourly_rate: ['', [Validators.required, Validators.min(0)]],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
