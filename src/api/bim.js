import request from './request';

// export function getModelViewToken(params) {
//   return request.get('http://jasobim.com.cn/iot/api/bimface/getModelViewToken', {
//     params,
//   });
// }
// 单体模型
export function getModelViewToken(params) {
  return request.get('api/bimface/getModelViewToken', {
    params,
  });
}
// 集成模型
export function getModeViewTokenByIntegrateId(params) {
  return request.get('api/bimface/getModeViewTokenByIntegrateId', {
    params,
  });
}

export function getGroupModelViewToken(params) {
  return request.get('api/bimface/getModeViewTokenByIntegrateId', {
    params,
  });
}

