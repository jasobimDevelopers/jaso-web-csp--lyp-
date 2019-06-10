export function spliteWords(words, count) {
  if (words && words.length > count) {
    words = `${words.substring(0, count)}...`;
  }
  return words;
}

// file root
export function setFileRoot(url) {
  const fileRoot = 'http://jasobim.com:8080/';

  return `${fileRoot}${url}`;
}

// file root
export function setFileRootForDownload(url) {
  const fileRoot = 'http://jasobim.com:8080';

  return `${fileRoot}${url}`;
}

// file size
export function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / (k ** i)).toPrecision(3)} ${sizes[i]}`;
}

// build parse
export function parseBuildingArr(buildingNum, buildingNumBase) {
  // const perArrCount = 10;
  buildingNum = Number(buildingNum);
  buildingNumBase = Number(buildingNumBase);
  const restBuilding = buildingNum - buildingNumBase;

  const floorNumArr = [];
  // 这里是以前每隔perArrCount放一个select的排序
  // if (buildingNum > 0) {
  //   if (buildingNumBase > 0) {
  //     const firstArr = [];
  //     for (let i = 1; i <= buildingNumBase; i += 1) {
  //       firstArr.push(-i);
  //     }

  //     floorNumArr.push(firstArr);
  //   }

  //   const len = floorNumArr.length;
  //   for (let i = 0; i < restBuilding; i += 1) {
  //     const index = len + parseInt(i / perArrCount, 10);

  //     if (!floorNumArr[index]) {
  //       floorNumArr[index] = [];
  //     }
  //     floorNumArr[index].push(i + 1);
  //   }
  // }
  if (buildingNum > 0) {
    if (buildingNumBase > 0) {
      for (let i = 1; i <= buildingNumBase; i += 1) {
        floorNumArr.push(-i);
      }
    }

    for (let i = 0; i < restBuilding; i += 1) {
      floorNumArr.push(i + 1);
    }
  }

  return floorNumArr;
}

// status 0: 未完成, 1: 已完成
export function setStatus(status) {
  return (status && status === 1) ? '已完成' : '未完成';
}

export function setWeekInfo(week) {
  const dayOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  return dayOfWeek[week];
}

// user role name map
export const roleList = ['管理员', '普通用户', '投资方', '项目人员/项目负责人', '游客', '项目工匠'];
export function setUserRole(userType) {
  return roleList[userType];
}

// user system
export const systemTypeList = ['安装人员', '土建人员'];
export function setUserSystem(systemType) {
  return systemTypeList[systemType];
}

// work name
export const workNameList = [
  {
    name: '项目员工',
    list: ['技术员', '材料员', '质量员', '安全员', '施工员', '资料员', '机管员', '钢筋翻样员', '木工翻样员', '技术负责人', '安装负责人'],
  },
  {
    name: '公司内部员工',
    list: ['技术科长', '技术主管', '研发人员', '预算主管', '总经理', '副总经理', '质安科长', '预算员', '预算科长', '生产经理', '市场助理', '质量员'],
  },
  {
    name: '其他',
    list: ['管理员', '普通用户', '投资方', '项目人员/项目负责人', '项目经理', '常务经理', '土建负责人', 'BIM工程师'],
  },
];

// project stats list
export const projectStateList = [
  '未上线',
  '已上线',
];

// item
export const itemProfessionTypeList = ['全部', '电气', '暖通', '给排水', '消防'];
export const householdNumList = ['全部', '公共部位', 'N户型', 'Q户型', 'Q户型反', 'N户型反'];

// question
export const questionOfTypeList = ['全部', '安全', '质量', '其他'];
export const questionOfPriorityList = ['全部', '一般', '重要', '紧急'];
export const questionStateList = ['全部', '待解决', '已解决'];
export function getQuestionPercentInfo(name) {
  const infoMap = {
    sortPercent: {
      name: '一般',
      status: 'info',
    },
    importantPercent: {
      name: '重要',
      status: 'warning',
    },
    urgentPercent: {
      name: '紧急',
      status: 'exception',
    },
  };
  return infoMap[name];
}

// quantity
export const quantityTypeList = ['模型工程量', '预算工程量'];

// paper
export const paperProfessionTypeList = ['全部', '电气', '暖通', '给排水', '消防', '建筑', '装饰', '结构', '其他'];

// teach
export const teachTypeList = ['全部', '质量', '安全', '技术'];
export const videoTypes = ['视频', 'PDF', 'Word'];
export const videoGradeList = ['公司总交底', '项目交底', '留底资料', '通用交底'];

// duct
export const ductTypeList = ['全部', '风管', '桥架', '弯头'];
export const ductStateList = ['全部', '初始化', '出库', '安装', '完成'];

// log
export const projectPartList = ['全部', '模型区域', '图纸区域', '登录区域', '交底区域', '预制化区域', '紧急事项区域', '通知区域', '产值区域', '班组信息区域', '施工任务单', '预付单区域'];
export const phoneSystemList = ['全部', '苹果系统', '安卓系统'];

// weather
export const weatherList = ['晴', '小雪', '小雨', '阴', '多云', '浮尘', '雷阵雨', '沙尘暴', '雾', '雾霾', '暴雪', '暴雨', '大雪', '大雨'];

// question ticket
export const questionTicketTypeList = ['轻度', '中度', '严重'];

// task step people type
export const stepTaskType = ['班组长', '质量员', '安全员或其他', '施工员', '预算员', '经理'];

// process type
export const processType = ['施工任务单', '预付单'];

// status
export const buildTaskStatus = ['全部', '未完成', '已完成', '待修改'];

export const buildTaskWorkType = ['门卫', '保洁', '食堂', '测量放线', '电工', '电焊工', '临设', '文明施工', '其他'];

export const monthInfo = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export const seasonInfo = ['第一季度', '第二季度', '第三季度', '第四季度'];

export const functionType1 = ['模型区域', '图纸区域', '首页区域', '交底区域', '（预制化）进度管理区域', '安全区域',
  '消息通知', '（产值）统计管理区域', '（密码修改、意见反馈）个人中心区域', '规范查阅区域', '模型构建信息区域', '质量区域',
  '新闻资讯', '实测实量', '云盘管理', '物资管理', '劳动力监测', '考勤管理', '工程量变更', '进度管理'];

export const functionType = ['模型区域', '图纸区域', '首页区域', '交底区域', '进度管理区域', '安全区域',
  '消息通知', '统计管理区域', '个人中心区域', '规范查阅区域', '模型构建信息区域', '质量区域',
  '新闻资讯', '实测实量', '云盘管理', '物资管理', '劳动力监测', '考勤管理', '工程量变更', '进度管理'];

export const footPrintsActionType = ['浏览', '增加', '登录', '修改'];

export const footPrintsRoleList = ['管理员', '公司管理人员', '投资方', '项目管理人员', '游客', '项目工匠'];

export const buildTaskDayNight = [10.0, 6.0];

export const logConstructionPartName = [' 电气', '给排水', '消防系统', '通风工程'];

export const logConstructionPart = [
  ['结构预埋', '二次配管', '穿线并头', '桥架安装', '开关面板', '灯具安装', '电缆敷设', '住户箱安装', '公共箱安装', '防火封堵', '等电位', '防雷接地', '其他'],
  ['基础套管', '楼层套管', '雨落水管', '废物水立管', '横管吊装', '卫生器具', '给水立管', '给水支管', '通水通球', '压力排水', '室外配管', '设施调试', '其他'],
  ['地上消火栓立管', '地上消火栓支管安装', '地上消火栓箱安装', '地库消火栓立管', '地库消火栓立管', '地库喷淋支管安装', '管网试压', '喷淋头安装', '喷淋头安装', '机组设备', '联动调试', '其他'],
  ['支掉价预制', '风管法兰制作', '风管制作及加工', '风管支吊架安装', '风管系统吊装', '部件、风口', '测试运行', '其他']];

export const standardType = ['建筑施工规范', '建筑设计规范', '建筑结构规范', '市政路桥规范', '造价参考资料', '国际参考资料', '当地参考资料', '学习辅助资料', '未分类资料', '人防工程资料', '水利电力通讯'];

export const amapKey = 'f9a0033c4ccc9a43fd3046cd67c0abe3';
