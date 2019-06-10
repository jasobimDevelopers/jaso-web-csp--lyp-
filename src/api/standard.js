import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getNormativefilesLists(params) {
  return request.get('api/normativefiles/getNormativefilesLists', {
    params,
  });
}

export function addNormativefiles(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      // file list
      if (key === 'fileList') {
        Array.from(params[key]).forEach((file) => {
          formData.append('fileList', file);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/normativefiles/admin/addNormativefiles`, formData, config);
}
