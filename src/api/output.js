import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getValueOutputList(params) {
  return request.get('api/outputValue/admin/getOutputValueList', {
    params,
  });
}

export function deleteValueOutput(params) {
  return request.get('api/outputValue/admin/deleteOutputValue', {
    params,
  });
}

export function addValueOutput(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/outputValue/admin/addOutputValue`, formData, config);
}

export function updateValueOutput(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/outputValue/admin/updateOutputValue`, formData, config);
}

export function exportValueOutput(params) {
  return request.get('api/valueOutput/exportValueOutput', {
    params,
  });
}

export function getProjectOutputValueByProjectId(params) {
  return request.get('api/projectOutputValue/admin/getProjectOutputValueByProjectId', {
    params,
  });
}

export function updateProjectOutputValue(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/projectOutputValue/admin/updateProjectOutputValue`, formData, config);
}

export function getValueOutputByDate(params) {
  return request.get('api/valueOutput/getValueOutputByDate', {
    params,
  });
}

export function exportOutputValue(params) {
  return request.get('api/outputValue/exportOutputValue', {
    params,
  });
}
