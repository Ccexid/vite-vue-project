type AppFetchHeaders =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data';
export interface AppFetchConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: AppFetchHeaders;
}

const config: AppFetchConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
  defaultHeaders: 'application/json',
};
export { config };
