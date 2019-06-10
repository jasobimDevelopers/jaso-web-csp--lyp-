import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getBidsList(params) {
  return request.get('api/projectTender/getProjectTenderList', {
    params,
  });
}

export function getProjectList(params) {
  return request.get('api/project/admin/getAllProjectId', {
    params,
  });
}

export function getBidsListByProject(params) {
  return request.get('api/projectTender/getProjectTenderList', {
    params,
  });
}

export function addBids(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/projectTender/addProjectTender`, formData, config);
}

export function editBids(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/projectTender/updateProjectTender`, formData, config);
}

// 流程删除
export function delBids(params) {
  return request.get('api/projectTender/deleteProjectTender', {
    params,
  });
}
