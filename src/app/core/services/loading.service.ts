import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _count = signal(0);
  readonly loading = signal(false);

  start(): void {
    this._count.update((n) => n + 1);
    this.loading.set(true);
  }

  stop(): void {
    this._count.update((n) => Math.max(0, n - 1));
    if (this._count() === 0) {
      this.loading.set(false);
    }
  }
}
