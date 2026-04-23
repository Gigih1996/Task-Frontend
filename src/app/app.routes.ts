import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks'
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/task/pages/task-list/task-list.page').then(
        (m) => m.TaskListPage
      )
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];
