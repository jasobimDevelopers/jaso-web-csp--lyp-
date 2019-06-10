import request from './request';

export function getAttenceLogList(params) {
  return request.get('api/attenceLog/getAttenceLogList', {
    params,
  });
}

export function getAttenceLogListForEcharts(params) {
  return request.get('api/attenceLog/getAttenceLogListForEcharts', {
    params,
  });
}
