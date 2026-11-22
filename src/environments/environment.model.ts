export interface AppEnvironment {
  readonly production: boolean;
  /** Base URL of the backend API. Consumed through the API_BASE_URL token in core/config. */
  readonly apiBaseUrl: string;
}
