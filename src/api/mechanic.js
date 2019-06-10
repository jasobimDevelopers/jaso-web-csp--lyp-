import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';


// 获取工人岗位
export function getWorkTypeList(params) {
  return request.get('api/workType/admin/getWorkTypeList', { params });
}

// 获取user_team 班组列表
export function getTeamIdList(params) {
  return request.get('api/userTeam/admin/getUserTeamList', { params });
}
// 新增班组
export function addTeam(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/userTeam/admin/addUserTeam`, formData, config);
}
// 获取班组工人
export function getDepartmentList(params) {
  return request.get('api/departmentUser/getDepartmentUserList', { params });
}

// 新增班组工人
export function addDepartment(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/departmentUser/addDepartmentUser`, formData, config);
}
// 编辑班组工人
export function updateDepartment(params) {
  const formData = new FormData();
  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/departmentUser/updateDepartmentUser`, formData, config);
}

// 删除班组工人
export function deleteDepartment(params) {
  return request.get('api/departmentUser/deleteDepartmentUser', {
    params,
  });
}

export function getMechanicList(params) {
  return request.get('api/mechanic/getMechanicList', {
    params,
  });
}

export function addMechanic(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/mechanic/addMechanic`, formData, config);
}

export function updateMechanic(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/mechanic/updateMechanic`, formData, config);
}

export function deleteMechanic(params) {
  return request.get('api/mechanic/deleteMechanic', {
    params,
  });
}

export function getProjectHour(params) {
  return request.get('api/project/admin/getProjectHour', {
    params,
  });
}

export function getMechanicPriceList(params) {
  return request.get('api/mechanicPrice/getMechanicPriceList', {
    params,
  });
}

export function addMechanicPriceList(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/mechanicPrice/addMechanicPriceList`, formData, config);
}


export function updateWorkHour(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/project/visitor/updateWorkHour`, formData, config);
}

export function updateMechanicPrice(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/mechanicPrice/updateMechanicPrice`, formData, config);
}

export function getMechanicPriceNum(params) {
  return request.get('api/mechanicPrice/getMechanicPriceNum', {
    params,
  });
}

export function exportMechanicNum(params) {
  return request.get('api/mechanicPrice/exportMechanicNum', {
    params,
  });
}
