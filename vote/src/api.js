/*
 * @Author: your name
 * @Date: 2019-11-16 19:21:10
 * @LastEditTime: 2019-11-18 17:28:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\vote\src\components\api.js
 */
import axios from 'axios';
import baseURL from './baseURL';

const api = axios.create({
  baseURL,
  withCredentials: true,
});
export default api;
