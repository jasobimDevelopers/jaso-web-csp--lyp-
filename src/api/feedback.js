import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getFeedbackList(params) {
  return request.get('api/feedback/admin/getFeedbackList', {
    params,
  });
}

export function deleteFeedback(params) {
  return request.get('api/feedback/admin/deleteFeedback', {
    params,
  });
}

export function addFeedback(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/feedback/addFeedback`, formData, config);
}
