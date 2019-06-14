import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getMeasuredProblemByProjectId(params) {
  return request.get('api/measuredProblem/getMeasuredProblemByProjectId', {
    params,
  });
}
export function measuredProblemCheck(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      // file list
      if (key === 'fileList') {
        Array.from(params[key]).forEach((file) => {
          formData.append('pics', file);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/measuredProblem/measuredProblemCheck`, formData, config);
}
export function measuredProblemCheckAgain(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/measuredProblem/measuredProblemCheckAgain`, formData, config);
}

export function addMeasuredProblem(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/measuredProblem/addMeasuredProblem`, formData, config);
}
