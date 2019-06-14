import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getPaperOfMeasuredByProjectId(params) {
  return request.get('api/paperOfMeasured/getPaperOfMeasuredByProjectId', {
    params,
  });
}

export function addPaperOfMeasured(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      // file list
      if (key === 'file') {
        Array.from(params[key]).forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/paperOfMeasured/addPaperOfMeasured`, formData, config);
}
export function deletePaperOfMeasured(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/paperOfMeasured/deletePaperOfMeasured`, formData, config);
}
