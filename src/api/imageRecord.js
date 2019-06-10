import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getImageRecordBuildingInfoList(params) {
  return request.get('api/imageRecordBuildingInfo/getImageRecordBuildingInfoList', {
    params,
  });
}
export function deleteImageRecordBuildingInfo(params) {
  return request.get('api/imageRecordBuildingInfo/deleteImageRecordBuildingInfo', {
    params,
  });
}
export function getImageRecordList(params) {
  return request.get('api/imageRecord/admin/getImageRecordList', {
    params,
  });
}
export function getImageRecordListByBuildingId(params) {
  return request.get('api/imageRecord/getImageRecordListByBuildingId', {
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
export function addImageRecordBuildingInfo(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/imageRecordBuildingInfo/addImageRecordBuildingInfo`, formData, config);
}
export function addImageRecord(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/imageRecord/admin/addImageRecord`, formData, config);
}
export const BuildingCategory = [
  { type: 0, name: '普通楼栋' },
  { type: 1, name: '人防地库' },
  { type: 2, name: '主楼地库' },
];
export const ImageProgress = [
  { ElectricalInstallation: ['结构预埋', '二次配管', '穿线并头', '桥架安装', '开关面板', '灯具安装', '电缆敷设', '住户箱安装', '配电箱安装', '防火封堵', '防雷接地'] },
  { DrainageInstallation: ['雨落水管', '废污水立管', '横管吊装', '卫生器具', '给水立管', '给水支管', '通水通球'] },
  { CommonItems: ['设施调试', '室外配管', '成品保护'] },
  { ElectricalInstallationOfBasement: ['结构预埋', '照明穿线', '桥架安装', '电缆敷设', '配电箱安装', '配电箱接线', '照明灯具', '灯具调试', '系统运行'] },
  { FireWaterInstallation: ['地上消火栓立管', '地上消火栓支管安装', '地上消火栓箱安装', '地库消火栓立管', '地库消火栓箱体', '地库喷淋主干管', '地库喷淋支管安装', '管网试压', '喷淋头安装', '机组设备', '联动调试'] },
  { VentilationInstallationForBasement: ['支吊架预制', '风管法兰制作', '风管制作及加工', '风管支吊架安装', '风管系统吊装', '部件、风口', '测试运行', '联动调试', '系统运行'] },
];
// { ElectricalInstallationOfOne: ['结构预埋', '二次配管', '穿线并头', '桥架安装', '开关面板', '灯具安装', '电缆敷设', '住户箱安装', '公共箱安装', '防火封堵', '防雷接地'] },
