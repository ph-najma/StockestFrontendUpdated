import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reusable-table',
  imports: [CommonModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css',
})
export class ReusableTableComponent {
  @Input() data: any[] = [];
  @Input() headers: string[] = [];
  formatHeader(header: string): string {
    return header.toLowerCase().replace(/ /g, '');
  }
}
