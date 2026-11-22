import { Routes } from '@angular/router';

/** Routes owned by the auth feature. Mounted under the auth layout in app.routes.ts. */
export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Ewan ERP | Sign in',
    loadComponent: () => import('./pages/login/login-page').then((m) => m.LoginPage),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
