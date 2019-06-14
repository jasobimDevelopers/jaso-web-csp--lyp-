import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getCheckListTypesList(params) {
  return request.get('api/checkListTypes/admin/getCheckListTypesList', {
    params,
  });
}
export function deleteCheckListTypes(params) {
  return request.get('api/checkListTypes/admin/deleteCheckListTypes', {
    params,
  });
}

export function addCheckListTypes(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/checkListTypes/admin/addCheckListTypes`, formData, config);
}
export function updateCheckListTypes(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/checkListTypes/admin/updateCheckListTypes`, formData, config);
}
