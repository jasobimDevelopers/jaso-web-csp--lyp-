import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';
// 进度管理的构件列表获取接口
export function getItemSelfPercent(params) {
  return request.get('api/item/getItemSelfPercent', {
    params,
  });
}
// 进度管理详情页面构件状态记录接口
export function getItemStateLogList(params) {
  return request.get('api/itemStateLog/getItemStateLogList', {
    params,
  });
}

export function updateImageRecordBuildingInfo(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/imageRecordBuildingInfo/updateImageRecordBuildingInfo`, formData, config);
}

