import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { UiButtonComponent } from '../../../../shared/components/ui/ui-button/ui-button.component';
import { UiCardComponent } from '../../../../shared/components/ui/ui-card/ui-card.component';
import { UiModalComponent } from '../../../../shared/components/ui/ui-modal/ui-modal.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import {
  TaskFormModalComponent,
  TaskFormModalMode
} from '../../components/task-form-modal/task-form-modal.component';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

type StatusFilter = 'all' | TaskStatus;
type SortKey = 'newest' | 'oldest' | 'title_asc' | 'title_desc';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    TaskCardComponent,
    TaskFormModalComponent,
    UiButtonComponent,
    UiCardComponent,
    UiModalComponent
  ],
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.css']
})
export class TaskListPage implements OnInit {
  private readonly taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal<StatusFilter>('all');
  readonly search = signal('');
  readonly sort = signal<SortKey>('newest');

  readonly confirmDeleteId = signal<string | null>(null);
  readonly deleting = signal(false);

  readonly formModalOpen = signal(false);
  readonly formModalMode = signal<TaskFormModalMode>('create');
  readonly editingTask = signal<Task | null>(null);

  readonly filters: {
    value: StatusFilter;
    label: string;
    icon: string;
  }[] = [
    { value: 'all', label: 'All', icon: 'layout-grid' },
    { value: 'todo', label: 'To Do', icon: 'inbox' },
    { value: 'in_progress', label: 'In Progress', icon: 'clock' },
    { value: 'done', label: 'Done', icon: 'circle-check' }
  ];

  readonly sortOptions: { value: SortKey; label: string }[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title_asc', label: 'Title (A–Z)' },
    { value: 'title_desc', label: 'Title (Z–A)' }
  ];

  readonly filteredTasks = computed(() => {
    const current = this.filter();
    const q = this.search().trim().toLowerCase();
    const sort = this.sort();

    let result = this.tasks();
    if (current !== 'all') {
      result = result.filter((t) => t.status === current);
    }
    if (q) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? '').toLowerCase().includes(q)
      );
    }
    const arr = [...result];
    switch (sort) {
      case 'oldest':
        arr.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'title_asc':
        arr.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        arr.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        arr.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return arr;
  });

  readonly completionRate = computed(() => {
    const total = this.tasks().length;
    if (total === 0) return 0;
    const done = this.tasks().filter((t) => t.status === 'done').length;
    return Math.round((done / total) * 100);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.findAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load tasks.');
        this.loading.set(false);
      }
    });
  }

  setFilter(value: StatusFilter): void {
    this.filter.set(value);
  }

  setSearch(value: string): void {
    this.search.set(value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  setSort(value: SortKey): void {
    this.sort.set(value);
  }

  countByStatus(status: TaskStatus): number {
    return this.tasks().filter((t) => t.status === status).length;
  }

  trackById(_index: number, item: Task): string {
    return item.id;
  }

  openCreate(): void {
    this.editingTask.set(null);
    this.formModalMode.set('create');
    this.formModalOpen.set(true);
  }

  openEdit(task: Task): void {
    this.editingTask.set(task);
    this.formModalMode.set('edit');
    this.formModalOpen.set(true);
  }

  closeForm(): void {
    this.formModalOpen.set(false);
  }

  onCreated(task: Task): void {
    this.tasks.set([task, ...this.tasks()]);
    this.closeForm();
  }

  onUpdated(task: Task): void {
    this.tasks.set(this.tasks().map((t) => (t.id === task.id ? task : t)));
    this.closeForm();
  }

  updateStatus(id: string, status: TaskStatus): void {
    const prev = this.tasks();
    this.tasks.set(prev.map((t) => (t.id === id ? { ...t, status } : t)));

    this.taskService.update(id, { status }).subscribe({
      error: () => {
        this.tasks.set(prev);
        this.error.set('Failed to update status. Please try again.');
      }
    });
  }

  askDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;

    this.deleting.set(true);
    this.taskService.delete(id).subscribe({
      next: () => {
        this.tasks.set(this.tasks().filter((t) => t.id !== id));
        this.deleting.set(false);
        this.confirmDeleteId.set(null);
      },
      error: (err) => {
        this.deleting.set(false);
        this.error.set(err?.message ?? 'Failed to delete task.');
        this.confirmDeleteId.set(null);
      }
    });
  }
}
