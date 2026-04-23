import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.css']
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  readonly icons = { LoaderCircle };

  get classes(): string {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const sizes: Record<UiButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-5 py-3'
    };

    const variants: Record<UiButtonVariant, string> = {
      primary:
        'bg-gradient-to-b from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-soft focus:ring-brand-500',
      secondary:
        'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-brand-500',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-brand-500',
      danger:
        'bg-gradient-to-b from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-soft focus:ring-rose-500'
    };

    return `${base} ${sizes[this.size]} ${variants[this.variant]} ${
      this.fullWidth ? 'w-full' : ''
    }`;
  }
}
