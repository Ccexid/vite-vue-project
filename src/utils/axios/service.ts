/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from './config';
import qs from 'qs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // 导入插件
import utc from 'dayjs/plugin/utc'; // 导入插件

dayjs.extend(utc);
dayjs.extend(timezone); 

/**
 * 服务实例
 */
const service: AxiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  withCredentials: false,
  paramsSerializer: (params) => qs.stringify(params, { allowDots: true }),
});

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();

    // 注入请求时间：10位秒级 Unix 时间戳 (字符串格式)
    config.headers['Request-Time'] = dayjs().valueOf().toString();
    // 注入请求时区：例如 "Asia/Shanghai" 或 "UTC"
    config.headers['Request-Zone'] = dayjs.tz.guess();
    // GET 请求添加缓存控制头
    if (method === 'GET') {
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    } else if (method === 'POST') {
      // POST 请求处理表单数据
      const contentType = config.headers['Content-Type'] || config.headers['content-type'];
      if (contentType === 'application/x-www-form-urlencoded') {
        if (config.data && typeof config.data !== 'string') {
          config.data = qs.stringify(config.data);
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse<any, any, Record<string, any>>) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);
export { service };
