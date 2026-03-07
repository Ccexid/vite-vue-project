/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig } from 'axios';
type AppFetchHeaders =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data';
/**
 * 默认请求头
 */
export interface AppFetchConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: AppFetchHeaders;
}
/**
 * 统一后端返回格式接口 (根据你的后端实际结构调整)
 */
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}
/**
 * 扩展 AxiosRequestConfig，增加自定义配置项
 */
export interface RequestOption extends AxiosRequestConfig {
  headersType?: string; // 自定义 Content-Type
}
