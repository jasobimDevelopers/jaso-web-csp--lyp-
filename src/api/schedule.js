import axios from 'axios';
import { getToken } from '@/utils/auth';
import request, { apiRoot, config } from './request';

export function getprojectProcessList(params) {
  return request.get('api/projectProcess/admin/getprojectProcessList', {
    params,
  });
}

export function importProjectProcessByProjectId(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/projectProcess/importProjectProcessByProjectId`, formData, config);
}

export function addProjectProcess(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/projectProcess/admin/addProjectProcess`, formData, config);
}

export function updateProjectProcess(params) {
  const formData = new FormData();

  for (const key in params) {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  }

  formData.append('token', getToken());

  return axios.post(`${apiRoot}/api/projectProcess/admin/updateProjectProcess`, formData, config);
}

// 根据输入的名称查询
export function findProjectProcessList(params) {
  return request.get('api/projectProcess/findProjectProcessList', {
    params,
  });
}

// 删除
export function deleteProjectProcess(params) {
  return request.get('api/projectProcess/admin/deleteprojectProcess', {
    params,
  });
}

// 打开子栏目 基础属性： 子数组， 原数组，插入对象
export function showList(newList, oldList, param) {
  let result = false;
  if (oldList[0].level < param.level) {
    for (const key in oldList) {
      if (oldList[key].children.length > 0) {
        if (showList(newList, oldList[key].children, param)) {
          result = true;
          break;
        }
      }
    }
  } else if (oldList[0].level === param.level) {
    for (const key in oldList) {
      if (key) {
        if (oldList[key].id === param.id) {
          oldList[key].show = true;
          oldList[key].children = newList;
          result = true;
          break;
        }
      }
    }
  }
  return result;
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

// 编辑
export function updateList(list, param) {
  let result = false;
  if (list[0].level < param.level) {
    for (const key in list) {
      if (list[key].children.length > 0) {
        if (updateList(list[key].children, param)) {
          result = true;
          break;
        }
      }
    }
  } else {
    for (const key in list) {
      if (key) {
        if (list[key].id === param.id) {
          list[key].edit = true;
          result = true;
          break;
        }
      }
    }
  }
  return result;
}

// 编辑移除；新增撤销 默认新增对象初始化id为负值，
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

// 新增后，只需要把id赋值回去; 添加部分初始值
export function saveList(list, param, id) {
  let result = false;
  if (list[0].level < param.level) {
    for (const key in list) {
      if (list[key].children.length > 0) {
        if (saveList(list[key].children, param, id)) {
          result = true;
          break;
        }
      }
    }
  } else {
    for (const key in list) {
      if (key) {
        if (list[key].id === param.id) {
          list[key].id = id;
          list[key].edit = false;
          list[key].startTime = param.startTime;
          list[key].endTime = param.endTime;
          result = true;
          break;
        }
      }
    }
  }
  return result;
}

// 删除
export function deleteList(list, param) {
  let result = false;
  if (list[0].level < param.level) {
    for (const key in list) {
      if (list[key].children.length > 0) {
        if (deleteList(list[key].children, param)) {
          result = true;
          break;
        }
      }
    }
  } else {
    for (const key in list) {
      if (key) {
        if (list[key].id === param.id) {
          list.splice(Number(key), 1);
          result = true;
          break;
        }
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
            taskName: '',
            durationDate: null,
            startDate: null,
            endDate: null,
          });
          result = true;
          break;
        }
      }
    }
  }
  return result;
}

//  日期格式化为string 识别
export function dateformat(date) {
  const month = date.getMonth() + 1;
  if (month <= 9) {
    return `${date.getFullYear()}-0${month}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  return `${date.getFullYear()}-${month}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
// 获取月长度
export function monthLength(date) {
  return new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
}

// 处理月份数组
export function handleMonthList(startDate, endDate) {
  const dateList = [];
  for (let begin = new Date(startDate.getTime()); begin.getTime() < endDate.getTime(); begin.setMonth(begin.getMonth() + 1)) {
    const month = begin.getMonth();
    if (month < 9) {
      dateList.push(`${begin.getFullYear()}-0${month + 1}`);
    } else {
      dateList.push(`${begin.getFullYear()}-${month + 1}`);
    }
  }
  return dateList;
}

// 处理甘特基本信息
export function handleGanttMsg(startDate, endDate) {
  const dateList = [];
  for (let begin = new Date(startDate.getTime()); begin.getTime() < endDate.getTime(); begin.setMonth(begin.getMonth() + 1)) {
    const month = begin.getMonth();
    if (month < 9) {
      dateList.push(`${begin.getFullYear()}-0${month + 1}`);
    } else {
      dateList.push(`${begin.getFullYear()}-${month + 1}`);
    }
  }

  startDate = new Date(`${startDate.getFullYear()}-${startDate.getMonth() + 1}-01 00:00:01`);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate = new Date(`${endDate.getFullYear()}-${endDate.getMonth() + 1}-01 00:00:01`);
  return {
    monthList: dateList,
    denominator: (endDate.getTime() - startDate.getTime()) / 80 / dateList.length,
    width: `${80 * dateList.length}px`,
    start: startDate,
    end: endDate,
  };
}

// 递归处理宽度
export function handleGanttWidth(list, denominator, start) {
  list.forEach((item) => {
    item.endTime = (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / denominator;
    item.startTimeTemp = (new Date(item.startDate).getTime() - start.getTime()) / denominator;
    if (item.children && item.children.length > 0) {
      handleGanttWidth(item.children, denominator, start);
    }
  });
}

// 处理好初始以及结束的长度后进行调用 obj, param, objlist
export function ganteTitleChange() {
  // 比较初始日期以及结束日期
}

