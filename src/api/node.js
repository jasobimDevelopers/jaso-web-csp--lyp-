import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getNodeList(params) {
  return request.get('api/itemData/admin/getItemDataList', {
    params,
  });
}

// 节点新增
export function addNode(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/itemData/admin/addItemData`, formData, config);
}

// 节点编辑 url待填充
export function editNode(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}url`, formData, config);
}

// 节点删除  url待填充
export function delNode(params) {
  return request.get('url', {
    params,
  });
}

