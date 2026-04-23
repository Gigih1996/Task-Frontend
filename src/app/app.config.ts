import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  CircleCheck,
  Clock,
  Eye,
  FileText,
  Inbox,
  LayoutGrid,
  ListTodo,
  LoaderCircle,
  LucideAngularModule,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X
} from 'lucide-angular';

import { appRoutes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([errorInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        AlertTriangle,
        ArrowLeft,
        ArrowRight,
        ArrowUpDown,
        Calendar,
        Check,
        CheckCheck,
        ChevronDown,
        CircleCheck,
        Clock,
        Eye,
        FileText,
        Inbox,
        LayoutGrid,
        ListTodo,
        LoaderCircle,
        Pencil,
        Plus,
        RefreshCw,
        Save,
        Search,
        SlidersHorizontal,
        Sparkles,
        Trash2,
        X
      })
    )
  ]
};
