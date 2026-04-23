import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { UiBadgeComponent } from '../../../../shared/components/ui/ui-badge/ui-badge.component';
import { STATUS_LABEL, Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UiBadgeComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  @Output() statusChange = new EventEmitter<TaskStatus>();
  @Output() edited = new EventEmitter<Task>();
  @Output() deleted = new EventEmitter<string>();

  readonly statusLabel = STATUS_LABEL;

  get nextStatus(): TaskStatus {
    const order: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const idx = order.indexOf(this.task.status);
    return order[(idx + 1) % order.length];
  }

  get nextStatusLabel(): string {
    return this.statusLabel[this.nextStatus];
  }

  get accentClass(): string {
    const map: Record<TaskStatus, string> = {
      todo: 'from-slate-300 to-slate-400',
      in_progress: 'from-amber-400 to-amber-500',
      done: 'from-emerald-400 to-emerald-500'
    };
    return map[this.task.status];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  relativeTime(date: string): string {
    const diffMs = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diffMs / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }

  cycleStatus(): void {
    this.statusChange.emit(this.nextStatus);
  }

  edit(): void {
    this.edited.emit(this.task);
  }

  remove(): void {
    this.deleted.emit(this.task.id);
  }
}
