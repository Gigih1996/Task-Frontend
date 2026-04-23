import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type UiModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.css']
})
export class UiModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() closeOnBackdrop = true;
  @Input() size: UiModalSize = 'md';

  @Output() closed = new EventEmitter<void>();

  get sizeClass(): string {
    const map: Record<UiModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };
    return map[this.size];
  }

  close(): void {
    this.closed.emit();
  }

  onBackdrop(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }
}
