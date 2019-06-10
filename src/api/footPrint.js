import request from './request';
// 获取用户打点记录
export function getUserLogList(params) {
  return request.get('api/userLog/admin/getUserLogList', {
    params,
  });
}
// 用户记录 -- 按照个人
export function countUserLogByBar(params) {
  return request.get('api/userLog/admin/countUserLogByUserId', {
    params,
  });
}
// 用户记录 -- 按照项目
export function countUserLogByPart(params) {
  return request.get('api/userLog/admin/countPersonLogByPart', {
    params,
  });
}
// 用户记录 --根据id获取用户打点记录左表
export function countUserLogByUserId(params) {
  return request.get('api/userLog/admin/countUserLogByUserId', {
    params,
  });
}
// 新版本打点记录列表筛选查询表格导出
export function exportUserLogList(params) {
  return request.get('api/userLog/admin/exportUserLogList', {
    params,
  });
}

export function exportPersonLogList(params) {
  return request.get('api/userLog/admin/exportPersonLogList', {
    params,
  });
}

export function exportUserLogEcharts(params) {
  return request.get('api/userLog/admin/exportUserLogEcharts', {
    params,
  });
}

// 根据项目获取用户
export function getUserByProjectIds(params) {
  return request.get('api/user/admin/getUserByProjectIds', { params });
}
// 根据岗位获取用户
export function getUserListByUserType(params) {
  return request.get('', {
    params,
  });
}
// 项目分析之各项目按月统计
export function countUserLogProjectByMonth(params) {
  return request.get('api/userLog/admin/countUserLogByMonth', {
    params,
  });
}
// 项目分析之各功能区域占比
export function countUserLogProjectByPart(params) {
  return request.get('api/userLog/admin/countUserLogByPart', {
    params,
  });
}

