import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="flex justify-center items-center min-h-[200px]">
      <mat-spinner diameter="40" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoadingSpinnerComponent {}
