import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

// 获取任务单列表
export function getConstructionTaskList(params) {
  return request.get('api/constructionTaskNew/admin/getConstructionTaskNewList', {
    params,
  });
}

// 新增施工任务单
export function addConstructionTask(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null && params[key] !== []) {
      // file list
      if (key === 'imags') {
        Array.from(params[key]).forEach((file) => {
          formData.append('imags', file);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/constructionTaskNew/admin/addConstructionTaskNew`, formData, config);
}
// 编辑施工任务单
export function updateConstructionTask(params) {
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

  return axios.post(`${apiRoot}/api/constructionTaskNew/admin/updateConstructionTaskNew`, formData, config);
}
// 删除任务单
export function deleteConstructionTask(params) {
  return request.get('api/constructionTask/deleteConstructionTask', {
    params,
  });
}

// 获取任务单详情
export function getBuildTaskMsg(params) {
  return request.get('api/constructionTaskNew/getConstructionTaskNewDetail', {
    params,
  });
}

// 施工任务单导出
export function exportConstructionTask(params) {
  return request.get('api/constructionTaskNew/exportConstructionTask', {
    params,
  });
}

export function getBuildTaskApprovList(params) {
  return request.get('api/constructionTaskNew/getProcessLogByConstructionId', {
    params,
  });
}

export function getBuildTaskApproEventvList(params) {
  return request.get('api/constructionTaskNew/getAllProcessLogByConstructionId', {
    params,
  });
}

// 导出施工任务单
export function exportConstructionTaskById(params) {
  return request.get('api/constructionTask/exportConstructionTaskById', {
    params,
  });
}

// 审批
export function approvConstructionTask(params) {
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

  return axios.post(`${apiRoot}/api/constructionTaskNew/self/approveConstructionTaskNew`, formData, config);
}
