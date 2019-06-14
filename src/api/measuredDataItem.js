import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getBuildingOfMeasuredByProjectId(params) {
  return request.get('api/buildingOfMeasured/getBuildingOfMeasuredByProjectId', {
    params,
  });
}
export function getMeasuredSiteListByBuildingId(params) {
  return request.get('api/measuredSite/getMeasuredSiteListByBuildingId', {
    params,
  });
}
export function deleteMeasuredSite(params) {
  return request.get('api/measuredSite/deleteMeasuredSite', {
    params,
  });
}

export function deleteBuildingOfMeasured(params) {
  return request.get('api/buildingOfMeasured/deleteBuildingOfMeasured', {
    params,
  });
}

export function addBuildingOfMeasured(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/buildingOfMeasured/addBuildingOfMeasured`, formData, config);
}

export function updateBuildingOfMeasured(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/buildingOfMeasured/updateBuildingOfMeasured`, formData, config);
}


export function addMeasuredSite(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/measuredSite/addMeasuredSite`, formData, config);
}
export function updateMeasuredSite(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/measuredSite/updateMeasuredSite`, formData, config);
}
