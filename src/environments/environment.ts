import { AppEnvironment } from './environment.model';

/** Production configuration. Replaced at build time for development (see angular.json). */
export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api',
};
