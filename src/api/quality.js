import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getReplyList(params) {
  return request.get('api/reply/admin/getReplyList', {
    params,
  });
}

export function getQualityRectificationList(params) {
  return request.get('api/qualityRectification/admin/getQualityRectificationList', {
    params,
  });
}

export function getCommentList(params) {
  return request.get('api/comment/admin/getCommentList', {
    params,
  });
}

export function getUserTeam(params) {
  return request.get('api/user/getUserTeam', {
    params,
  });
}

export function getQualityCheckPartList(params) {
  return request.get('api/qualityCheck/admin/getQualityCheckPartList', {
    params,
  });
}

export function getAwardTicketList(params) {
  return request.get('api/awardTicket/admin/getAwardTicketList', {
    params,
  });
}

export function deleteCheckLists(params) {
  return request.get('api/checkLists/admin/deleteCheckLists', {
    params,
  });
}

export function getQualityHash(params) {
  return request.get('api/quality/admin/getQualityHash', {
    params,
  });
}
export function getQualityCheckList(params) {
  return request.get('api/qualityCheck/admin/getQualityCheckList', {
    params,
  });
}
export function getNatureList(params) {
  return request.get('api/nature/admin/getNatureList', {
    params,
  });
}
export function deleteNature(params) {
  return request.get('api/nature/admin/deleteNature', {
    params,
  });
}
export function getCheckListsList(params) {
  return request.get('api/checkLists/admin/getCheckListsList', {
    params,
  });
}

export function addQuality(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      // file list
      if (key === 'fileList') {
        Array.from(params[key]).forEach((file) => {
          formData.append('file', file);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/quality/addQuality`, formData, config);
}

export function getQualityFineList(params) {
  return request.get('api/qualityFine/getQualityFineList', {
    params,
  });
}

export function addQualityCheck(params) {
  const formData = new FormData();

  for (const key in params) {
    // file list
    if (key === 'pics') {
      Array.from(params[key]).forEach((file) => {
        formData.append('pics', file);
      });
    } else {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/qualityCheck/admin/addQualityCheck`, formData, config);
}

export function qualityCheck(params) {
  const formData = new FormData();

  for (const key in params) {
    // file list
    if (key === 'fileList') {
      Array.from(params[key]).forEach((file) => {
        formData.append('pics', file);
      });
    } else {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/qualityRectification/qualityCheck`, formData, config);
}
export function addAwardTicket(params) {
  const formData = new FormData();

  for (const key in params) {
    // file list
    if (key === 'fileList') {
      Array.from(params[key]).forEach((file) => {
        formData.append('pics', file);
      });
    } else {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/awardTicket/admin/addAwardTicket`, formData, config);
}
export function addQualityRectification(params) {
  const formData = new FormData();

  for (const key in params) {
    // file list
    if (key === 'fileList') {
      Array.from(params[key]).forEach((file) => {
        formData.append('pics', file);
      });
    } else {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/qualityRectification/admin/addQualityRectification`, formData, config);
}
export function addQualityFine(params) {
  const formData = new FormData();

  for (const key in params) {
    // file list
    if (key === 'fileList') {
      Array.from(params[key]).forEach((file) => {
        formData.append('files', file);
      });
    } else {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/qualityFine/addQualityFine`, formData, config);
}

export function updateQualityState(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/quality/updateQualityState`, formData, config);
}
export function qualityCheckAgain(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/qualityRectification/qualityCheckAgain`, formData, config);
}
export function addComment(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }
  formData.append('token', getToken());
  return axios.post(`${apiRoot}/api/comment/addComment`, formData, config);
}
export function addNature(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/nature/admin/addNature`, formData, config);
}
export function updateNature(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/nature/admin/updateNature`, formData, config);
}
export function addCheckLists(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/checkLists/admin/addCheckLists`, formData, config);
}
export function updateCheckLists(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/checkLists/admin/updateCheckLists`, formData, config);
}
// 递归处理检查项
export function toDealWithCheckTheItem(childrenList, list, id, stringCheckItem) {
  let remark = false;
  for (const item in list) {
    if (list[item].value === id) {
      list[item].children = childrenList;
      // stringCheckItem += `${key}、${list[item].label}`;
      stringCheckItem.push(list[item].value);
      stringCheckItem.push(list[item].label);
      remark = true;
      break;
    } else {
      if (toDealWithCheckTheItem(childrenList, list[item].children, id, stringCheckItem)) {
        remark = true;
        break;
      }
    }
  }
  return remark;
}
// 打开子栏目 (newList: 子数组；list:总数组， param: 子数组的父对象)
export function handleShowChildren(childrenList, list, param) {
  let remark = false;
  for (const key in list) {
    if (key) {
      if (list[key].level < param.level && list[key].children.length > 0) {
        if (handleShowChildren(childrenList, list[key].children, param)) {
          remark = true;
          break;
        }
      } else if (list[key].level === param.level && list[key].id === param.id) {
        list[key].show = true;
        list[key].children = childrenList;
        remark = true;
        break;
      }
    }
  }
  return remark;
}
// 关闭子栏目 基础属性： 子数组， 原数组，插入对象
export function closeList(list, param) {
  let result = false;
  if (list[0].level < param.level) {
    for (const key in list) {
      if (list[key].children.length > 0) {
        if (closeList(list[key].children, param)) {
          result = true;
          break;
        }
      }
    }
  } else {
    for (const key in list) {
      if (key && list[key].id === param.id) {
        list[key].show = false;
        result = true;
        break;
      }
    }
  }
  return result;
}

// 插入
export function insertList(list, param) {
  let result = false;
  if (list[0].level < param.level) {
    for (const key in list) {
      if (list[key].children.length > 0) {
        if (insertList(list[key].children, param)) {
          result = true;
          break;
        }
      }
    }
  } else {
    for (const key in list) {
      if (key) {
        if (list[key].id === param.id) {
          list[key].show = true;
          list[key].children.push({
            level: list[key].level + 1,
            id: -new Date().getTime(),
            pid: param.id,
            edit: true,
            show: false,
            children: [],
          });
          result = true;
          break;
        }
      }
    }
  }
  return result;
}
