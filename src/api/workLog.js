import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

// 获取施工日志
export function getConstructionLogList(params) {
  return request.get('api/constructionLog/web/getConstructionLogList', { params });
}

// 获取施工部位
export function getConstructPartList(params) {
  return request.get('api/constructPart/admin/getConstructPartList', { params });
}

// 新增施工部位
export function addConstructPart(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/constructPart/admin/addConstructPart`, formData, config);
}

// 新增施工日志
export function addConstructionLog(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] !== null && params[key] !== '') {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/constructionLog/web/addConstructionLog`, formData, config);
}
// 新增施工日志条目
export function addProductionRecords(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/productionRecords/admin/addProductionRecords`, formData, config);
}

// 施工日志导出
export function exportConstructionLog(params) {
  return request.get('api/constructionLog/web/exportConstructionLog', {
    params,
  });
}

// 获取天气
export function getWeather(params) {
  return request.get('https://restapi.amap.com/v3/weather/weatherInfo', {
    params,
  });
}

// 获取地理信息
export function getCity(params) {
  return request.get('https://restapi.amap.com/v3/config/district', {
    params,
  });
}

