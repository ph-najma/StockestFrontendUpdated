import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Transaction } from '../trans-main/trans-main.component';
@Component({
  selector: 'app-trans-table',
  imports: [CommonModule],
  templateUrl: './trans-table.component.html',
  styleUrl: './trans-table.component.css',
})
export class TransTableComponent {
  @Input() transactions: Transaction[] = [];
}
