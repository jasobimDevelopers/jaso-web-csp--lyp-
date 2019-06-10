import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

// 获得质量安全小红点
export function getAboutMeNums(params) {
  return request.get('api/qualityRectification/getAboutMeNums', {
    params,
  });
}

// 获得用户的菜单锁定记录
export function getConstructionTaskList(params) {
  return request.get('api/userMenuLog/admin/getUserMenuLogByUserId', {
    params,
  });
}
// 修改用户的菜单锁定记录 api/userMenuLog/admin/updateUserMenuLog
export function updateUserMenuLog(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      // file list
      if (key === 'files') {
        Array.from(params[key]).forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/userMenuLog/admin/updateUserMenuLog`, formData, config);
}
export function addUserMenuLog(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/userMenuLog/admin/addUserMenuLog`, formData, config);
}
