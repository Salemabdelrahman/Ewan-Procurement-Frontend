import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  // TODO: replace with the procurement backend URL once it is available.
  apiBaseUrl: 'http://localhost:5000/api',
};
