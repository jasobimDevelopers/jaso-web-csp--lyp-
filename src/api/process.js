import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getProcessList(params) {
  // return request.get('api/processData/admin/getProcessDataList', {
  return request.get('api/processData/getProcessDataByType', {
    params,
  });
}
// 流程新增
export function addProcess(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/processData/admin/addProcessData`, formData, config);
}
export function getProcessMsg(params) {
  return request.get('api/processData/admin/getProcessItemListById', {
    params,
  });
}


export function addProcessItem(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/processData/admin/addProcessItem`, formData, config);
}

// 流程编辑 url待填充
export function editProcess(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}url`, formData, config);
}
// 流程类别新增
export function addProcessDataType(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/processDataType/addProcessDataType`, formData, config);
}

// 流程删除
export function delProcess(params) {
  return request.get('api/processData/deleteProcessData', {
    params,
  });
}
// 流程类别获取
export function getProcessDataTypeList(params) {
  return request.get('api/processDataType/admin/getProcessDataTypeList', {
    params,
  });
}
export function handleNumUp(num) {
  const upperStr = '一二三四五六七八九十';
  if (num <= 10) {
    return upperStr.charAt(num - 1);
  }
  let numStr = '';
  numStr += num;
  let result = '';
  for (let i = 0; i < numStr.length;) {
    result += upperStr.charAt(numStr.charAt());
    i += 1;
  }
  return result;
}
