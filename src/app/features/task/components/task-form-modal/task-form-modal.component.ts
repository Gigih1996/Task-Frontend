import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { UiButtonComponent } from '../../../../shared/components/ui/ui-button/ui-button.component';
import { UiInputComponent } from '../../../../shared/components/ui/ui-input/ui-input.component';
import { UiModalComponent } from '../../../../shared/components/ui/ui-modal/ui-modal.component';
import {
  CreateTaskPayload,
  TASK_STATUS_OPTIONS,
  Task,
  TaskStatus,
  UpdateTaskPayload
} from '../../models/task.model';
import { TaskService } from '../../services/task.service';

export type TaskFormModalMode = 'create' | 'edit';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    UiModalComponent,
    UiInputComponent,
    UiButtonComponent
  ],
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.css']
})
export class TaskFormModalComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);

  @Input() open = false;
  @Input() mode: TaskFormModalMode = 'create';
  @Input() task: Task | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<Task>();
  @Output() updated = new EventEmitter<Task>();

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly statusOptions = TASK_STATUS_OPTIONS;

  form: FormGroup = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(120)]
    ],
    description: ['', [Validators.maxLength(2000)]],
    status: ['todo' as TaskStatus, [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.error.set(null);
      if (this.mode === 'edit' && this.task) {
        this.form.reset({
          title: this.task.title,
          description: this.task.description ?? '',
          status: this.task.status
        });
      } else {
        this.form.reset({ title: '', description: '', status: 'todo' });
      }
    }
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }

  get titleError(): string {
    const c = this.title;
    if (!c.touched || c.valid) return '';
    if (c.errors?.['required']) return 'Title is required.';
    if (c.errors?.['minlength']) return 'Title must be at least 2 characters.';
    if (c.errors?.['maxlength']) return 'Title is too long.';
    return '';
  }

  get descriptionError(): string {
    const c = this.description;
    if (!c.touched || c.valid) return '';
    if (c.errors?.['maxlength']) return 'Description is too long.';
    return '';
  }

  selectStatus(value: TaskStatus): void {
    this.form.patchValue({ status: value });
  }

  statusMeta(value: TaskStatus): {
    label: string;
    icon: string;
    description: string;
  } {
    const map: Record<
      TaskStatus,
      { label: string; icon: string; description: string }
    > = {
      todo: { label: 'To Do', icon: 'inbox', description: 'Not started' },
      in_progress: {
        label: 'In Progress',
        icon: 'clock',
        description: 'Being worked on'
      },
      done: {
        label: 'Done',
        icon: 'circle-check',
        description: 'Completed'
      }
    };
    return map[value] ?? map.todo;
  }

  cancel(): void {
    if (this.submitting()) return;
    this.closed.emit();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const raw = this.form.value;
    const payload: CreateTaskPayload & UpdateTaskPayload = {
      title: raw.title!.trim(),
      description: raw.description?.trim() || null,
      status: raw.status as TaskStatus
    };

    if (this.isEdit && this.task) {
      this.taskService.update(this.task.id, payload).subscribe({
        next: (task) => {
          this.submitting.set(false);
          this.updated.emit(task);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err?.message ?? 'Failed to save task.');
        }
      });
    } else {
      this.taskService.create(payload).subscribe({
        next: (task) => {
          this.submitting.set(false);
          this.created.emit(task);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err?.message ?? 'Failed to create task.');
        }
      });
    }
  }
}
