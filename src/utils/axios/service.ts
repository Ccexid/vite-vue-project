/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { config as apiConfig } from './config';
import qs from 'qs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // 导入插件
import utc from 'dayjs/plugin/utc'; // 导入插件
import { useMessage } from 'naive-ui'


dayjs.extend(utc);
dayjs.extend(timezone);
const nMessage = useMessage()
/**
 * 创建 Axios 实例的配置
 */
const axiosConfig: CreateAxiosDefaults = {
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout || 10000,
  withCredentials: false,
  paramsSerializer: (params) => qs.stringify(params, { allowDots: true, arrayFormat: 'brackets' }),
};

/**
 * 服务实例
 */
const service: AxiosInstance = axios.create(axiosConfig);

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

    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    const { data } = response;
    // 校验业务状态码 (假设 200 或 0 是成功)
    if (data.code !== undefined && data.code !== 200 && data.code !== 0) {
      // 可以在这里弹出全局 Message 提示
      console.error(`[Business Error]: ${data.message || 'Unknown Error'}`);
      return Promise.reject(data);
    }
    return data;
  },
  (error: AxiosError) => {
    let message = '';
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          message = '未授权，请重新登录';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求资源不存在';
          break;
        case 500:
          message = '服务器错误';
          break;
        default:
          message = `网络连接错误: ${status}`;
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时，请稍后重试';
      nMessage.error(message)
    } else {
      message = '无法连接到服务器';
      nMessage.error(message)
    }

    // 此处可调用 UI 组件库的 Toast/Message 提示用户
    console.error(`[HTTP Error]: ${message}`, error);

    return Promise.reject(error);
  },
);
export { service };
