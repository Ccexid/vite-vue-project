import type { AppFetchConfig } from '@/types/app-env';

const config: AppFetchConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
  defaultHeaders: 'application/json',
};
export { config };
