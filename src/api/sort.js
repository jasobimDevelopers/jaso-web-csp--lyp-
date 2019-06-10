import axios from 'axios';
import { getToken } from '@/utils/auth';
import { apiRoot, config } from './request';

export function addUserIndexList(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/userIndex/addUserIndexList`, formData, config);
}
