<template>
  <div class="menu-wrapper">
    <router-link to="/projectList/index" v-if="project" class="project-name" style="width: 100%; margin-bottom: 0">
      <i class="el-icon-sort"></i>
      <span :title="project.name">{{ project.name | spliteWords(6) }}</span>
    </router-link>
    <div id="isShowMenu" v-if="isShowMenu">
      <template v-for="item in falgsList" v-if="!item.hidden && menuLists[item.children[0].path]">
        <div class="menu-block" :key="item.name">
          <header class="menu-header flex-row">
            <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon" size="18px"></svg-icon>
            <el-popover
              placement="right-start"
              width="200px"
              trigger="hover">
              <ul v-for="menu in item.children" :key="menu.name" style="margin-left: -30px;margin-top: 5px;list-style-type: none;">
                <a @mouseover="hoverIcon(menu.name,true)" @mouseout="hoverIcon(menu.name,false)" @click="pitchOn(menu.name)">
                  <li style="font-size: 12px">
                    {{ menu.meta.title }}<i v-if="menuLists[menu.path][0]===0" :id="'icons-'+menu.name" style="margin-top: 5px;float: right" class="icon-ok"></i>
                    <i v-if="menuLists[menu.path][0]===1"  :id="'icons-'+menu.name" style="margin-top: 5px;float: right" class="icon-no"></i>
                  </li>
                </a>
              </ul>
              <a slot="reference" style="width: 120px;margin-right: -10px;margin-bottom: 5px">{{ item.meta.title }}<i style="float: right" class="el-icon-arrow-right"></i></a>
            </el-popover>
          </header>
          <div class="menu-list" v-if="item.children.length > 0">
            <router-link v-show="menuLists[menu.path][0] === 0" :id="menu.name" :to="`/${item.meta.basePath}/${projectId}/${menu.path}`" v-for="menu in item.children" :key="menu.name">
              <span>{{ menu.meta.title }}</span>
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { generateTitle } from '@/utils/i18n';
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown';
import { getConstructionTaskList, updateUserMenuLog, addUserMenuLog } from '@/api/sidebarItem';

export default {
  name: 'SidebarItem',
  components: { ElSelectDropdown },
  props: {
    routes: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
      project: 'project',
    }),
    projectId() {
      const { params } = this.$route;
      const id = (params && params.id) ? params.id : null;
      return id;
    },
  },
  created() {
    this.getMenuList();
  },
  beforeMount() {
  },
  mounted() {
  },
  methods: {
    generateTitle,
    // getList() {
    //   //  获得质量安全小红点。
    //   console.log(this.project);
    //   getAboutMeNums({ projectId: this.project.id, type: 0 }).then((data) => {
    //     if (data) {
    //       console.log(data);
    //     }
    //   });
    // },
    // 获得用户权限下的菜单集合
    getMenuList() {
      const ephemeralDatas = {};
      const msg = this;
      // 获得用户锁定菜单的操作记录
      getConstructionTaskList({ userId: this.userMsg.id }).then((res) => {
        res.data.forEach((row) => { // 遍历循环数据
          ephemeralDatas[row.menuPath] = [row.lockStatus, row.id];
        });
        msg.menuLists = ephemeralDatas;
        const ephemeralData = [];
        msg.routes.forEach((res2) => {
          if (!res2.hidden && res2.children) {
            ephemeralData.push(res2);
          }
        });
        msg.falgsList = ephemeralData;
        msg.falgsList.forEach((res2) => {
          res2.children.forEach((row) => {
            if (msg.menuLists[row.path] === undefined) { // 数据库中没有操作记录数据
              msg.menuLists[row.path] = [1, null];
            }
          });
        });
        msg.isShowMenu = true;
      });
    },
    pitchOn(meunBarPath) {
      let islockStatus = 0; // 初始化不锁定
      if (this.menuLists[meunBarPath][0] === 0) { // 锁定菜单
        this.menuLists[meunBarPath][0] = 1;
        this.isShowMenu = false;
        this.$nextTick(() => {
          this.isShowMenu = true;
        });
        islockStatus = 1;
      } else { // 取消锁定
        this.menuLists[meunBarPath][0] = 0;
        this.isShowMenu = false;
        this.$nextTick(() => {
          this.isShowMenu = true;
        });
        islockStatus = 0;
      }
      if (this.menuLists !== null && this.menuLists[meunBarPath][1] !== null) {
        const params = { // 更新所需的参数
          id: this.menuLists[meunBarPath][1],
          lockStatus: islockStatus,
        };
        updateUserMenuLog(params); // 更新菜单锁定的操作记录
      } else {
        const userMentList = this.userMsg.menuList;
        let menuPid = null;
        let menuChildId = null;
        userMentList.forEach((res) => {
          if (res.children) {
            res.children.forEach((res2) => {
              if (res2.menuPath === meunBarPath) {
                menuPid = res.id;
                menuChildId = res2.id;
              }
            });
          }
        });
        const params = {
          userId: this.userMsg.id,
          menuPath: meunBarPath,
          menuPid,
          menuChildId,
          lockStatus: 0,
        };
        addUserMenuLog(params);
      }
    },
    hoverIcon(meunBarPath, hour) {
      const meunBar = document.getElementById(meunBarPath);
      const meunBarIcon = document.getElementById(`icons-${meunBarPath}`);
      if (hour) { // 鼠标移入
        meunBarIcon.className = this.icon_hover;
      } else { // 鼠标移出
        if (meunBar.style.display === '') { // 该菜单未被锁定
          meunBarIcon.className = this.icon_ok;
        } else {
          meunBarIcon.className = this.icon_no; // 菜单已锁定
        }
      }
    },
  },
  data() {
    return {
      menuLists: {},
      falgsList: [],
      displayNone: 'none',
      icon_ok: 'icon-ok',
      icon_no: 'icon-no',
      icon_hover: 'icon-hover',
      project_detail_info: 'project_detail_info',
      isShowMenu: false,
    };
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .project-name {
    height: 48px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    line-height: 48px;
    background: #409EFF;

    .el-icon-sort {
      transform: rotate(90deg);
    }
  }
  .icon-ok {
    display:inline-block;
    width:10px;
    height:10px;
    background:url("../../../../assets/images/ok.png") left no-repeat;
  }
  .icon-no {
    display:inline-block;
    width:10px;
    height:10px;
    background:url("../../../../assets/images/no.png") left no-repeat;
  }
  .icon-hover {
    display:inline-block;
    width:10px;
    height:10px;
    background:url("../../../../assets/images/hover.png") left no-repeat;
  }
</style>
