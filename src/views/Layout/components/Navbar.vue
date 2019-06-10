<template>
  <div class="navbar">
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
    <div class="nav-wrapper flex-sb">
      <router-link to="/projectList" class="logo-wrapper flex-row">
        <img id="jaso-logo" src="@/assets/images/logo.png" />
        <div class="company-name">嘉实智慧安装</div>
      </router-link>

      <div class="right-menu flex-row">
        <!--<div class="menu-list flex-row" v-if="userInfo">-->
          <!--&lt;!&ndash; <router-link to="/#" class="menu-item">我的</router-link> &ndash;&gt;-->
          <!--<el-menu  class="el-menu-demo" mode="horizontal">-->
            <!--<el-submenu v-if="userInfo.userType === 0" index="1">-->
              <!--<template slot="title">用户管理</template>-->
              <!--<el-menu-item index="1-1">-->
                <!--<router-link v-if="userInfo.userType === 0" class="menu-item" to="/admin/UserManage">用户信息</router-link>-->
              <!--</el-menu-item>-->
              <!--<el-menu-item index="1-2">-->
                <!--<router-link v-if="userInfo.userType === 0" class="menu-item" to="/admin/FootPrint">打点记录</router-link>-->
              <!--</el-menu-item>-->
            <!--</el-submenu>-->
            <!--<el-menu-item index="2">-->
              <!--<router-link v-if="userInfo.userType === 0" to="/admin/setting" class="menu-item">设置</router-link>-->
            <!--</el-menu-item>-->
          <!--</el-menu>-->
        <!--</div>-->
        <div v-if = "userInfo">
          <el-dropdown placement="bottom-start" v-if="userInfo.userType === 0">
            <span class="el-dropdown-link">
              用户管理<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="height: 40px;width: 116px;line-height: 40px;">
                <router-link v-if="userInfo.userType === 0" class="menu-item" to="/admin/UserManage">{{$t('navbar.userMessage')}}</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="height: 40px;width: 116px;line-height: 40px;">
                <router-link v-if="userInfo.userType === 0" class="menu-item" to="/admin/FootPrint">{{$t('navbar.footPrint')}}</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="height: 40px;width: 116px;line-height: 40px;">
                <router-link v-if="userInfo.userType === 0" class="menu-item" to="/admin/FeedbackRecord">反馈记录</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="el-dropdown-link" style="margin-left: 40px;margin-right: 30px;" v-if="userInfo.userType === 0">
              <router-link v-if="userInfo.userType === 0" to="/admin/setting" class="menu-item">{{$t('navbar.setUp')}}</router-link>
          </span>
        </div>

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="userInfo.userIconUrl | setFileRoot">
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>
              admin
            </el-dropdown-item> -->
            <el-dropdown-item style="height: 40px;width: 116px;line-height: 40px;">
              <span @click="handleFeedback" style="display:block;">{{$t('navbar.feedback')}}</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFeedbackVisible"
      width="360px"
      :modal-append-to-body='false'
      @close="handleFeedbackCancel"
    >
      <div slot="title" style="font-weight: bolder">{{$t('navbar.feedback')}}</div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <span style="line-height: 25px;font-size: 13px;color: #c3c3c3">
        欢迎给我们提出意见和反馈
        <br/>
        您留下的每个字都将被用于改善我们的服务
      </span>
      <el-form ref="dialogFeedbackForm" :model="feedback" style="margin-top: 10px;">
        <el-form-item label="问题或反馈" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 7, maxRows: 10}"  v-model="feedback.content" placeholder="请输入.."></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="feedback.tel" style="width: 100%" placeholder="请输入电话号码或邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top: 20px;">
        <el-button @click="handleFeedbackCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSaveFeedback">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger';
import { addFeedback } from '@/api/feedback';

export default {
  name: 'Navbar',
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
    ]),
  },
  data() {
    return {
      dialogFeedbackVisible: false,
      feedback: {
        userName: '',
        content: '',
        tel: '',
      },
      user: null,
      // components: {
      //   Hamburger,
      // },
      // computed: {
      //   ...mapGetters([
      //     'sidebar',
      //     'userInfo',
      //   ]),
      // },
    };
  },
  created() {
    this.user = this.userInfo;
    this.feedback.userName = this.user.realName;
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    },
    handleFeedback() {
      this.dialogFeedbackVisible = true;
    },
    handleFeedbackCancel() {
      this.$refs.dialogFeedbackForm.resetFields();
      this.$refs.dialogFeedbackForm.$el.reset();
      this.dialogFeedbackVisible = false;
    },
    handleSaveFeedback() {
      addFeedback(this.feedback).then((res) => {
        if (res) {
          this.$message({
            type: 'success',
            message: this.$t('message.feedbackSuccess'),
          });
        }
      });
      this.handleFeedbackCancel();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .navbar {
    position: relative;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background-color: #ffffff;
    z-index: 10;
  }

  .nav-wrapper {
    margin: 0 auto;
    padding: 15px 0;
    width: 1200px;
    height: 70px;

    .logo-wrapper img {
      height: 40px;
    }

    .company-name {
      margin-left: 15px;
      font-size: 18px;
      font-weight: bolder;
    }
  }

  .right-menu {
    height: 100%;
    &:focus{
     outline: none;
    }

    .menu-list {
      font-size: 14px;

      .menu-item {
        padding: 0 15px;
        border-right: 1px solid #DCDFE6;

        &:last-child {
          border-right: none;
        }
      }
    }


    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .avatar-container {
      height: 32px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #cccccc;
        }
      }
    }
  }

  // media
  @media (max-width: 1200px) {
    .nav-wrapper {
      padding: 0 8px;
      width: 100%;
    }
  }
</style>
