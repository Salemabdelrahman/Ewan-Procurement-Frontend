import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

/**
 * Base URL for all backend calls. Inject this token instead of importing `environment`
 * directly so data-access services stay testable and environment-agnostic.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
