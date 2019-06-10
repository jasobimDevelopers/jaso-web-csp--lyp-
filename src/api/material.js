import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getMaterialTypeList(params) {
  return request.get('api/materialType/vs/getMaterialTypeList', {
    params,
  });
}

export function addMaterialType(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/materialType/vs/addMaterialType`, formData, config);
}

export function updateMaterialType(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/materialType/self/updateMaterialType`, formData, config);
}

export function deleteMaterialType(params) {
  return request.get('api/materialType/admin/deleteMaterialType', {
    params,
  });
}

export function getMaterialLogList(params) {
  return request.get('api/materialLog/vs/getMaterialLogList', {
    params,
  });
}

export function addMaterialLog(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/materialLog/vs/addMaterialLog`, formData, config);
}

export function deleteMaterialLog(params) {
  return request.get('api/materialLog/deleteMaterialLog', {
    params,
  });
}

export function getMaterialList(params) {
  return request.get('api/material/vs/getMaterialList', {
    params,
  });
}

export function addMaterial(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/material/vs/addMaterial`, formData, config);
}

export function deleteMaterial(params) {
  return request.get('api/material/admin/deleteMaterial', {
    params,
  });
}

export function updateMaterial(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/material/updateMaterial`, formData, config);
}

export function importMaterial(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/material/web/importMaterial`, formData, config);
}

export function getMaterialPlanList(params) {
  return request.get('api/materialPlan/getMaterialPlanList', {
    params,
  });
}

export function deleteMaterialPlanById(params) {
  return request.get('api/materialPlan/deleteMaterialPlanById', {
    params,
  });
}

export function addMaterialPlan(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/materialPlan/addMaterialPlan`, formData, config);
}

export function updateMaterialPlan(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/materialPlan/materialPlan`, formData, config);
}

export function updateMaterialPlanById(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/materialPlan/updateMaterialPlanById`, formData, config);
}

export function clearList(list, param) {
  let result = false;
  if (list[0].level < param.level) {
    for (const key in list) {
      if (list[key].children.length > 0) {
        if (clearList(list[key].children, param)) {
          result = true;
          break;
        }
      }
    }
  } else {
    for (const key in list) {
      if (key) {
        if (list[key].id === param.id) {
          if (param.id < 0) {
            list.splice(Number(key), 1);
          } else {
            list[key].edit = false;
          }
          result = true;
          break;
        }
      }
    }
  }
  return result;
}
