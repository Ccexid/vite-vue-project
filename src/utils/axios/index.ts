/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios';
import { service } from './service';
import { config as apiConfig } from './config';
import type { RequestOption } from '@/types/app-env';

const { defaultHeaders } = apiConfig;
/**
 * 核心请求方法
 */
const request = <T = any>(option: RequestOption): Promise<T> => {
  const { headersType, headers, ...otherOption } = option;

  return service({
    ...otherOption,
    headers: {
      'Content-Type': headersType || defaultHeaders,
      ...headers,
    },
  } as any);
  // 注意：因为我们在 service 的响应拦截器里直接返回了 response.data，
  // 所以这里的 Promise 返回类型已经是业务数据结构了。
};

export default {
  /**
   * 通用请求
   */
  request,

  /**
   * GET 请求：通常用于获取数据
   */
  get: <T = any>(option: RequestOption): Promise<T> => {
    return request({ ...option, method: 'GET' });
  },

  /**
   * POST 请求：默认返回处理后的业务数据 (T)
   */
  post: <T = any>(option: RequestOption): Promise<T> => {
    return request({ ...option, method: 'POST' });
  },

  /**
   * POST 原生请求：返回完整的 AxiosResponse
   * 适用于需要读取 Header (如 Pagination) 的特殊场景
   */
  postOriginal: (option: RequestOption): Promise<AxiosResponse> => {
    return service({
      ...option,
      method: 'POST',
      headers: {
        'Content-Type': option.headersType || defaultHeaders,
        ...option.headers,
      },
    });
  },

  /**
   * DELETE 请求
   */
  delete: <T = any>(option: RequestOption): Promise<T> => {
    return request({ ...option, method: 'DELETE' });
  },

  /**
   * PUT 请求
   */
  put: <T = any>(option: RequestOption): Promise<T> => {
    return request({ ...option, method: 'PUT' });
  },

  /**
   * 下载文件：强制设置 responseType 为 blob
   */
  download: <T = any>(option: RequestOption): Promise<T> => {
    return request({
      ...option,
      method: 'GET',
      responseType: 'blob',
    });
  },

  /**
   * 上传文件：强制设置 multipart/form-data
   */
  upload: <T = any>(option: RequestOption): Promise<T> => {
    return request({
      ...option,
      method: 'POST',
      headersType: 'multipart/form-data',
      timeout: 30 * 60 * 1000, // 30分钟超时
    });
  },
};
