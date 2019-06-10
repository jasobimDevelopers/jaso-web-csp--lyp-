import Vue from 'vue';
import Router from 'vue-router';
import BimModel2 from '../views/Model/Bim2';

/* Layout */
import Layout from '../views/Layout';
import commonLayout from '../views/Layout/common';

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
*/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
                                 this attribute is invalid later.
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
    basePath: 'project',         record the own for path for SideBar comp
    redirect: 'projectManage',   try to redirect to child link fro Breadcrumb comp
  }
*/

const asyncImport = file => () => import(`@/views/${file}`);

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/',
    name: 'home',
    component: asyncImport('Home'),
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: asyncImport('Login'),
    hidden: true,
  },
  {
    path: '/qrcodeItem',
    name: 'qrcodeItem',
    component: asyncImport('Qrcode'),
    hidden: true,
  },
  {
    path: '/bim_mode2',
    component: BimModel2,
    name: 'bim_mode2',
    hidden: true,
  },
  {
    path: '/model',
    name: 'model',
    component: asyncImport('Model/mobileBim'),
    hidden: true,
  },
  { path: '/404', component: asyncImport('errorPage/404'), hidden: true },
  { path: '/401', component: asyncImport('errorPage/401'), hidden: true },
];

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});
// admin routers
export const adminRouterMap = [
  {
    path: '/admin',
    component: commonLayout,
    redirect: '/admin/UserManage',
    meta: { roles: ['admin'] },
    hidden: true,
    children: [{
      path: 'UserManage',
      component: asyncImport('UserManage'),
      name: 'UserManage',
    }, {
      path: 'FootPrint',
      component: asyncImport('FootPrint'),
      name: 'FootPrint',
    }, {
      path: 'setting',
      component: asyncImport('Setting'),
      name: 'setting',
    }, {
      path: 'FeedbackRecord',
      component: asyncImport('FeedbackRecord'),
      name: 'FeedbackRecord',
    }],
  },
];

// async menu list routers
export const asyncRouterMap = [
  /* ******* Common Layout ******* */
  {
    path: '/projectList',
    component: commonLayout,
    redirect: '/projectList/index',
    meta: { roles: ['admin', 'user'] },
    hidden: true,
    children: [{
      path: 'index',
      component: asyncImport('ProjectList'),
      name: 'ProjectList',
    }],
  },
  /* ******* /Common Layout ******* */
  {
    path: '/project/:id',
    component: Layout,
    name: 'project',
    meta: {
      basePath: 'project',
      icon: '生产',
      title: '生产管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'project_detail_info',
      component: asyncImport('Project/ProjectInformation'),
      // component: asyncImport('Project/BasicInfo'),
      name: 'project_detail_info',
      meta: {
        title: '项目基本信息',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'construction_task',
      // component: asyncImport('Project/TaskList'),
      component: asyncImport('Project/BuildTask'),
      name: 'construction_task',
      meta: {
        title: '施工任务单',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'construction_log',
      // component: asyncImport('Project/ConstructionLog'),
      component: asyncImport('Project/workLog'),
      name: 'construction_log',
      meta: {
        title: '施工日志',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'order',
      component: asyncImport('Project/OrderList'),
      name: 'order',
      meta: {
        title: '预付单',
        roles: ['admin', 'user'],
      },
    }],
  },
  {
    path: '/mode_manager/:id',
    component: Layout,
    name: 'mode_manager',
    meta: {
      basePath: 'mode_manager',
      icon: 'BIM',
      title: '模型管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'bim_mode',
      component: asyncImport('Model/Bim'),
      name: 'bim_mode',
      meta: {
        title: '模型查看',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'item',
      component: asyncImport('Model/Item'),
      name: 'item',
      meta: {
        title: '模型工程量',
        roles: ['admin', 'user'],
      },
    }],
  },
  {
    path: '/cost/:id',
    component: Layout,
    name: 'cost',
    meta: {
      basePath: 'cost',
      icon: '成本额',
      title: '成本管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'budget',
      component: asyncImport('Cost/Budget'),
      name: 'budget',
      meta: {
        title: '预算',
        roles: ['admin', 'user'],
      },
    }],
  },
  {
    path: '/statistics/:id',
    component: Layout,
    name: 'statistics',
    meta: {
      basePath: 'statistics',
      icon: '统计',
      title: '统计管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'value_output',
      // component: asyncImport('Statistics/Output'),
      component: asyncImport('Statistics/OutputValue'),
      name: 'value_output',
      meta: {
        title: '产值统计',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'workers',
      component: asyncImport('Statistics/Workers'),
      name: 'workers',
      meta: {
        title: '用工统计',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'attendance',
      component: asyncImport('Statistics/Attendance'),
      name: 'attendance',
      meta: {
        title: '考勤管理',
        roles: ['admin', 'user'],
      },
    }],
  },
  {
    path: '/material/:id',
    component: Layout,
    name: 'material',
    meta: {
      basePath: 'material',
      icon: '物资',
      title: '物资管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'material_count',
      component: asyncImport('Material/MaterialCount'),
      name: 'material_count',
      meta: {
        title: '物资统计',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'material_plan',
      component: asyncImport('Material/MaterialPlanEdit'),
      name: 'material_plan',
      meta: {
        title: '材料计划',
        roles: ['admin', 'user'],
      },
    },
    {
      path: 'contract_lofting',
      component: asyncImport('Material/ContractLofting'),
      name: 'contract_lofting',
      meta: {
        title: '合同翻样量',
        roles: ['admin', 'user'],
      },
    }],
  },
  {
    path: '/quality/:id',
    component: Layout,
    name: 'quality',
    meta: {
      basePath: 'quality',
      icon: '质量',
      title: '质量管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'quality_question',
      component: asyncImport('Quality/QualityList'),
      name: 'quality_question',
      meta: {
        title: '质量整改单',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'quality_ticket',
      component: asyncImport('Quality/QualityTicket'),
      name: 'quality_ticket',
      meta: {
        title: '质量罚款单',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'quality_examine',
      component: asyncImport('Quality/QualityExamine'),
      name: 'quality_examine',
      meta: {
        title: '质量检查',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'quality_rectify',
      component: asyncImport('Quality/QualityRectify'),
      name: 'quality_rectify',
      meta: {
        title: '质量整改',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'quality_reward',
      component: asyncImport('Quality/QualityReward'),
      name: 'quality_reward',
      meta: {
        title: '质量奖惩',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'quality_infrastructure',
      component: asyncImport('Quality/QualityInfrastructure'),
      name: 'quality_infrastructure',
      meta: {
        title: '基础设置',
        roles: ['admin', 'user'],
      },
    },
      // {
      //   path: 'quality_feedback',
      //   component: asyncImport('ProjectManage'),
      //   name: 'quality_feedback',
      //   meta: {
      //     title: '质量整改反馈单',
      //     roles: ['admin', 'user'],
      //   },
      // }
    ],
  },
  {
    path: '/security/:id',
    component: Layout,
    name: 'security',
    meta: {
      basePath: 'security',
      icon: '安全-menu',
      title: '安全管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'security_question',
      component: asyncImport('Security/SecurityList'),
      name: 'security_question',
      meta: {
        title: '安全整改单',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'security_ticket',
      component: asyncImport('Security/SecurityTicket'),
      name: 'security_ticket',
      meta: {
        title: '安全罚款单',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'security_examine',
      component: asyncImport('Security/SecurityExamine'),
      name: 'security_examine',
      meta: {
        title: '安全检查',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'security_rectify',
      component: asyncImport('Security/SecurityRectify'),
      name: 'security_rectify',
      meta: {
        title: '安全整改',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'security_reward',
      component: asyncImport('Security/SecurityReward'),
      name: 'security_reward',
      meta: {
        title: '安全奖惩',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'security_infrastructure',
      component: asyncImport('Security/SecurityInfrastructure'),
      name: 'security_infrastructure',
      meta: {
        title: '基础设置',
        roles: ['admin', 'user'],
      },
    },
      // {
      //   path: 'question_feedback',
      //   component: asyncImport('ProjectManage'),
      //   name: 'question_feedback',
      //   meta: {
      //     title: '安全整改反馈单',
      //     roles: ['admin', 'user'],
      //   },
      // }
    ],
  },
  {
    path: '/datas/:id',
    component: Layout,
    name: 'datas',
    meta: {
      basePath: 'datas',
      icon: '资料',
      title: '资料管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'file',
      component: asyncImport('Datas/File'),
      name: 'file',
      meta: {
        title: '云盘协同',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'video',
      component: asyncImport('Datas/Video'),
      name: 'video',
      meta: {
        title: '交底',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'standard',
      component: asyncImport('Datas/Standard'),
      // component: asyncImport('Datas/JasoActive'),
      name: 'standard',
      meta: {
        title: '规范查阅',
        roles: ['admin', 'user'],
      },
    },
    ],
  },
  {
    path: '/work_manage/:id',
    component: Layout,
    name: 'work_manage',
    meta: {
      basePath: 'work_manage',
      icon: '劳务',
      title: '劳务管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'mechanic',
      component: asyncImport('WorkManage/Mechanic'),
      name: 'mechanic',
      meta: {
        title: '技工考勤',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'roster',
      component: asyncImport('WorkManage/Roster'),
      name: 'roster',
      meta: {
        title: '人员花名册',
        roles: ['admin', 'user'],
      },
    }],
  },
  {
    path: '/project_process/:id',
    component: Layout,
    name: 'project_process',
    meta: {
      basePath: 'project_process',
      icon: '进度',
      title: '进度管理',
      roles: ['admin', 'user'],
    },
    children: [{
      path: 'schedule',
      component: asyncImport('ProjectProcess/Schedule'),
      name: 'schedule',
      meta: {
        title: '进度计划',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'image_record',
      component: asyncImport('ProjectProcess/ImageRecord'),
      name: 'image_record',
      meta: {
        title: '形象进度',
        roles: ['admin', 'user'],
      },
    }, {
      path: 'model_progress',
      component: asyncImport('ProjectProcess/ModelProgress'),
      name: 'model_progress',
      meta: {
        title: '模型进度',
        roles: ['admin', 'user'],
      },
    }],
  },
  { path: '*', redirect: '/404', hidden: true },
];

