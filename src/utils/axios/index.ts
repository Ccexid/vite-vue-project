/* eslint-disable @typescript-eslint/no-explicit-any */
import { service } from './service';
import { config } from './config';

const { defaultHeaders } = config;

const request = (option: any) => {
  const { headersType, headers, ...otherOption } = option;
  return service({
    ...otherOption,
    headers: {
      'Content-Type': headersType || defaultHeaders,
      ...headers,
    },
  });
};

export default {
  request: request,
  get: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option });
    return res.data as unknown as T;
  },
  post: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option });
    return res.data as unknown as T;
  },
  postOriginal: async (option: any) => {
    const res = await request({ method: 'POST', ...option });
    return res;
  },
  delete: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option });
    return res.data as unknown as T;
  },
  put: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option });
    return res.data as unknown as T;
  },
  download: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option });
    return res as unknown as Promise<T>;
  },
  upload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data';

    const res = await request({
      method: 'POST',
      ...option,
      timeout: 30 * 60 * 1000, // 30分钟，足够大文件慢速上传
    });
    return res as unknown as Promise<T>;
  },
};
