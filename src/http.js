// src/http.js
import axios from 'axios';
import config from '@/config';
import { useUserStore } from '@/stores/user';




const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeout,
  // 你可以在这里添加其他全局配置
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    console.log(useUserStore().user)
    if (useUserStore().user.is_logged_in) {
        config.headers.Authorization = `Bearer ${useUserStore().user.token}`;
        console.log('添加token', config.headers.Authorization)
    }
    console.log('请求拦截器', config);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    console.log('响应拦截器', response);
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default axiosInstance;
