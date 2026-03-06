/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from './config';
import qs from 'qs';

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
  function (config: InternalAxiosRequestConfig) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  function (response: AxiosResponse<any, any, Record<string, any>>) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);
export { service };
