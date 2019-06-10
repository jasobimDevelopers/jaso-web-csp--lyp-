import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';
// 默认列
export function getDefaultList(params) {
  return request.get('api/projectPartContractLofting/getDefaultList', {
    params,
  });
}
// 合同放样量默认父级行数据获取
export function getContractLoftingList(params) {
  return request.get('api/contractLofting/admin/getContractLoftingList', {
    params,
  });
}
// 合同放样量指定行的列数据获取
export function getProjectPartContractLoftingList(params) {
  return request.get('api/projectPartContractLofting/admin/getProjectPartContractLoftingList', {
    params,
  });
}
// 行删除
export function deleteContractLofting(params) {
  return request.get('api/contractLofting/admin/deleteContractLofting', {
    params,
  });
}

// 行添加
export function addContractLofting(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/contractLofting/admin/addContractLofting`, formData, config);
}

// 行编辑
export function updateContractLofting(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/contractLofting/updateContractLofting`, formData, config);
}

// 列编辑
export function updateProjectPartContractLofting(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/projectPartContractLofting/updateProjectPartContractLofting`, formData, config);
}

// 列删除
export function deleteProjectPartContractLoftingByName(params) {
  return request.get('api/projectPartContractLofting/deleteProjectPartContractLoftingByName', {
    params,
  });
}

// 列添加
export function addProjectPartContractLofting(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/projectPartContractLofting/admin/addProjectPartContractLofting`, formData, config);
}

// 文件上传
export function importContractLoftingByProjectId(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      // file list
      // if (key === 'files') {
      //   Array.from(params[key]).forEach((file) => {
      //     formData.append('files', file);
      //   });
      // } else {
      formData.append(key, params[key]);
      // }
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/contractLofting/importContractLoftingByProjectId`, formData, config);
}
