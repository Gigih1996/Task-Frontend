import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type UiBadgeVariant =
  | 'default'
  | 'todo'
  | 'in_progress'
  | 'done'
  | 'success'
  | 'warning'
  | 'danger';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-badge.component.html',
  styleUrls: ['./ui-badge.component.css']
})
export class UiBadgeComponent {
  @Input() variant: UiBadgeVariant = 'default';
  @Input() dot = true;

  get classes(): string {
    const base =
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium';

    const variants: Record<UiBadgeVariant, string> = {
      default: 'bg-slate-100 text-slate-700',
      todo: 'bg-slate-100 text-slate-700',
      in_progress: 'bg-amber-100 text-amber-800',
      done: 'bg-emerald-100 text-emerald-800',
      success: 'bg-emerald-100 text-emerald-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-rose-100 text-rose-800'
    };

    return `${base} ${variants[this.variant]}`;
  }

  get dotColor(): string {
    const map: Record<UiBadgeVariant, string> = {
      default: 'bg-slate-400',
      todo: 'bg-slate-400',
      in_progress: 'bg-amber-500',
      done: 'bg-emerald-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-rose-500'
    };
    return map[this.variant];
  }
}
